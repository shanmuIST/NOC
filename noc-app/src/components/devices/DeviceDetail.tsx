import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tab,
  Tabs,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Router as RouterIcon,
  Storage as ServerIcon,
  Security as FirewallIcon,
  SettingsEthernet as SwitchIcon,
  DeviceHub as GenericDeviceIcon,
  Speed as PerformanceIcon,
  History as HistoryIcon,
  Settings as ConfigIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { devicesAPI, alertsAPI } from '../../services/api';

// Mock data for device details
const mockDevice = {
  DeviceID: 1,
  Name: 'Core Router 1',
  Type: 'Router',
  IPAddress: '192.168.1.1',
  Location: 'Main Data Center',
  Status: 'Active',
  LastUpdated: '2023-05-15T10:30:00',
  Model: 'Cisco ASR 9000',
  Vendor: 'Cisco',
  SerialNumber: 'ASR9K-123456',
  FirmwareVersion: '7.3.2',
  UptimeHours: 2184, // 91 days
  CPUUtilization: 35,
  MemoryUtilization: 42,
  DiskUtilization: 28,
};

// Mock data for device alerts
const mockAlerts = [
  { 
    AlertID: 1, 
    Severity: 'Warning', 
    Message: 'High CPU utilization', 
    Source: 'SNMP Monitor', 
    Timestamp: '2023-05-15T08:30:00', 
    Status: 'New' 
  },
  { 
    AlertID: 2, 
    Severity: 'Minor', 
    Message: 'Interface flapping', 
    Source: 'SNMP Trap', 
    Timestamp: '2023-05-15T05:30:00', 
    Status: 'Acknowledged' 
  },
];

// Mock data for performance metrics
const mockPerformanceData = [
  { time: '00:00', cpu: 20, memory: 35, traffic: 15 },
  { time: '02:00', cpu: 25, memory: 38, traffic: 12 },
  { time: '04:00', cpu: 15, memory: 40, traffic: 8 },
  { time: '06:00', cpu: 18, memory: 37, traffic: 10 },
  { time: '08:00', cpu: 28, memory: 42, traffic: 25 },
  { time: '10:00', cpu: 35, memory: 45, traffic: 30 },
  { time: '12:00', cpu: 40, memory: 48, traffic: 35 },
  { time: '14:00', cpu: 42, memory: 50, traffic: 32 },
  { time: '16:00', cpu: 38, memory: 47, traffic: 28 },
  { time: '18:00', cpu: 30, memory: 45, traffic: 20 },
  { time: '20:00', cpu: 25, memory: 40, traffic: 15 },
  { time: '22:00', cpu: 22, memory: 38, traffic: 12 },
];

// Mock data for configuration
const mockConfig = [
  { key: 'Hostname', value: 'core-router-1' },
  { key: 'Domain', value: 'example.com' },
  { key: 'DNS Servers', value: '8.8.8.8, 8.8.4.4' },
  { key: 'NTP Servers', value: 'ntp.example.com' },
  { key: 'SNMP Community', value: 'public (read-only)' },
  { key: 'Syslog Server', value: 'syslog.example.com' },
  { key: 'Interfaces', value: 'GigabitEthernet0/0/0, GigabitEthernet0/0/1, TenGigE0/1/0/0' },
  { key: 'Routing Protocols', value: 'OSPF, BGP' },
  { key: 'VLAN Configuration', value: 'VLAN 10, VLAN 20, VLAN 30' },
];

// Mock data for event history
const mockHistory = [
  { 
    EventID: 1, 
    Type: 'Status Change', 
    Description: 'Device status changed from Maintenance to Active', 
    Timestamp: '2023-05-14T08:00:00', 
    User: 'System' 
  },
  { 
    EventID: 2, 
    Type: 'Configuration', 
    Description: 'Firmware updated to version 7.3.2', 
    Timestamp: '2023-05-14T07:45:00', 
    User: 'admin' 
  },
  { 
    EventID: 3, 
    Type: 'Maintenance', 
    Description: 'Scheduled maintenance started', 
    Timestamp: '2023-05-14T07:00:00', 
    User: 'admin' 
  },
  { 
    EventID: 4, 
    Type: 'Alert', 
    Description: 'Interface GigabitEthernet0/0/1 went down', 
    Timestamp: '2023-05-10T14:23:00', 
    User: 'System' 
  },
  { 
    EventID: 5, 
    Type: 'Alert', 
    Description: 'High CPU utilization detected (85%)', 
    Timestamp: '2023-05-08T10:15:00', 
    User: 'System' 
  },
];

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
      id={`device-tabpanel-${index}`}
      aria-labelledby={`device-tab-${index}`}
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

const DeviceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [device, setDevice] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  
  useEffect(() => {
    fetchDeviceData();
  }, [id]);
  
  const fetchDeviceData = async () => {
    setLoading(true);
    setError('');
    
    try {
      // In a real application, this would call the API
      // const deviceResponse = await devicesAPI.getDeviceById(Number(id));
      // const alertsResponse = await alertsAPI.getAlertsByDevice(Number(id));
      // setDevice(deviceResponse.data);
      // setAlerts(alertsResponse.data);
      
      // For demo purposes, we'll use mock data
      setTimeout(() => {
        setDevice(mockDevice);
        setAlerts(mockAlerts);
        setLoading(false);
      }, 1000);
    } catch (err: any) {
      setError('Failed to fetch device data. ' + (err.message || ''));
      setLoading(false);
    }
  };
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handleDeleteDevice = async () => {
    if (window.confirm('Are you sure you want to delete this device?')) {
      try {
        // In a real application, this would call the API
        // await devicesAPI.deleteDevice(Number(id));
        
        // Navigate back to devices list
        navigate('/devices');
      } catch (err: any) {
        setError('Failed to delete device. ' + (err.message || ''));
      }
    }
  };
  
  const getDeviceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'router':
        return <RouterIcon sx={{ fontSize: 40 }} />;
      case 'server':
        return <ServerIcon sx={{ fontSize: 40 }} />;
      case 'firewall':
        return <FirewallIcon sx={{ fontSize: 40 }} />;
      case 'switch':
        return <SwitchIcon sx={{ fontSize: 40 }} />;
      default:
        return <GenericDeviceIcon sx={{ fontSize: 40 }} />;
    }
  };
  
  const getStatusChip = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <Chip label="Active" color="success" />;
      case 'warning':
        return <Chip label="Warning" color="warning" />;
      case 'critical':
        return <Chip label="Critical" color="error" />;
      case 'maintenance':
        return <Chip label="Maintenance" color="info" />;
      case 'offline':
        return <Chip label="Offline" color="default" />;
      default:
        return <Chip label={status} />;
    }
  };
  
  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return <ErrorIcon color="error" />;
      case 'major':
        return <WarningIcon sx={{ color: 'orange' }} />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'minor':
        return <InfoIcon color="info" />;
      case 'info':
        return <InfoIcon color="action" />;
      default:
        return <InfoIcon />;
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (!device && !loading) {
    return (
      <Box sx={{ mt: 3 }}>
        <Alert severity="error">
          Device not found. The device may have been deleted or you don't have permission to view it.
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/devices')}
          sx={{ mt: 2 }}
        >
          Back to Devices
        </Button>
      </Box>
    );
  }
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={() => navigate('/devices')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            Device Details
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="outlined" 
            startIcon={<RefreshIcon />}
            onClick={fetchDeviceData}
          >
            Refresh
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/devices/${id}/edit`)}
          >
            Edit
          </Button>
          <Button 
            variant="outlined" 
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteDevice}
          >
            Delete
          </Button>
        </Box>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Device Overview Card */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {getDeviceIcon(device.Type)}
              <Box>
                <Typography variant="h5">{device.Name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {device.Type} • {device.Model} • {device.Vendor}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            {getStatusChip(device.Status)}
          </Grid>
          
          <Grid item xs={12}>
            <Divider />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2" color="text.secondary">IP Address</Typography>
            <Typography variant="body1">{device.IPAddress}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2" color="text.secondary">Location</Typography>
            <Typography variant="body1">{device.Location}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2" color="text.secondary">Serial Number</Typography>
            <Typography variant="body1">{device.SerialNumber}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2" color="text.secondary">Firmware Version</Typography>
            <Typography variant="body1">{device.FirmwareVersion}</Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2" color="text.secondary">Last Updated</Typography>
            <Typography variant="body1">{new Date(device.LastUpdated).toLocaleString()}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2" color="text.secondary">Uptime</Typography>
            <Typography variant="body1">{Math.floor(device.UptimeHours / 24)} days, {device.UptimeHours % 24} hours</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2" color="text.secondary">CPU Utilization</Typography>
            <Typography variant="body1">{device.CPUUtilization}%</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2" color="text.secondary">Memory Utilization</Typography>
            <Typography variant="body1">{device.MemoryUtilization}%</Typography>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Tabs for different sections */}
      <Paper sx={{ width: '100%', mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="device tabs">
            <Tab label="Alerts" icon={<WarningIcon />} iconPosition="start" />
            <Tab label="Performance" icon={<PerformanceIcon />} iconPosition="start" />
            <Tab label="Configuration" icon={<ConfigIcon />} iconPosition="start" />
            <Tab label="History" icon={<HistoryIcon />} iconPosition="start" />
          </Tabs>
        </Box>
        
        {/* Alerts Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Alerts
            </Typography>
            {alerts.length > 0 ? (
              <List>
                {alerts.map((alert) => (
                  <Paper key={alert.AlertID} sx={{ mb: 2 }}>
                    <ListItem
                      secondaryAction={
                        <Chip 
                          label={alert.Status} 
                          color={alert.Status === 'New' ? 'error' : 'default'} 
                          size="small" 
                        />
                      }
                    >
                      <ListItemIcon>
                        {getSeverityIcon(alert.Severity)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body1">{alert.Message}</Typography>
                            <Chip 
                              label={alert.Severity} 
                              color={
                                alert.Severity === 'Critical' ? 'error' : 
                                alert.Severity === 'Major' ? 'warning' : 
                                alert.Severity === 'Minor' ? 'info' : 
                                'default'
                              } 
                              size="small" 
                            />
                          </Box>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <Typography variant="caption">
                              {alert.Source} • {new Date(alert.Timestamp).toLocaleString()}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  </Paper>
                ))}
              </List>
            ) : (
              <Alert severity="info">No alerts found for this device.</Alert>
            )}
          </Box>
        </TabPanel>
        
        {/* Performance Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Performance Metrics (Last 24 Hours)
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Resource Utilization
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={mockPerformanceData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="cpu" stroke="#8884d8" name="CPU (%)" />
                        <Line type="monotone" dataKey="memory" stroke="#82ca9d" name="Memory (%)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Network Traffic
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={mockPerformanceData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="traffic" stroke="#ff7300" name="Traffic (Mbps)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>
        
        {/* Configuration Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Device Configuration
            </Typography>
            <Paper>
              <List>
                {mockConfig.map((item, index) => (
                  <React.Fragment key={item.key}>
                    <ListItem>
                      <Grid container>
                        <Grid item xs={4} md={3}>
                          <Typography variant="subtitle2" color="text.secondary">
                            {item.key}
                          </Typography>
                        </Grid>
                        <Grid item xs={8} md={9}>
                          <Typography variant="body2">
                            {item.value}
                          </Typography>
                        </Grid>
                      </Grid>
                    </ListItem>
                    {index < mockConfig.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Box>
        </TabPanel>
        
        {/* History Tab */}
        <TabPanel value={tabValue} index={3}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Event History
            </Typography>
            <List>
              {mockHistory.map((event) => (
                <Paper key={event.EventID} sx={{ mb: 2 }}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body1">{event.Description}</Typography>
                          <Chip 
                            label={event.Type} 
                            color={
                              event.Type === 'Alert' ? 'warning' : 
                              event.Type === 'Status Change' ? 'info' : 
                              'default'
                            } 
                            size="small" 
                          />
                        </Box>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <Typography variant="caption">
                            {new Date(event.Timestamp).toLocaleString()} • By: {event.User}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                </Paper>
              ))}
            </List>
          </Box>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default DeviceDetail;

