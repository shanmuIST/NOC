const express = require('express');
const router = express.Router();
const sql = require('mssql');

// Get all devices
router.get('/', async (req, res) => {
  try {
    const pool = await sql.connect();
    const result = await pool.request().query('SELECT * FROM Devices');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching devices:', err);
    res.status(500).send('Server Error');
  }
});

// Get device by ID
router.get('/:id', async (req, res) => {
  try {
    const pool = await sql.connect();
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('SELECT * FROM Devices WHERE DeviceID = @id');
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Device not found' });
    }
    
    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Error fetching device:', err);
    res.status(500).send('Server Error');
  }
});

// Add new device
router.post('/', async (req, res) => {
  const { name, type, ipAddress, location, status } = req.body;
  
  try {
    const pool = await sql.connect();
    const result = await pool.request()
      .input('name', sql.NVarChar, name)
      .input('type', sql.NVarChar, type)
      .input('ipAddress', sql.NVarChar, ipAddress)
      .input('location', sql.NVarChar, location)
      .input('status', sql.NVarChar, status)
      .query(`
        INSERT INTO Devices (Name, Type, IPAddress, Location, Status, LastUpdated)
        VALUES (@name, @type, @ipAddress, @location, @status, GETDATE());
        SELECT SCOPE_IDENTITY() AS DeviceID;
      `);
    
    res.status(201).json({ 
      message: 'Device added successfully', 
      deviceId: result.recordset[0].DeviceID 
    });
  } catch (err) {
    console.error('Error adding device:', err);
    res.status(500).send('Server Error');
  }
});

// Update device
router.put('/:id', async (req, res) => {
  const { name, type, ipAddress, location, status } = req.body;
  
  try {
    const pool = await sql.connect();
    await pool.request()
      .input('id', sql.Int, req.params.id)
      .input('name', sql.NVarChar, name)
      .input('type', sql.NVarChar, type)
      .input('ipAddress', sql.NVarChar, ipAddress)
      .input('location', sql.NVarChar, location)
      .input('status', sql.NVarChar, status)
      .query(`
        UPDATE Devices
        SET Name = @name,
            Type = @type,
            IPAddress = @ipAddress,
            Location = @location,
            Status = @status,
            LastUpdated = GETDATE()
        WHERE DeviceID = @id
      `);
    
    res.json({ message: 'Device updated successfully' });
  } catch (err) {
    console.error('Error updating device:', err);
    res.status(500).send('Server Error');
  }
});

// Delete device
router.delete('/:id', async (req, res) => {
  try {
    const pool = await sql.connect();
    await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('DELETE FROM Devices WHERE DeviceID = @id');
    
    res.json({ message: 'Device deleted successfully' });
  } catch (err) {
    console.error('Error deleting device:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

