const express = require('express');
const router = express.Router();
const sql = require('mssql');

// Get all alerts
router.get('/', async (req, res) => {
  try {
    const pool = await sql.connect();
    const result = await pool.request().query(`
      SELECT a.*, d.Name as DeviceName 
      FROM Alerts a
      JOIN Devices d ON a.DeviceID = d.DeviceID
      ORDER BY a.Timestamp DESC
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching alerts:', err);
    res.status(500).send('Server Error');
  }
});

// Get alerts by device ID
router.get('/device/:deviceId', async (req, res) => {
  try {
    const pool = await sql.connect();
    const result = await pool.request()
      .input('deviceId', sql.Int, req.params.deviceId)
      .query(`
        SELECT a.*, d.Name as DeviceName 
        FROM Alerts a
        JOIN Devices d ON a.DeviceID = d.DeviceID
        WHERE a.DeviceID = @deviceId
        ORDER BY a.Timestamp DESC
      `);
    
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching device alerts:', err);
    res.status(500).send('Server Error');
  }
});

// Get alert by ID
router.get('/:id', async (req, res) => {
  try {
    const pool = await sql.connect();
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query(`
        SELECT a.*, d.Name as DeviceName 
        FROM Alerts a
        JOIN Devices d ON a.DeviceID = d.DeviceID
        WHERE a.AlertID = @id
      `);
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    
    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Error fetching alert:', err);
    res.status(500).send('Server Error');
  }
});

// Add new alert
router.post('/', async (req, res) => {
  const { deviceId, severity, message, source } = req.body;
  
  try {
    const pool = await sql.connect();
    const result = await pool.request()
      .input('deviceId', sql.Int, deviceId)
      .input('severity', sql.NVarChar, severity)
      .input('message', sql.NVarChar, message)
      .input('source', sql.NVarChar, source)
      .query(`
        INSERT INTO Alerts (DeviceID, Severity, Message, Source, Timestamp, Status)
        VALUES (@deviceId, @severity, @message, @source, GETDATE(), 'New');
        SELECT SCOPE_IDENTITY() AS AlertID;
      `);
    
    res.status(201).json({ 
      message: 'Alert created successfully', 
      alertId: result.recordset[0].AlertID 
    });
  } catch (err) {
    console.error('Error creating alert:', err);
    res.status(500).send('Server Error');
  }
});

// Update alert status
router.put('/:id/status', async (req, res) => {
  const { status } = req.body;
  
  try {
    const pool = await sql.connect();
    await pool.request()
      .input('id', sql.Int, req.params.id)
      .input('status', sql.NVarChar, status)
      .query(`
        UPDATE Alerts
        SET Status = @status,
            ResolutionTimestamp = CASE WHEN @status = 'Resolved' THEN GETDATE() ELSE ResolutionTimestamp END
        WHERE AlertID = @id
      `);
    
    res.json({ message: 'Alert status updated successfully' });
  } catch (err) {
    console.error('Error updating alert status:', err);
    res.status(500).send('Server Error');
  }
});

// Delete alert
router.delete('/:id', async (req, res) => {
  try {
    const pool = await sql.connect();
    await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('DELETE FROM Alerts WHERE AlertID = @id');
    
    res.json({ message: 'Alert deleted successfully' });
  } catch (err) {
    console.error('Error deleting alert:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

