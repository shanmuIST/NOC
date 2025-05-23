import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Chip,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { incidentsAPI, devicesAPI, alertsAPI } from '../../services/api';

// Mock data for devices
const mockDevices = [
  { DeviceID: 1, Name: 'Core Router 1' },
  { DeviceID: 2, Name: 'Core Switch 1' },
  { DeviceID: 3, Name: 'Edge Firewall' },
  { DeviceID: 4, Name: 'Web Server 1' },
  { DeviceID: 5, Name: 'Web Server 2' },
  { DeviceID: 6, Name: 'Database Server' },
  { DeviceID: 7, Name: 'Backup Server' },
  { DeviceID: 8, Name: 'Branch Router' },
  { DeviceID: 9, Name: 'Branch Switch' },
  { DeviceID: 10, Name: 'Monitoring Server' },
];

// Mock data for alerts
const mockAlerts = [
  { 
    AlertID: 1, 
    DeviceID: 1, 
    DeviceName: 'Core Router 1',
    Severity: 'Warning', 
    Message: 'High CPU utilization', 
    Status: 'New' 
  },
  { 
    AlertID: 3, 
    DeviceID: 3, 
    DeviceName: 'Edge Firewall',
    Severity: 'Critical', 
    Message: 'Multiple connection failures', 
    Status: 'New' 
  },
  { 
    AlertID: 5, 
    DeviceID: 8, 
    DeviceName: 'Branch Router',
    Severity: 'Major', 
    Message: 'Link down', 
    Status: 'New' 
  },
  { 
    AlertID: 6, 
    DeviceID: 4, 
    DeviceName: 'Web Server 1',
    Severity: 'Warning', 
    Message: 'Disk space below threshold', 
    Status: 'In Progress' 
  },
  { 
    AlertID: 7, 
    DeviceID: 6, 
    DeviceName: 'Database Server',
    Severity: 'Critical', 
    Message: 'Database connection failures', 
    Status: 'New' 
  },
];

interface Device {
  DeviceID: number;
  Name: string;
}

interface Alert {
  AlertID: number;
  DeviceID: number;
  DeviceName: string;
  Severity: string;
  Message: string;
  Status: string;
}

interface FormData {
  title: string;
  description: string;
  priority: string;
  deviceId: number | null;
  assignedTo: string;
  alertIds: number[];
}

const IncidentCreate: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    priority: 'Medium',
    deviceId: null,
    assignedTo: '',
    alertIds: [],
  });
  const [devices, setDevices] = useState<Device[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [selectedAlerts, setSelectedAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    setLoading(true);
    setError('');
    
    try {
      // In a real application, this would call the API
      // const devicesResponse = await devicesAPI.getAllDevices();
      // const alertsResponse = await alertsAPI.getAllAlerts();
      // setDevices(devicesResponse.data);
      // setAlerts(alertsResponse.data.filter(alert => alert.Status !== 'Resolved'));
      
      // For demo purposes, we'll use mock data
      setTimeout(() => {
        setDevices(mockDevices);
        setAlerts(mockAlerts);
        setLoading(false);
      }, 1000);
    } catch (err: any) {
      setError('Failed to fetch data. ' + (err.message || ''));
      setLoading(false);
    }
  };
  
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name as string]: value,
    });
    
    // Clear error for this field
    if (formErrors[name as keyof FormData]) {
      setFormErrors({
        ...formErrors,
        [name as string]: undefined,
      });
    }
  };
  
  const handleDeviceChange = (event: any, newValue: Device | null) => {
    setSelectedDevice(newValue);
    setFormData({
      ...formData,
      deviceId: newValue?.DeviceID || null,
    });
    
    // If device changes, filter alerts for this device
    if (newValue) {
      // Filter alerts for the selected device
      const deviceAlerts = alerts.filter(alert => alert.DeviceID === newValue.DeviceID);
      
      // Update selected alerts to only include those from this device
      const updatedSelectedAlerts = selectedAlerts.filter(alert => alert.DeviceID === newValue.DeviceID);
      setSelectedAlerts(updatedSelectedAlerts);
      
      // Update form data alert IDs
      setFormData({
        ...formData,
        deviceId: newValue.DeviceID,
        alertIds: updatedSelectedAlerts.map(alert => alert.AlertID),
      });
    } else {
      // If no device is selected, allow selecting any alert
      setFormData({
        ...formData,
        deviceId: null,
      });
    }
  };
  
  const handleAlertChange = (event: any, newValue: Alert[]) => {
    setSelectedAlerts(newValue);
    setFormData({
      ...formData,
      alertIds: newValue.map(alert => alert.AlertID),
    });
    
    // If an alert is selected and no device is selected, set the device to the alert's device
    if (newValue.length > 0 && !selectedDevice) {
      const firstAlert = newValue[0];
      const alertDevice = devices.find(device => device.DeviceID === firstAlert.DeviceID) || null;
      setSelectedDevice(alertDevice);
      setFormData({
        ...formData,
        deviceId: alertDevice?.DeviceID || null,
        alertIds: newValue.map(alert => alert.AlertID),
      });
    }
  };
  
  const validateForm = (): boolean => {
    const errors: Partial<FormData> = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    setError('');
    
    try {
      // In a real application, this would call the API
      // const response = await incidentsAPI.createIncident({
      //   title: formData.title,
      //   description: formData.description,
      //   priority: formData.priority,
      //   deviceId: formData.deviceId,
      //   assignedTo: formData.assignedTo || null,
      //   alertIds: formData.alertIds,
      // });
      
      // Navigate to the new incident
      // navigate(`/incidents/${response.data.incidentId}`);
      
      // For demo purposes, we'll just navigate back to the incidents list
      setTimeout(() => {
        setSubmitting(false);
        navigate('/incidents');
      }, 1000);
    } catch (err: any) {
      setError('Failed to create incident. ' + (err.message || ''));
      setSubmitting(false);
    }
  };
  
  const getFilteredAlerts = () => {
    if (selectedDevice) {
      return alerts.filter(alert => alert.DeviceID === selectedDevice.DeviceID);
    }
    return alerts;
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
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/incidents')} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Create New Incident
        </Typography>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Paper sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            fullWidth
            label="Incident Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            error={!!formErrors.title}
            helperText={formErrors.title}
            required
            disabled={submitting}
          />
          
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            error={!!formErrors.description}
            helperText={formErrors.description}
            multiline
            rows={4}
            required
            disabled={submitting}
          />
          
          <FormControl fullWidth disabled={submitting}>
            <InputLabel>Priority</InputLabel>
            <Select
              name="priority"
              value={formData.priority}
              label="Priority"
              onChange={handleInputChange}
            >
              <MenuItem value="Critical">Critical</MenuItem>
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </Select>
          </FormControl>
          
          <Autocomplete
            options={devices}
            getOptionLabel={(option) => option.Name}
            value={selectedDevice}
            onChange={handleDeviceChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Related Device (optional)"
                placeholder="Select a device"
              />
            )}
            disabled={submitting}
          />
          
          <Autocomplete
            multiple
            options={getFilteredAlerts()}
            getOptionLabel={(option) => `${option.DeviceName}: ${option.Message}`}
            value={selectedAlerts}
            onChange={handleAlertChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Related Alerts (optional)"
                placeholder="Select alerts"
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  label={`${option.DeviceName}: ${option.Message}`}
                  {...getTagProps({ index })}
                  color={
                    option.Severity === 'Critical' ? 'error' :
                    option.Severity === 'Major' ? 'warning' :
                    'default'
                  }
                />
              ))
            }
            disabled={submitting}
          />
          
          <TextField
            fullWidth
            label="Assigned To (optional)"
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleInputChange}
            placeholder="Enter name of assignee"
            disabled={submitting}
          />
          
          <Divider />
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={() => navigate('/incidents')}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={submitting ? <CircularProgress size={24} /> : <SaveIcon />}
              disabled={submitting}
            >
              {submitting ? 'Creating...' : 'Create Incident'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default IncidentCreate;

