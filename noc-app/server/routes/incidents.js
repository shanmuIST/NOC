const express = require('express');
const router = express.Router();
const sql = require('mssql');

// Get all incidents
router.get('/', async (req, res) => {
  try {
    const pool = await sql.connect();
    const result = await pool.request().query(`
      SELECT i.*, d.Name as DeviceName 
      FROM Incidents i
      LEFT JOIN Devices d ON i.DeviceID = d.DeviceID
      ORDER BY i.CreatedAt DESC
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching incidents:', err);
    res.status(500).send('Server Error');
  }
});

// Get incident by ID
router.get('/:id', async (req, res) => {
  try {
    const pool = await sql.connect();
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query(`
        SELECT i.*, d.Name as DeviceName 
        FROM Incidents i
        LEFT JOIN Devices d ON i.DeviceID = d.DeviceID
        WHERE i.IncidentID = @id
      `);
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Incident not found' });
    }
    
    // Get related alerts for this incident
    const alertsResult = await pool.request()
      .input('incidentId', sql.Int, req.params.id)
      .query(`
        SELECT a.* 
        FROM Alerts a
        JOIN IncidentAlerts ia ON a.AlertID = ia.AlertID
        WHERE ia.IncidentID = @incidentId
      `);
    
    const incident = result.recordset[0];
    incident.relatedAlerts = alertsResult.recordset;
    
    res.json(incident);
  } catch (err) {
    console.error('Error fetching incident:', err);
    res.status(500).send('Server Error');
  }
});

// Create new incident
router.post('/', async (req, res) => {
  const { title, description, priority, deviceId, assignedTo, alertIds } = req.body;
  
  try {
    const pool = await sql.connect();
    const transaction = new sql.Transaction(pool);
    
    await transaction.begin();
    
    try {
      // Insert incident
      const incidentResult = await new sql.Request(transaction)
        .input('title', sql.NVarChar, title)
        .input('description', sql.NVarChar, description)
        .input('priority', sql.NVarChar, priority)
        .input('deviceId', sql.Int, deviceId)
        .input('assignedTo', sql.NVarChar, assignedTo)
        .query(`
          INSERT INTO Incidents (Title, Description, Priority, Status, DeviceID, AssignedTo, CreatedAt)
          VALUES (@title, @description, @priority, 'Open', @deviceId, @assignedTo, GETDATE());
          SELECT SCOPE_IDENTITY() AS IncidentID;
        `);
      
      const incidentId = incidentResult.recordset[0].IncidentID;
      
      // Link alerts to incident if provided
      if (alertIds && alertIds.length > 0) {
        for (const alertId of alertIds) {
          await new sql.Request(transaction)
            .input('incidentId', sql.Int, incidentId)
            .input('alertId', sql.Int, alertId)
            .query(`
              INSERT INTO IncidentAlerts (IncidentID, AlertID)
              VALUES (@incidentId, @alertId)
            `);
          
          // Update alert status to "In Progress"
          await new sql.Request(transaction)
            .input('alertId', sql.Int, alertId)
            .query(`
              UPDATE Alerts
              SET Status = 'In Progress'
              WHERE AlertID = @alertId
            `);
        }
      }
      
      await transaction.commit();
      
      res.status(201).json({ 
        message: 'Incident created successfully', 
        incidentId: incidentId 
      });
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  } catch (err) {
    console.error('Error creating incident:', err);
    res.status(500).send('Server Error');
  }
});

// Update incident
router.put('/:id', async (req, res) => {
  const { title, description, priority, status, deviceId, assignedTo } = req.body;
  
  try {
    const pool = await sql.connect();
    await pool.request()
      .input('id', sql.Int, req.params.id)
      .input('title', sql.NVarChar, title)
      .input('description', sql.NVarChar, description)
      .input('priority', sql.NVarChar, priority)
      .input('status', sql.NVarChar, status)
      .input('deviceId', sql.Int, deviceId)
      .input('assignedTo', sql.NVarChar, assignedTo)
      .query(`
        UPDATE Incidents
        SET Title = @title,
            Description = @description,
            Priority = @priority,
            Status = @status,
            DeviceID = @deviceId,
            AssignedTo = @assignedTo,
            UpdatedAt = GETDATE(),
            ResolvedAt = CASE WHEN @status = 'Resolved' AND Status != 'Resolved' THEN GETDATE() ELSE ResolvedAt END
        WHERE IncidentID = @id
      `);
    
    res.json({ message: 'Incident updated successfully' });
  } catch (err) {
    console.error('Error updating incident:', err);
    res.status(500).send('Server Error');
  }
});

// Add comment to incident
router.post('/:id/comments', async (req, res) => {
  const { comment, author } = req.body;
  
  try {
    const pool = await sql.connect();
    const result = await pool.request()
      .input('incidentId', sql.Int, req.params.id)
      .input('comment', sql.NVarChar, comment)
      .input('author', sql.NVarChar, author)
      .query(`
        INSERT INTO IncidentComments (IncidentID, Comment, Author, CreatedAt)
        VALUES (@incidentId, @comment, @author, GETDATE());
        SELECT SCOPE_IDENTITY() AS CommentID;
      `);
    
    res.status(201).json({ 
      message: 'Comment added successfully', 
      commentId: result.recordset[0].CommentID 
    });
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).send('Server Error');
  }
});

// Get comments for an incident
router.get('/:id/comments', async (req, res) => {
  try {
    const pool = await sql.connect();
    const result = await pool.request()
      .input('incidentId', sql.Int, req.params.id)
      .query(`
        SELECT * FROM IncidentComments
        WHERE IncidentID = @incidentId
        ORDER BY CreatedAt ASC
      `);
    
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

