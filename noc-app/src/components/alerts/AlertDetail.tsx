import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  IconButton,
  Divider,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Router as RouterIcon,
  Storage as ServerIcon,
  Security as FirewallIcon,
  SettingsEthernet as SwitchIcon,
  DeviceHub as GenericDeviceIcon,
} from '@mui/icons-material';
import { alertsAPI, incidentsAPI } from '../../services/api';

// Mock data for alert details
const mockAlert = {
  AlertID: 7,
  DeviceID: 6,
  DeviceName: 'Database Server',
  Severity: 'Critical',
  Message: 'Database connection failures',
  Source: 'Application Monitor',
  Timestamp: '2023-05-15T09:15:00',
  Status: 'New',
  Details: 'Multiple applications reporting database connection failures. Connection pool exhaustion detected. Database server showing high CPU and memory usage.',
};

// Mock data for device details
const mockDevice = {
  DeviceID: 6,
  Name: 'Database Server',
  Type: 'Server',
  IPAddress: '192.168.2.20',
  Location: 'Database Cluster',
  Status: 'Active',
};

// Mock data for similar alerts
const mockSimilarAlerts = [
  {
    AlertID: 12,
    DeviceID: 6,
    DeviceName: 'Database Server',
    Severity: 'Warning',
    Message: 'High CPU utilization',
    Timestamp: '2023-05-15T08:30:00',
    Status: 'Acknowledged',
  },
  {
    AlertID: 15,
    DeviceID: 6,
    DeviceName: 'Database Server',
    Severity: 'Warning',
    Message: 'Memory usage above threshold',
    Timestamp: '2023-05-15T08:45:00',
    Status: 'Acknowledged',
  },
];

interface Alert {
  AlertID: number;
  DeviceID: number;
  DeviceName: string;
  Severity: string;
  Message: string;
  Source: string;
  Timestamp: string;
  Status: string;
  Details?: string;
}

interface Device {
  DeviceID: number;
  Name: string;
  Type: string;
  IPAddress: string;
  Location: string;
  Status: string;
}

const AlertDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [alert, setAlert] = useState<Alert | null>(null);
  const [device, setDevice] = useState<Device | null>(null);
  const [similarAlerts, setSimilarAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openIncidentDialog, setOpenIncidentDialog] = useState(false);
  const [incidentFormData, setIncidentFormData] = useState({
    title: '',
    description: '',
    priority: 'High',
    assignedTo: '',
  });
  const [formErrors, setFormErrors] = useState<any>({});
  
  useEffect(() => {
    fetchAlertData();
  }, [id]);
  
  const fetchAlertData = async () => {
    setLoading(true);
    setError('');
    
    try {
      // In a real application, this would call the API
      // const alertResponse = await alertsAPI.getAlertById(Number(id));
      // const deviceResponse = await devicesAPI.getDeviceById(alertResponse.data.DeviceID);
      // const similarAlertsResponse = await alertsAPI.getAlertsByDevice(alertResponse.data.DeviceID);
      // setAlert(alertResponse.data);
      // setDevice(deviceResponse.data);
      // setSimilarAlerts(similarAlertsResponse.data.filter((a: Alert) => a.AlertID !== Number(id)).slice(0, 5));
      
      // For demo purposes, we'll use mock data
      setTimeout(() => {
        setAlert(mockAlert);
        setDevice(mockDevice);
        setSimilarAlerts(mockSimilarAlerts);
        
        // Pre-fill incident form data based on alert
        setIncidentFormData({
          title: `Incident: ${mockAlert.Message}`,
          description: `Alert Details: ${mockAlert.Details || mockAlert.Message}\nDevice: ${mockAlert.DeviceName}\nSeverity: ${mockAlert.Severity}\nSource: ${mockAlert.Source}\nTimestamp: ${new Date(mockAlert.Timestamp).toLocaleString()}`,
          priority: mockAlert.Severity === 'Critical' ? 'Critical' : mockAlert.Severity === 'Major' ? 'High' : 'Medium',
          assignedTo: '',
        });
        
        setLoading(false);
      }, 1000);
    } catch (err: any) {
      setError('Failed to fetch alert data. ' + (err.message || ''));
      setLoading(false);
    }
  };
  
  const handleUpdateStatus = async (status: string) => {
    try {
      // In a real application, this would call the API
      // await alertsAPI.updateAlertStatus(Number(id), status);
      
      // For demo purposes, we'll just update the local state
      if (alert) {
        setAlert({ ...alert, Status: status });
      }
    } catch (err: any) {
      setError('Failed to update alert status. ' + (err.message || ''));
    }
  };
  
  const handleOpenIncidentDialog = () => {
    setOpenIncidentDialog(true);
  };
  
  const handleCloseIncidentDialog = () => {
    setOpenIncidentDialog(false);
  };
  
  const handleIncidentFormChange = (event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = event.target;
    setIncidentFormData({
      ...incidentFormData,
      [name as string]: value,
    });
    
    // Clear error for this field
    if (formErrors[name as string]) {
      setFormErrors({
        ...formErrors,
        [name as string]: '',
      });
    }
  };
  
  const validateIncidentForm = (): boolean => {
    const errors: any = {};
    
    if (!incidentFormData.title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!incidentFormData.description.trim()) {
      errors.description = 'Description is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleCreateIncident = async () => {
    if (!validateIncidentForm()) {
      return;
    }
    
    try {
      // In a real application, this would call the API
      // await incidentsAPI.createIncident({
      //   title: incidentFormData.title,
      //   description: incidentFormData.description,
      //   priority: incidentFormData.priority,
      //   deviceId: alert?.DeviceID,
      //   assignedTo: incidentFormData.assignedTo || null,
      //   alertIds: [Number(id)],
      // });
      
      // Update alert status to "In Progress"
      if (alert) {
        setAlert({ ...alert, Status: 'In Progress' });
      }
      
      handleCloseIncidentDialog();
      
      // Navigate to incidents list
      navigate('/incidents');
    } catch (err: any) {
      setError('Failed to create incident. ' + (err.message || ''));
    }
  };
  
  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return <ErrorIcon color="error" sx={{ fontSize: 40 }} />;
      case 'major':
        return <WarningIcon sx={{ color: 'orange', fontSize: 40 }} />;
      case 'warning':
        return <WarningIcon color="warning" sx={{ fontSize: 40 }} />;
      case 'minor':
        return <InfoIcon color="info" sx={{ fontSize: 40 }} />;
      case 'info':
        return <InfoIcon color="action" sx={{ fontSize: 40 }} />;
      default:
        return <InfoIcon sx={{ fontSize: 40 }} />;
    }
  };
  
  const getSeverityChip = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return <Chip label="Critical" color="error" />;
      case 'major':
        return <Chip label="Major" sx={{ bgcolor: 'orange', color: 'white' }} />;
      case 'warning':
        return <Chip label="Warning" color="warning" />;
      case 'minor':
        return <Chip label="Minor" color="info" />;
      case 'info':
        return <Chip label="Info" color="default" />;
      default:
        return <Chip label={severity} />;
    }
  };
  
  const getStatusChip = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new':
        return <Chip label="New" color="error" />;
      case 'in progress':
        return <Chip label="In Progress" color="warning" />;
      case 'acknowledged':
        return <Chip label="Acknowledged" color="info" />;
      case 'resolved':
        return <Chip label="Resolved" color="success" />;
      default:
        return <Chip label={status} />;
    }
  };
  
  const getDeviceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'router':
        return <RouterIcon />;
      case 'server':
        return <ServerIcon />;
      case 'firewall':
        return <FirewallIcon />;
      case 'switch':
        return <SwitchIcon />;
      default:
        return <GenericDeviceIcon />;
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (!alert && !loading) {
    return (
      <Box sx={{ mt: 3 }}>
        <Alert severity="error">
          Alert not found. The alert may have been deleted or you don't have permission to view it.
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/alerts')}
          sx={{ mt: 2 }}
        >
          Back to Alerts
        </Button>
      </Box>
    );
  }
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={() => navigate('/alerts')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            Alert Details
          </Typography>
        </Box>
        <Button 
          variant="outlined" 
          startIcon={<RefreshIcon />}
          onClick={fetchAlertData}
        >
          Refresh
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Alert Overview Card */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {getSeverityIcon(alert?.Severity || '')}
              <Box>
                <Typography variant="h5">{alert?.Message}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {alert?.Source} • {new Date(alert?.Timestamp || '').toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2 }}>
            {getSeverityChip(alert?.Severity || '')}
            {getStatusChip(alert?.Status || '')}
          </Grid>
          
          <Grid item xs={12}>
            <Divider />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle1">Alert Details</Typography>
            <Typography variant="body1" paragraph>
              {alert?.Details || 'No additional details available.'}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">Device</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {device && getDeviceIcon(device.Type)}
              <Typography 
                variant="body1" 
                component="a" 
                href={`/devices/${device?.DeviceID}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/devices/${device?.DeviceID}`);
                }}
                sx={{ 
                  color: 'primary.main', 
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                {device?.Name}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">Location</Typography>
            <Typography variant="body1">{device?.Location}</Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">IP Address</Typography>
            <Typography variant="body1">{device?.IPAddress}</Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">Device Status</Typography>
            <Chip 
              label={device?.Status} 
              color={
                device?.Status === 'Active' ? 'success' :
                device?.Status === 'Warning' ? 'warning' :
                device?.Status === 'Critical' ? 'error' :
                'default'
              } 
              size="small" 
            />
          </Grid>
          
          <Grid item xs={12}>
            <Divider />
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {alert?.Status === 'New' && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleUpdateStatus('Acknowledged')}
                >
                  Acknowledge
                </Button>
              )}
              
              {(alert?.Status === 'New' || alert?.Status === 'Acknowledged') && (
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<AssignmentIcon />}
                  onClick={handleOpenIncidentDialog}
                >
                  Create Incident
                </Button>
              )}
              
              {alert?.Status !== 'Resolved' && (
                <Button
                  variant="outlined"
                  color="success"
                  startIcon={<CheckCircleIcon />}
                  onClick={() => handleUpdateStatus('Resolved')}
                >
                  Mark as Resolved
                </Button>
              )}
              
              <Button
                variant="outlined"
                onClick={() => navigate(`/devices/${device?.DeviceID}`)}
              >
                View Device
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Similar Alerts Card */}
      {similarAlerts.length > 0 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Similar Alerts on {device?.Name}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Grid container spacing={2}>
            {similarAlerts.map((similarAlert) => (
              <Grid item xs={12} key={similarAlert.AlertID}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getSeverityIcon(similarAlert.Severity)}
                        <Box>
                          <Typography variant="body1">{similarAlert.Message}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(similarAlert.Timestamp).toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>
                      <Box>
                        {getStatusChip(similarAlert.Status)}
                      </Box>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      onClick={() => navigate(`/alerts/${similarAlert.AlertID}`)}
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}
      
      {/* Create Incident Dialog */}
      <Dialog open={openIncidentDialog} onClose={handleCloseIncidentDialog} maxWidth="md" fullWidth>
        <DialogTitle>Create Incident from Alert</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Create a new incident based on this alert. The alert will be linked to the incident and its status will be updated to "In Progress".
          </DialogContentText>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              fullWidth
              label="Incident Title"
              name="title"
              value={incidentFormData.title}
              onChange={handleIncidentFormChange}
              error={!!formErrors.title}
              helperText={formErrors.title}
              required
            />
            
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={incidentFormData.description}
              onChange={handleIncidentFormChange}
              error={!!formErrors.description}
              helperText={formErrors.description}
              multiline
              rows={4}
              required
            />
            
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                name="priority"
                value={incidentFormData.priority}
                label="Priority"
                onChange={handleIncidentFormChange}
              >
                <MenuItem value="Critical">Critical</MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Assigned To (optional)"
              name="assignedTo"
              value={incidentFormData.assignedTo}
              onChange={handleIncidentFormChange}
              placeholder="Leave blank for unassigned"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseIncidentDialog}>Cancel</Button>
          <Button onClick={handleCreateIncident} variant="contained" color="primary">
            Create Incident
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AlertDetail;
