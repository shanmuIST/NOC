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
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { incidentsAPI } from '../../services/api';

// Mock data for incidents
const mockIncidents = [
  {
    IncidentID: 1,
    Title: 'Database connectivity issues',
    Description: 'Multiple applications reporting database connection failures',
    Priority: 'Critical',
    Status: 'In Progress',
    DeviceID: 6,
    DeviceName: 'Database Server',
    AssignedTo: 'John Smith',
    CreatedAt: '2023-05-15T09:00:00',
    UpdatedAt: '2023-05-15T10:00:00',
    ResolvedAt: null,
  },
  {
    IncidentID: 2,
    Title: 'Branch office network outage',
    Description: 'Branch office reporting complete network outage',
    Priority: 'High',
    Status: 'Open',
    DeviceID: 8,
    DeviceName: 'Branch Router',
    AssignedTo: null,
    CreatedAt: '2023-05-15T09:30:00',
    UpdatedAt: null,
    ResolvedAt: null,
  },
  {
    IncidentID: 3,
    Title: 'Web server performance degradation',
    Description: 'Users reporting slow response times on web applications',
    Priority: 'Medium',
    Status: 'In Progress',
    DeviceID: 4,
    DeviceName: 'Web Server 1',
    AssignedTo: 'Jane Doe',
    CreatedAt: '2023-05-15T06:00:00',
    UpdatedAt: '2023-05-15T08:00:00',
    ResolvedAt: null,
  },
  {
    IncidentID: 4,
    Title: 'Firewall policy update',
    Description: 'Scheduled update of firewall security policies',
    Priority: 'Low',
    Status: 'Closed',
    DeviceID: 3,
    DeviceName: 'Edge Firewall',
    AssignedTo: 'Admin User',
    CreatedAt: '2023-05-13T10:00:00',
    UpdatedAt: '2023-05-14T10:00:00',
    ResolvedAt: '2023-05-14T09:00:00',
  },
  {
    IncidentID: 5,
    Title: 'Email server maintenance',
    Description: 'Scheduled maintenance for email server',
    Priority: 'Medium',
    Status: 'Resolved',
    DeviceID: null,
    DeviceName: 'Email Server',
    AssignedTo: 'System Admin',
    CreatedAt: '2023-05-12T08:00:00',
    UpdatedAt: '2023-05-12T12:00:00',
    ResolvedAt: '2023-05-12T11:30:00',
  },
];

interface Incident {
  IncidentID: number;
  Title: string;
  Description: string;
  Priority: string;
  Status: string;
  DeviceID: number | null;
  DeviceName: string | null;
  AssignedTo: string | null;
  CreatedAt: string;
  UpdatedAt: string | null;
  ResolvedAt: string | null;
}

const IncidentList: React.FC = () => {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  
  useEffect(() => {
    fetchIncidents();
  }, []);
  
  const fetchIncidents = async () => {
    setLoading(true);
    setError('');
    
    try {
      // In a real application, this would call the API
      // const response = await incidentsAPI.getAllIncidents();
      // setIncidents(response.data);
      
      // For demo purposes, we'll use mock data
      setTimeout(() => {
        setIncidents(mockIncidents);
        setLoading(false);
      }, 1000);
    } catch (err: any) {
      setError('Failed to fetch incidents. ' + (err.message || ''));
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
  
  const handlePriorityFilterChange = (event: any) => {
    setPriorityFilter(event.target.value);
    setPage(0);
  };
  
  const handleStatusFilterChange = (event: any) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };
  
  const handleClearFilters = () => {
    setSearchTerm('');
    setPriorityFilter('');
    setStatusFilter('');
    setPage(0);
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
  
  // Filter incidents based on search term and filters
  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = 
      incident.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.Description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (incident.DeviceName && incident.DeviceName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (incident.AssignedTo && incident.AssignedTo.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesPriority = !priorityFilter || incident.Priority.toLowerCase() === priorityFilter.toLowerCase();
    const matchesStatus = !statusFilter || incident.Status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesPriority && matchesStatus;
  });
  
  // Paginate incidents
  const paginatedIncidents = filteredIncidents.slice(
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
          Incidents
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="outlined" 
            startIcon={<RefreshIcon />}
            onClick={fetchIncidents}
          >
            Refresh
          </Button>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => navigate('/incidents/create')}
          >
            New Incident
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
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search incidents by title, description, device, or assignee..."
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
                <InputLabel>Priority</InputLabel>
                <Select
                  value={priorityFilter}
                  onChange={handlePriorityFilterChange}
                  label="Priority"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="critical">Critical</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
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
                  <MenuItem value="open">Open</MenuItem>
                  <MenuItem value="in progress">In Progress</MenuItem>
                  <MenuItem value="resolved">Resolved</MenuItem>
                  <MenuItem value="closed">Closed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              <Button 
                variant="outlined" 
                startIcon={<FilterIcon />}
                onClick={handleClearFilters}
                disabled={!searchTerm && !priorityFilter && !statusFilter}
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
                <TableCell>Title</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Device</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedIncidents.length > 0 ? (
                paginatedIncidents.map((incident) => (
                  <TableRow
                    hover
                    key={incident.IncidentID}
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/incidents/${incident.IncidentID}`)}
                  >
                    <TableCell>
                      <Typography variant="body1" noWrap sx={{ maxWidth: 300 }}>
                        {incident.Title}
                      </Typography>
                    </TableCell>
                    <TableCell>{getPriorityChip(incident.Priority)}</TableCell>
                    <TableCell>{getStatusChip(incident.Status)}</TableCell>
                    <TableCell>{incident.DeviceName || 'N/A'}</TableCell>
                    <TableCell>{incident.AssignedTo || 'Unassigned'}</TableCell>
                    <TableCell>{new Date(incident.CreatedAt).toLocaleString()}</TableCell>
                    <TableCell align="right">
                      <IconButton 
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/incidents/${incident.IncidentID}`);
                        }}
                      >
                        <ArrowForwardIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    {searchTerm || priorityFilter || statusFilter ? 
                      'No incidents match your search criteria' : 
                      'No incidents found'
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
          count={filteredIncidents.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default IncidentList;
