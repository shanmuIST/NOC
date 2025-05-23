import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  CircularProgress,
  Alert,
  Tab,
  Tabs,
} from '@mui/material';
import {
  DatePicker,
  LocalizationProvider,
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { reportsAPI } from '../../services/api';

// Mock data for alert statistics
const mockAlertStats = {
  bySeverity: [
    { Severity: 'Critical', Count: 2 },
    { Severity: 'Major', Count: 3 },
    { Severity: 'Minor', Count: 5 },
    { Severity: 'Warning', Count: 8 },
    { Severity: 'Info', Count: 12 },
  ],
  byStatus: [
    { Status: 'New', Count: 5 },
    { Status: 'In Progress', Count: 3 },
    { Status: 'Acknowledged', Count: 10 },
    { Status: 'Resolved', Count: 12 },
  ],
  timeline: [
    { Date: '2023-05-09', Count: 3 },
    { Date: '2023-05-10', Count: 5 },
    { Date: '2023-05-11', Count: 2 },
    { Date: '2023-05-12', Count: 7 },
    { Date: '2023-05-13', Count: 4 },
    { Date: '2023-05-14', Count: 6 },
    { Date: '2023-05-15', Count: 8 },
  ],
};

// Mock data for incident statistics
const mockIncidentStats = {
  byPriority: [
    { Priority: 'Critical', Count: 2 },
    { Priority: 'High', Count: 5 },
    { Priority: 'Medium', Count: 8 },
    { Priority: 'Low', Count: 4 },
  ],
  byStatus: [
    { Status: 'Open', Count: 3 },
    { Status: 'In Progress', Count: 5 },
    { Status: 'Resolved', Count: 8 },
    { Status: 'Closed', Count: 3 },
  ],
  avgResolutionTime: 12.5, // hours
  timeline: [
    { Date: '2023-04-16', Count: 1 },
    { Date: '2023-04-23', Count: 2 },
    { Date: '2023-04-30', Count: 0 },
    { Date: '2023-05-07', Count: 3 },
    { Date: '2023-05-14', Count: 2 },
  ],
};

// Mock data for device status
const mockDeviceStatus = {
  byStatus: [
    { Status: 'Active', Count: 18 },
    { Status: 'Warning', Count: 3 },
    { Status: 'Critical', Count: 2 },
    { Status: 'Maintenance', Count: 1 },
    { Status: 'Offline', Count: 0 },
  ],
  byType: [
    { Type: 'Router', Count: 3 },
    { Type: 'Switch', Count: 4 },
    { Type: 'Firewall', Count: 2 },
    { Type: 'Server', Count: 12 },
    { Type: 'Workstation', Count: 3 },
  ],
  mostAlerts: [
    { DeviceID: 6, Name: 'Database Server', AlertCount: 12 },
    { DeviceID: 1, Name: 'Core Router 1', AlertCount: 8 },
    { DeviceID: 8, Name: 'Branch Router', AlertCount: 7 },
    { DeviceID: 4, Name: 'Web Server 1', AlertCount: 6 },
    { DeviceID: 3, Name: 'Edge Firewall', AlertCount: 5 },
  ],
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`report-tabpanel-${index}`}
      aria-labelledby={`report-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Reports: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [alertStats, setAlertStats] = useState<any>(null);
  const [incidentStats, setIncidentStats] = useState<any>(null);
  const [deviceStatus, setDeviceStatus] = useState<any>(null);
  const [startDate, setStartDate] = useState<Date | null>(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)); // 7 days ago
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [reportType, setReportType] = useState('summary');
  const [generatingReport, setGeneratingReport] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  
  useEffect(() => {
    fetchStatistics();
  }, []);
  
  const fetchStatistics = async () => {
    setLoading(true);
    setError('');
    
    try {
      // In a real application, this would call the API
      // const alertStatsResponse = await reportsAPI.getAlertStats();
      // const incidentStatsResponse = await reportsAPI.getIncidentStats();
      // const deviceStatusResponse = await reportsAPI.getDeviceStatus();
      // setAlertStats(alertStatsResponse.data);
      // setIncidentStats(incidentStatsResponse.data);
      // setDeviceStatus(deviceStatusResponse.data);
      
      // For demo purposes, we'll use mock data
      setTimeout(() => {
        setAlertStats(mockAlertStats);
        setIncidentStats(mockIncidentStats);
        setDeviceStatus(mockDeviceStatus);
        setLoading(false);
      }, 1000);
    } catch (err: any) {
      setError('Failed to fetch statistics. ' + (err.message || ''));
      setLoading(false);
    }
  };
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handleReportTypeChange = (event: any) => {
    setReportType(event.target.value);
  };
  
  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }
    
    if (startDate > endDate) {
      setError('Start date cannot be after end date');
      return;
    }
    
    setGeneratingReport(true);
    setError('');
    
    try {
      // In a real application, this would call the API
      // const response = await reportsAPI.getDetailedReport(
      //   startDate.toISOString().split('T')[0],
      //   endDate.toISOString().split('T')[0]
      // );
      // setReportData(response.data);
      
      // For demo purposes, we'll just simulate a response
      setTimeout(() => {
        setReportData({
          summary: {
            TotalAlerts: 25,
            TotalIncidents: 8,
            ResolvedIncidents: 5,
            AvgResolutionHours: 10.5,
          },
          timeRange: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
        });
        setGeneratingReport(false);
      }, 1500);
    } catch (err: any) {
      setError('Failed to generate report. ' + (err.message || ''));
      setGeneratingReport(false);
    }
  };
  
  const handleExportReport = () => {
    // In a real application, this would generate and download a report file
    alert('Report export functionality would be implemented here');
  };
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B'];
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Reports & Analytics
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="report tabs">
          <Tab label="Dashboard" />
          <Tab label="Generate Report" />
        </Tabs>
      </Box>
      
      {/* Dashboard Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {/* Alert Statistics */}
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              Alert Statistics
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardHeader title="Alerts by Severity" />
              <Divider />
              <CardContent sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={alertStats.bySeverity}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="Count"
                      nameKey="Severity"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {alertStats.bySeverity.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardHeader title="Alerts by Status" />
              <Divider />
              <CardContent sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={alertStats.byStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="Count"
                      nameKey="Status"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {alertStats.byStatus.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardHeader title="Alert Trend (Last 7 Days)" />
              <Divider />
              <CardContent sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={alertStats.timeline}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="Date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="Count" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Incident Statistics */}
          <Grid item xs={12} sx={{ mt: 3 }}>
            <Typography variant="h5" gutterBottom>
              Incident Statistics
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardHeader title="Incidents by Priority" />
              <Divider />
              <CardContent sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={incidentStats.byPriority}
                    layout="vertical"
                    margin={{
                      top: 5,
                      right: 30,
                      left: 60,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="Priority" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardHeader title="Incidents by Status" />
              <Divider />
              <CardContent sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={incidentStats.byStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="Count"
                      nameKey="Status"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {incidentStats.byStatus.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardHeader title="Incident Trend (Last 30 Days)" />
              <Divider />
              <CardContent sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={incidentStats.timeline}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="Date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="Count" stroke="#82ca9d" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Device Statistics */}
          <Grid item xs={12} sx={{ mt: 3 }}>
            <Typography variant="h5" gutterBottom>
              Device Statistics
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardHeader title="Devices by Status" />
              <Divider />
              <CardContent sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deviceStatus.byStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="Count"
                      nameKey="Status"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {deviceStatus.byStatus.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardHeader title="Devices by Type" />
              <Divider />
              <CardContent sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deviceStatus.byType}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="Count"
                      nameKey="Type"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {deviceStatus.byType.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardHeader title="Devices with Most Alerts" />
              <Divider />
              <CardContent sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={deviceStatus.mostAlerts}
                    layout="vertical"
                    margin={{
                      top: 5,
                      right: 30,
                      left: 100,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="Name" type="category" width={80} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="AlertCount" name="Alert Count" fill="#FF8042" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
      
      {/* Generate Report Tab */}
      <TabPanel value={tabValue} index={1}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Generate Custom Report
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Report Type</InputLabel>
                <Select
                  value={reportType}
                  label="Report Type"
                  onChange={handleReportTypeChange}
                >
                  <MenuItem value="summary">Summary Report</MenuItem>
                  <MenuItem value="alerts">Alert Report</MenuItem>
                  <MenuItem value="incidents">Incident Report</MenuItem>
                  <MenuItem value="devices">Device Report</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleGenerateReport}
                  disabled={generatingReport || !startDate || !endDate}
                >
                  {generatingReport ? <CircularProgress size={24} /> : 'Generate Report'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
        
        {reportData && (
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Report Results
              </Typography>
              <Button
                variant="outlined"
                onClick={handleExportReport}
              >
                Export Report
              </Button>
            </Box>
            <Divider sx={{ mb: 3 }} />
            
            <Typography variant="subtitle1" gutterBottom>
              Time Range: {new Date(reportData.timeRange.startDate).toLocaleDateString()} to {new Date(reportData.timeRange.endDate).toLocaleDateString()}
            </Typography>
            
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h3" align="center">
                      {reportData.summary.TotalAlerts}
                    </Typography>
                    <Typography variant="subtitle1" align="center">
                      Total Alerts
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h3" align="center">
                      {reportData.summary.TotalIncidents}
                    </Typography>
                    <Typography variant="subtitle1" align="center">
                      Total Incidents
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h3" align="center">
                      {reportData.summary.ResolvedIncidents}
                    </Typography>
                    <Typography variant="subtitle1" align="center">
                      Resolved Incidents
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h3" align="center">
                      {reportData.summary.AvgResolutionHours.toFixed(1)}h
                    </Typography>
                    <Typography variant="subtitle1" align="center">
                      Avg. Resolution Time
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
              * This is a simplified report view. In a real application, this would include detailed tables and charts specific to the selected report type.
            </Typography>
          </Paper>
        )}
      </TabPanel>
    </Box>
  );
};

export default Reports;

