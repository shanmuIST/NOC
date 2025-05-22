const express = require('express');
const cors = require('cors');
const sql = require('mssql');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// SQL Server Configuration
const sqlConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  server: process.env.DB_SERVER,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: true, // for azure
    trustServerCertificate: true // change to false for production
  }
};

// Test SQL Server Connection
async function testConnection() {
  try {
    await sql.connect(sqlConfig);
    console.log('Connected to SQL Server successfully!');
  } catch (err) {
    console.error('SQL Server connection error:', err);
  }
}

testConnection();

// API Routes
const devicesRouter = require('./routes/devices');
const alertsRouter = require('./routes/alerts');
const incidentsRouter = require('./routes/incidents');
const reportsRouter = require('./routes/reports');

app.use('/api/devices', devicesRouter);
app.use('/api/alerts', alertsRouter);
app.use('/api/incidents', incidentsRouter);
app.use('/api/reports', reportsRouter);

// Default route
app.get('/', (req, res) => {
  res.send('NOC API Server is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;

