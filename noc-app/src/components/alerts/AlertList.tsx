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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  ArrowForward as ArrowForwardIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { alertsAPI } from '../../services/api';

// Mock data for alerts
const mockAlerts = [
  { 
    AlertID: 1, 
    DeviceID: 1, 
    DeviceName: 'Core Router 1',
    Severity: 'Warning', 
    Message: 'High CPU utilization', 
    Source: 'SNMP Monitor', 
    Timestamp: '2023-05-15T08:30:00', 
    Status: 'New' 
  },
  { 
    AlertID: 2, 
    DeviceID: 1, 
    DeviceName: 'Core Router 1',
    Severity: 'Minor', 
    Message: 'Interface flapping', 
    Source: 'SNMP Trap', 
    Timestamp: '2023-05-15T05:30:00', 
    Status: 'Acknowledged' 
  },
  { 
    AlertID: 3, 
    DeviceID: 3, 
    DeviceName: 'Edge Firewall',
    Severity: 'Critical', 
    Message: 'Multiple connection failures', 
    Source: 'Security Monitor', 
    Timestamp: '2023-05-15T09:00:00', 
    Status: 'New' 
  },
  { 
    AlertID: 4, 
    DeviceID: 5, 
    DeviceName: 'Web Server 2',
    Severity: 'Info', 
    Message: 'Scheduled maintenance started', 
    Source: 'System', 
    Timestamp: '2023-05-14T22:00:00', 
    Status: 'Acknowledged' 
  },
  { 
    AlertID: 5, 
    DeviceID: 8, 
    DeviceName: 'Branch Router',
    Severity: 'Major', 
    Message: 'Link down', 
    Source: 'SNMP Trap', 
    Timestamp: '2023-05-15T09:30:00', 
    Status: 'New' 
  },
  { 
    AlertID: 6, 
    DeviceID: 4, 
    DeviceName: 'Web Server 1',
    Severity: 'Warning', 
    Message: 'Disk space below threshold', 
    Source: 'Agent', 
    Timestamp: '2023-05-15T06:00:00', 
    Status: 'In Progress' 
  },
  { 
    AlertID: 7, 
    DeviceID: 6, 
    DeviceName: 'Database Server',
    Severity: 'Critical', 
    Message: 'Database connection failures', 
    Source: 'Application Monitor', 
    Timestamp: '2023-05-15T09:15:00', 
    Status: 'New' 
  },
  { 
    AlertID: 8, 
    DeviceID: 10, 
    DeviceName: 'Monitoring Server',
    Severity: 'Minor', 
    Message: 'Service restart required', 
    Source: 'Agent', 
    Timestamp: '2023-05-15T07:00:00', 
    Status: 'Resolved' 
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
}

const AlertList: React.FC = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  
  useEffect(() => {
    fetchAlerts();
  }, []);
  
  const fetchAlerts = async () => {
    setLoading(true);
    setError('');
    
    try {
      // In a real application, this would call the API
      // const response = await alertsAPI.getAllAlerts();
      // setAlerts(response.data);
      
      // For demo purposes, we'll use mock data
      setTimeout(() => {
        setAlerts(mockAlerts);
        setLoading(false);
      }, 1000);
    } catch (err: any) {
      setError('Failed to fetch alerts. ' + (err.message || ''));
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
  
  const handleSeverityFilterChange = (event: any) => {
    setSeverityFilter(event.target.value);
    setPage(0);
  };
  
  const handleStatusFilterChange = (event: any) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };
  
  const handleClearFilters = () => {
    setSearchTerm('');
    setSeverityFilter('');
    setStatusFilter('');
    setPage(0);
  };
  
  const handleAcknowledgeAlert = async (id: number) => {
    try {
      // In a real application, this would call the API
      // await alertsAPI.updateAlertStatus(id, 'Acknowledged');
      
      // For demo purposes, we'll just update the local state
      setAlerts(alerts.map(alert => 
        alert.AlertID === id ? { ...alert, Status: 'Acknowledged' } : alert
      ));
    } catch (err: any) {
      setError('Failed to acknowledge alert. ' + (err.message || ''));
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
  
  const getSeverityChip = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return <Chip label="Critical" color="error" size="small" />;
      case 'major':
        return <Chip label="Major" sx={{ bgcolor: 'orange', color: 'white' }} size="small" />;
      case 'warning':
        return <Chip label="Warning" color="warning" size="small" />;
      case 'minor':
        return <Chip label="Minor" color="info" size="small" />;
      case 'info':
        return <Chip label="Info" color="default" size="small" />;
      default:
        return <Chip label={severity} size="small" />;
    }
  };
  
  const getStatusChip = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new':
        return <Chip label="New" color="error" size="small" />;
      case 'in progress':
        return <Chip label="In Progress" color="warning" size="small" />;
      case 'acknowledged':
        return <Chip label="Acknowledged" color="info" size="small" />;
      case 'resolved':
        return <Chip label="Resolved" color="success" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };
  
  // Filter alerts based on search term and filters
  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = 
      alert.Message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.DeviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.Source.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSeverity = !severityFilter || alert.Severity.toLowerCase() === severityFilter.toLowerCase();
    const matchesStatus = !statusFilter || alert.Status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesSeverity && matchesStatus;
  });
  
  // Paginate alerts
  const paginatedAlerts = filteredAlerts.slice(
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
          Alerts
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<RefreshIcon />}
          onClick={fetchAlerts}
        >
          Refresh
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search alerts by message, device, or source..."
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
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Severity</InputLabel>
                <Select
                  value={severityFilter}
                  onChange={handleSeverityFilterChange}
                  label="Severity"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="critical">Critical</MenuItem>
                  <MenuItem value="major">Major</MenuItem>
                  <MenuItem value="warning">Warning</MenuItem>
                  <MenuItem value="minor">Minor</MenuItem>
                  <MenuItem value="info">Info</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  label="Status"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="new">New</MenuItem>
                  <MenuItem value="in progress">In Progress</MenuItem>
                  <MenuItem value="acknowledged">Acknowledged</MenuItem>
                  <MenuItem value="resolved">Resolved</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              <Button 
                variant="outlined" 
                startIcon={<FilterIcon />}
                onClick={handleClearFilters}
                disabled={!searchTerm && !severityFilter && !statusFilter}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </Box>
        
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <TableHead>
              <TableRow>
                <TableCell>Severity</TableCell>
                <TableCell>Device</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedAlerts.length > 0 ? (
                paginatedAlerts.map((alert) => (
                  <TableRow
                    hover
                    key={alert.AlertID}
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/alerts/${alert.AlertID}`)}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {getSeverityChip(alert.Severity)}
                      </Box>
                    </TableCell>
                    <TableCell>{alert.DeviceName}</TableCell>
                    <TableCell>{alert.Message}</TableCell>
                    <TableCell>{alert.Source}</TableCell>
                    <TableCell>{new Date(alert.Timestamp).toLocaleString()}</TableCell>
                    <TableCell>{getStatusChip(alert.Status)}</TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        {alert.Status === 'New' && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAcknowledgeAlert(alert.AlertID);
                            }}
                            sx={{ mr: 1 }}
                          >
                            Acknowledge
                          </Button>
                        )}
                        <IconButton 
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/alerts/${alert.AlertID}`);
                          }}
                        >
                          <ArrowForwardIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    {searchTerm || severityFilter || statusFilter ? 
                      'No alerts match your search criteria' : 
                      'No alerts found'
                    }
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredAlerts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default AlertList;

// Helper component for the grid layout
const Grid = {
  container: ({ children, spacing, alignItems }: any) => (
    <Box sx={{ 
      display: 'flex', 
      flexWrap: 'wrap', 
      margin: -spacing/2,
      alignItems: alignItems || 'flex-start'
    }}>
      {children}
    </Box>
  ),
  item: ({ children, xs, sm, md, sx }: any) => (
    <Box sx={{ 
      padding: 1,
      width: {
        xs: xs === 12 ? '100%' : `${(xs / 12) * 100}%`,
        sm: sm && `${(sm / 12) * 100}%`,
        md: md && `${(md / 12) * 100}%`,
      },
      ...sx
    }}>
      {children}
    </Box>
  )
};

