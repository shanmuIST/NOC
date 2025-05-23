import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Router as RouterIcon,
  Storage as ServerIcon,
  Security as FirewallIcon,
  SettingsEthernet as SwitchIcon,
  DeviceHub as GenericDeviceIcon,
} from '@mui/icons-material';
import { devicesAPI } from '../../services/api';

// Mock data for devices
const mockDevices = [
  { 
    DeviceID: 1, 
    Name: 'Core Router 1', 
    Type: 'Router', 
    IPAddress: '192.168.1.1', 
    Location: 'Main Data Center', 
    Status: 'Active', 
    LastUpdated: '2023-05-15T10:30:00' 
  },
  { 
    DeviceID: 2, 
    Name: 'Core Switch 1', 
    Type: 'Switch', 
    IPAddress: '192.168.1.2', 
    Location: 'Main Data Center', 
    Status: 'Active', 
    LastUpdated: '2023-05-15T10:30:00' 
  },
  { 
    DeviceID: 3, 
    Name: 'Edge Firewall', 
    Type: 'Firewall', 
    IPAddress: '192.168.1.3', 
    Location: 'Main Data Center', 
    Status: 'Active', 
    LastUpdated: '2023-05-15T10:30:00' 
  },
  { 
    DeviceID: 4, 
    Name: 'Web Server 1', 
    Type: 'Server', 
    IPAddress: '192.168.2.10', 
    Location: 'Application Cluster', 
    Status: 'Active', 
    LastUpdated: '2023-05-15T10:30:00' 
  },
  { 
    DeviceID: 5, 
    Name: 'Web Server 2', 
    Type: 'Server', 
    IPAddress: '192.168.2.11', 
    Location: 'Application Cluster', 
    Status: 'Maintenance', 
    LastUpdated: '2023-05-15T10:30:00' 
  },
  { 
    DeviceID: 6, 
    Name: 'Database Server', 
    Type: 'Server', 
    IPAddress: '192.168.2.20', 
    Location: 'Database Cluster', 
    Status: 'Active', 
    LastUpdated: '2023-05-15T10:30:00' 
  },
  { 
    DeviceID: 7, 
    Name: 'Backup Server', 
    Type: 'Server', 
    IPAddress: '192.168.2.30', 
    Location: 'Storage Area', 
    Status: 'Active', 
    LastUpdated: '2023-05-15T10:30:00' 
  },
  { 
    DeviceID: 8, 
    Name: 'Branch Router', 
    Type: 'Router', 
    IPAddress: '10.10.10.1', 
    Location: 'Branch Office', 
    Status: 'Warning', 
    LastUpdated: '2023-05-15T10:30:00' 
  },
  { 
    DeviceID: 9, 
    Name: 'Branch Switch', 
    Type: 'Switch', 
    IPAddress: '10.10.10.2', 
    Location: 'Branch Office', 
    Status: 'Active', 
    LastUpdated: '2023-05-15T10:30:00' 
  },
  { 
    DeviceID: 10, 
    Name: 'Monitoring Server', 
    Type: 'Server', 
    IPAddress: '192.168.3.10', 
    Location: 'Management Network', 
    Status: 'Active', 
    LastUpdated: '2023-05-15T10:30:00' 
  },
];

interface Device {
  DeviceID: number;
  Name: string;
  Type: string;
  IPAddress: string;
  Location: string;
  Status: string;
  LastUpdated: string;
}

interface DeviceFormData {
  name: string;
  type: string;
  ipAddress: string;
  location: string;
  status: string;
}

const DeviceList: React.FC = () => {
  const navigate = useNavigate();
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState<DeviceFormData>({
    name: '',
    type: 'Server',
    ipAddress: '',
    location: '',
    status: 'Active',
  });
  const [formErrors, setFormErrors] = useState<Partial<DeviceFormData>>({});
  
  useEffect(() => {
    fetchDevices();
  }, []);
  
  const fetchDevices = async () => {
    setLoading(true);
    setError('');
    
    try {
      // In a real application, this would call the API
      // const response = await devicesAPI.getAllDevices();
      // setDevices(response.data);
      
      // For demo purposes, we'll use mock data
      setTimeout(() => {
        setDevices(mockDevices);
        setLoading(false);
      }, 1000);
    } catch (err: any) {
      setError('Failed to fetch devices. ' + (err.message || ''));
      setLoading(false);
    }
  };
  
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };
  
  const handleOpenDialog = () => {
    setFormData({
      name: '',
      type: 'Server',
      ipAddress: '',
      location: '',
      status: 'Active',
    });
    setFormErrors({});
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  
  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name as string]: value,
    });
    
    // Clear error for this field
    if (formErrors[name as keyof DeviceFormData]) {
      setFormErrors({
        ...formErrors,
        [name as string]: '',
      });
    }
  };
  
  const validateForm = (): boolean => {
    const errors: Partial<DeviceFormData> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.ipAddress.trim()) {
      errors.ipAddress = 'IP Address is required';
    } else {
      // Simple IP validation
      const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
      if (!ipPattern.test(formData.ipAddress)) {
        errors.ipAddress = 'Invalid IP address format';
      }
    }
    
    if (!formData.location.trim()) {
      errors.location = 'Location is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleAddDevice = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      // In a real application, this would call the API
      // await devicesAPI.createDevice({
      //   name: formData.name,
      //   type: formData.type,
      //   ipAddress: formData.ipAddress,
      //   location: formData.location,
      //   status: formData.status,
      // });
      
      // For demo purposes, we'll just add to the local state
      const newDevice: Device = {
        DeviceID: devices.length + 1,
        Name: formData.name,
        Type: formData.type,
        IPAddress: formData.ipAddress,
        Location: formData.location,
        Status: formData.status,
        LastUpdated: new Date().toISOString(),
      };
      
      setDevices([...devices, newDevice]);
      handleCloseDialog();
    } catch (err: any) {
      setError('Failed to add device. ' + (err.message || ''));
    }
  };
  
  const handleDeleteDevice = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this device?')) {
      try {
        // In a real application, this would call the API
        // await devicesAPI.deleteDevice(id);
        
        // For demo purposes, we'll just remove from the local state
        setDevices(devices.filter(device => device.DeviceID !== id));
      } catch (err: any) {
        setError('Failed to delete device. ' + (err.message || ''));
      }
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
  
  const getStatusChip = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <Chip label="Active" color="success" size="small" />;
      case 'warning':
        return <Chip label="Warning" color="warning" size="small" />;
      case 'critical':
        return <Chip label="Critical" color="error" size="small" />;
      case 'maintenance':
        return <Chip label="Maintenance" color="info" size="small" />;
      case 'offline':
        return <Chip label="Offline" color="default" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };
  
  // Filter devices based on search term
  const filteredDevices = devices.filter(device => 
    device.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.IPAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.Type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.Location.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Paginate devices
  const paginatedDevices = filteredDevices.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  
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
          Devices
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="outlined" 
            startIcon={<RefreshIcon />}
            onClick={fetchDevices}
          >
            Refresh
          </Button>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
          >
            Add Device
          </Button>
        </Box>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search devices by name, IP, type, or location..."
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>IP Address</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Updated</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedDevices.length > 0 ? (
                paginatedDevices.map((device) => (
                  <TableRow
                    hover
                    key={device.DeviceID}
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/devices/${device.DeviceID}`)}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getDeviceIcon(device.Type)}
                        {device.Name}
                      </Box>
                    </TableCell>
                    <TableCell>{device.Type}</TableCell>
                    <TableCell>{device.IPAddress}</TableCell>
                    <TableCell>{device.Location}</TableCell>
                    <TableCell>{getStatusChip(device.Status)}</TableCell>
                    <TableCell>
                      {new Date(device.LastUpdated).toLocaleString()}
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <IconButton 
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/devices/${device.DeviceID}/edit`);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteDevice(device.DeviceID);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    {searchTerm ? 'No devices match your search criteria' : 'No devices found'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredDevices.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      
      {/* Add Device Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Device</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Device Name"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              error={!!formErrors.name}
              helperText={formErrors.name}
              required
            />
            
            <FormControl fullWidth>
              <InputLabel>Device Type</InputLabel>
              <Select
                name="type"
                value={formData.type}
                label="Device Type"
                onChange={handleFormChange}
              >
                <MenuItem value="Router">Router</MenuItem>
                <MenuItem value="Switch">Switch</MenuItem>
                <MenuItem value="Firewall">Firewall</MenuItem>
                <MenuItem value="Server">Server</MenuItem>
                <MenuItem value="Workstation">Workstation</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="IP Address"
              name="ipAddress"
              value={formData.ipAddress}
              onChange={handleFormChange}
              error={!!formErrors.ipAddress}
              helperText={formErrors.ipAddress}
              required
            />
            
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleFormChange}
              error={!!formErrors.location}
              helperText={formErrors.location}
              required
            />
            
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                label="Status"
                onChange={handleFormChange}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Warning">Warning</MenuItem>
                <MenuItem value="Critical">Critical</MenuItem>
                <MenuItem value="Maintenance">Maintenance</MenuItem>
                <MenuItem value="Offline">Offline</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleAddDevice} variant="contained">Add Device</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DeviceList;

