import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  IconButton,
  Button,
  CircularProgress,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Mock data for the dashboard
const alertSummary = {
  critical: 2,
  major: 3,
  minor: 5,
  warning: 8,
  info: 12,
};

const deviceStatusData = [
  { name: 'Active', value: 18, color: '#4caf50' },
  { name: 'Warning', value: 3, color: '#ff9800' },
  { name: 'Critical', value: 2, color: '#f44336' },
  { name: 'Maintenance', value: 1, color: '#2196f3' },
];

const incidentStatusData = [
  { name: 'Open', value: 3, color: '#f44336' },
  { name: 'In Progress', value: 5, color: '#ff9800' },
  { name: 'Resolved', value: 12, color: '#4caf50' },
  { name: 'Closed', value: 8, color: '#9e9e9e' },
];

const alertTrendData = [
  { name: 'Mon', critical: 1, major: 2, minor: 3, warning: 4 },
  { name: 'Tue', critical: 0, major: 1, minor: 5, warning: 3 },
  { name: 'Wed', critical: 2, major: 3, minor: 2, warning: 5 },
  { name: 'Thu', critical: 1, major: 0, minor: 4, warning: 6 },
  { name: 'Fri', critical: 0, major: 2, minor: 3, warning: 2 },
  { name: 'Sat', critical: 0, major: 1, minor: 1, warning: 1 },
  { name: 'Sun', critical: 1, major: 0, minor: 2, warning: 3 },
];

const recentAlerts = [
  { id: 1, severity: 'Critical', device: 'Database Server', message: 'Database connection failures', time: '45 minutes ago' },
  { id: 2, severity: 'Major', device: 'Branch Router', message: 'Link down', time: '30 minutes ago' },
  { id: 3, severity: 'Warning', device: 'Web Server 1', message: 'Disk space below threshold', time: '4 hours ago' },
  { id: 4, severity: 'Minor', device: 'Core Router 1', message: 'Interface flapping', time: '5 hours ago' },
  { id: 5, severity: 'Info', device: 'Web Server 2', message: 'Scheduled maintenance started', time: '12 hours ago' },
];

const activeIncidents = [
  { id: 1, priority: 'Critical', title: 'Database connectivity issues', assignedTo: 'John Smith', status: 'In Progress', time: '1 hour ago' },
  { id: 2, priority: 'High', title: 'Branch office network outage', assignedTo: 'Unassigned', status: 'Open', time: '30 minutes ago' },
  { id: 3, priority: 'Medium', title: 'Web server performance degradation', assignedTo: 'Jane Doe', status: 'In Progress', time: '4 hours ago' },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
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
  
  const getPriorityChip = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'critical':
        return <Chip label="Critical" color="error" size="small" />;
      case 'high':
        return <Chip label="High" sx={{ bgcolor: 'orange', color: 'white' }} size="small" />;
      case 'medium':
        return <Chip label="Medium" color="warning" size="small" />;
      case 'low':
        return <Chip label="Low" color="info" size="small" />;
      default:
        return <Chip label={priority} size="small" />;
    }
  };
  
  const getStatusChip = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return <Chip label="Open" color="error" size="small" />;
      case 'in progress':
        return <Chip label="In Progress" color="warning" size="small" />;
      case 'resolved':
        return <Chip label="Resolved" color="success" size="small" />;
      case 'closed':
        return <Chip label="Closed" color="default" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<RefreshIcon />}
          onClick={() => setLoading(true)}
        >
          Refresh
        </Button>
      </Box>
      
      {/* Alert Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: 'error.dark',
              color: 'white',
            }}
          >
            <ErrorIcon sx={{ fontSize: 40 }} />
            <Typography variant="h4">{alertSummary.critical}</Typography>
            <Typography variant="body2">Critical Alerts</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: 'orange',
              color: 'white',
            }}
          >
            <WarningIcon sx={{ fontSize: 40 }} />
            <Typography variant="h4">{alertSummary.major}</Typography>
            <Typography variant="body2">Major Alerts</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: 'warning.main',
              color: 'white',
            }}
          >
            <WarningIcon sx={{ fontSize: 40 }} />
            <Typography variant="h4">{alertSummary.minor}</Typography>
            <Typography variant="body2">Minor Alerts</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: 'info.main',
              color: 'white',
            }}
          >
            <InfoIcon sx={{ fontSize: 40 }} />
            <Typography variant="h4">{alertSummary.warning}</Typography>
            <Typography variant="body2">Warning Alerts</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: 'grey.700',
              color: 'white',
            }}
          >
            <InfoIcon sx={{ fontSize: 40 }} />
            <Typography variant="h4">{alertSummary.info}</Typography>
            <Typography variant="body2">Info Alerts</Typography>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Charts and Lists */}
      <Grid container spacing={3}>
        {/* Device Status Chart */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader 
              title="Device Status" 
              action={
                <IconButton aria-label="view devices" onClick={() => navigate('/devices')}>
                  <ArrowForwardIcon />
                </IconButton>
              }
            />
            <Divider />
            <CardContent sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {deviceStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Incident Status Chart */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader 
              title="Incident Status" 
              action={
                <IconButton aria-label="view incidents" onClick={() => navigate('/incidents')}>
                  <ArrowForwardIcon />
                </IconButton>
              }
            />
            <Divider />
            <CardContent sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={incidentStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {incidentStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Alert Trend Chart */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader 
              title="Alert Trend (Last 7 Days)" 
              action={
                <IconButton aria-label="view alerts" onClick={() => navigate('/alerts')}>
                  <ArrowForwardIcon />
                </IconButton>
              }
            />
            <Divider />
            <CardContent sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={alertTrendData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="critical" stackId="a" fill="#f44336" />
                  <Bar dataKey="major" stackId="a" fill="#ff9800" />
                  <Bar dataKey="minor" stackId="a" fill="#2196f3" />
                  <Bar dataKey="warning" stackId="a" fill="#ffeb3b" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Recent Alerts */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Recent Alerts" 
              action={
                <IconButton aria-label="view all alerts" onClick={() => navigate('/alerts')}>
                  <ArrowForwardIcon />
                </IconButton>
              }
            />
            <Divider />
            <List sx={{ maxHeight: 400, overflow: 'auto' }}>
              {recentAlerts.map((alert) => (
                <React.Fragment key={alert.id}>
                  <ListItem
                    secondaryAction={
                      <IconButton edge="end" aria-label="view" onClick={() => navigate(`/alerts/${alert.id}`)}>
                        <ArrowForwardIcon />
                      </IconButton>
                    }
                  >
                    <ListItemIcon>
                      {getSeverityIcon(alert.severity)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body1">{alert.device}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {alert.time}
                          </Typography>
                        </Box>
                      }
                      secondary={alert.message}
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
          </Card>
        </Grid>
        
        {/* Active Incidents */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Active Incidents" 
              action={
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button 
                    size="small" 
                    variant="contained" 
                    color="primary"
                    onClick={() => navigate('/incidents/create')}
                  >
                    New Incident
                  </Button>
                  <IconButton aria-label="view all incidents" onClick={() => navigate('/incidents')}>
                    <ArrowForwardIcon />
                  </IconButton>
                </Box>
              }
            />
            <Divider />
            <List sx={{ maxHeight: 400, overflow: 'auto' }}>
              {activeIncidents.map((incident) => (
                <React.Fragment key={incident.id}>
                  <ListItem
                    secondaryAction={
                      <IconButton edge="end" aria-label="view" onClick={() => navigate(`/incidents/${incident.id}`)}>
                        <ArrowForwardIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getPriorityChip(incident.priority)}
                          <Typography variant="body1">{incident.title}</Typography>
                        </Box>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          {getStatusChip(incident.status)}
                          <Typography variant="caption">
                            {incident.assignedTo} • {incident.time}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;

