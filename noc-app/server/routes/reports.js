const express = require('express');
const router = express.Router();
const sql = require('mssql');

// Get alert statistics
router.get('/alert-stats', async (req, res) => {
  try {
    const pool = await sql.connect();
    
    // Get alert counts by severity
    const severityResult = await pool.request().query(`
      SELECT Severity, COUNT(*) as Count
      FROM Alerts
      GROUP BY Severity
    `);
    
    // Get alert counts by status
    const statusResult = await pool.request().query(`
      SELECT Status, COUNT(*) as Count
      FROM Alerts
      GROUP BY Status
    `);
    
    // Get alert counts by day (last 7 days)
    const timelineResult = await pool.request().query(`
      SELECT 
        CAST(Timestamp AS DATE) as Date,
        COUNT(*) as Count
      FROM Alerts
      WHERE Timestamp >= DATEADD(day, -7, GETDATE())
      GROUP BY CAST(Timestamp AS DATE)
      ORDER BY CAST(Timestamp AS DATE)
    `);
    
    res.json({
      bySeverity: severityResult.recordset,
      byStatus: statusResult.recordset,
      timeline: timelineResult.recordset
    });
  } catch (err) {
    console.error('Error fetching alert statistics:', err);
    res.status(500).send('Server Error');
  }
});

// Get incident statistics
router.get('/incident-stats', async (req, res) => {
  try {
    const pool = await sql.connect();
    
    // Get incident counts by priority
    const priorityResult = await pool.request().query(`
      SELECT Priority, COUNT(*) as Count
      FROM Incidents
      GROUP BY Priority
    `);
    
    // Get incident counts by status
    const statusResult = await pool.request().query(`
      SELECT Status, COUNT(*) as Count
      FROM Incidents
      GROUP BY Status
    `);
    
    // Get average resolution time (in hours)
    const resolutionTimeResult = await pool.request().query(`
      SELECT 
        AVG(DATEDIFF(hour, CreatedAt, ResolvedAt)) as AvgResolutionHours
      FROM Incidents
      WHERE Status = 'Resolved' AND ResolvedAt IS NOT NULL
    `);
    
    // Get incident counts by day (last 30 days)
    const timelineResult = await pool.request().query(`
      SELECT 
        CAST(CreatedAt AS DATE) as Date,
        COUNT(*) as Count
      FROM Incidents
      WHERE CreatedAt >= DATEADD(day, -30, GETDATE())
      GROUP BY CAST(CreatedAt AS DATE)
      ORDER BY CAST(CreatedAt AS DATE)
    `);
    
    res.json({
      byPriority: priorityResult.recordset,
      byStatus: statusResult.recordset,
      avgResolutionTime: resolutionTimeResult.recordset[0]?.AvgResolutionHours || 0,
      timeline: timelineResult.recordset
    });
  } catch (err) {
    console.error('Error fetching incident statistics:', err);
    res.status(500).send('Server Error');
  }
});

// Get device status summary
router.get('/device-status', async (req, res) => {
  try {
    const pool = await sql.connect();
    
    // Get device counts by status
    const statusResult = await pool.request().query(`
      SELECT Status, COUNT(*) as Count
      FROM Devices
      GROUP BY Status
    `);
    
    // Get device counts by type
    const typeResult = await pool.request().query(`
      SELECT Type, COUNT(*) as Count
      FROM Devices
      GROUP BY Type
    `);
    
    // Get devices with most alerts
    const alertsResult = await pool.request().query(`
      SELECT TOP 10
        d.DeviceID,
        d.Name,
        COUNT(a.AlertID) as AlertCount
      FROM Devices d
      LEFT JOIN Alerts a ON d.DeviceID = a.DeviceID
      GROUP BY d.DeviceID, d.Name
      ORDER BY AlertCount DESC
    `);
    
    res.json({
      byStatus: statusResult.recordset,
      byType: typeResult.recordset,
      mostAlerts: alertsResult.recordset
    });
  } catch (err) {
    console.error('Error fetching device status summary:', err);
    res.status(500).send('Server Error');
  }
});

// Get detailed report for a specific time period
router.get('/detailed', async (req, res) => {
  const { startDate, endDate } = req.query;
  
  try {
    const pool = await sql.connect();
    
    // Validate dates
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }
    
    // Get alerts in time period
    const alertsResult = await pool.request()
      .input('startDate', sql.Date, startDate)
      .input('endDate', sql.Date, endDate)
      .query(`
        SELECT a.*, d.Name as DeviceName
        FROM Alerts a
        JOIN Devices d ON a.DeviceID = d.DeviceID
        WHERE a.Timestamp BETWEEN @startDate AND @endDate
        ORDER BY a.Timestamp DESC
      `);
    
    // Get incidents in time period
    const incidentsResult = await pool.request()
      .input('startDate', sql.Date, startDate)
      .input('endDate', sql.Date, endDate)
      .query(`
        SELECT i.*, d.Name as DeviceName
        FROM Incidents i
        LEFT JOIN Devices d ON i.DeviceID = d.DeviceID
        WHERE i.CreatedAt BETWEEN @startDate AND @endDate
        ORDER BY i.CreatedAt DESC
      `);
    
    // Get summary statistics
    const summaryResult = await pool.request()
      .input('startDate', sql.Date, startDate)
      .input('endDate', sql.Date, endDate)
      .query(`
        SELECT
          (SELECT COUNT(*) FROM Alerts WHERE Timestamp BETWEEN @startDate AND @endDate) as TotalAlerts,
          (SELECT COUNT(*) FROM Incidents WHERE CreatedAt BETWEEN @startDate AND @endDate) as TotalIncidents,
          (SELECT COUNT(*) FROM Incidents WHERE Status = 'Resolved' AND ResolvedAt BETWEEN @startDate AND @endDate) as ResolvedIncidents,
          (SELECT AVG(DATEDIFF(hour, CreatedAt, ResolvedAt)) FROM Incidents WHERE Status = 'Resolved' AND ResolvedAt BETWEEN @startDate AND @endDate) as AvgResolutionHours
      `);
    
    res.json({
      summary: summaryResult.recordset[0],
      alerts: alertsResult.recordset,
      incidents: incidentsResult.recordset,
      timeRange: {
        startDate,
        endDate
      }
    });
  } catch (err) {
    console.error('Error generating detailed report:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

