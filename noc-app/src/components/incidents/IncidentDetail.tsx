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
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { incidentsAPI } from '../../services/api';

// Mock data for incident details
const mockIncident = {
  IncidentID: 1,
  Title: 'Database connectivity issues',
  Description: 'Multiple applications reporting database connection failures. Connection pool exhaustion detected. Database server showing high CPU and memory usage.',
  Priority: 'Critical',
  Status: 'In Progress',
  DeviceID: 6,
  DeviceName: 'Database Server',
  AssignedTo: 'John Smith',
  CreatedAt: '2023-05-15T09:00:00',
  UpdatedAt: '2023-05-15T10:00:00',
  ResolvedAt: null,
};

// Mock data for related alerts
const mockRelatedAlerts = [
  {
    AlertID: 7,
    DeviceID: 6,
    DeviceName: 'Database Server',
    Severity: 'Critical',
    Message: 'Database connection failures',
    Source: 'Application Monitor',
    Timestamp: '2023-05-15T09:15:00',
    Status: 'In Progress',
  },
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

// Mock data for comments
const mockComments = [
  {
    CommentID: 1,
    IncidentID: 1,
    Comment: 'Investigating database connection issues. Initial analysis shows high load on the database server.',
    Author: 'John Smith',
    CreatedAt: '2023-05-15T09:15:00',
  },
  {
    CommentID: 2,
    IncidentID: 1,
    Comment: 'Identified memory leak in database connection pool. Restarting the service.',
    Author: 'John Smith',
    CreatedAt: '2023-05-15T09:45:00',
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
  relatedAlerts?: Alert[];
}

interface Alert {
  AlertID: number;
  DeviceID: number;
  DeviceName: string;
  Severity: string;
  Message: string;
  Source?: string;
  Timestamp: string;
  Status: string;
}

interface Comment {
  CommentID: number;
  IncidentID: number;
  Comment: string;
  Author: string;
  CreatedAt: string;
}

const IncidentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [incident, setIncident] = useState<Incident | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    priority: '',
    status: '',
    assignedTo: '',
  });
  const [formErrors, setFormErrors] = useState<any>({});
  
  useEffect(() => {
    fetchIncidentData();
  }, [id]);
  
  const fetchIncidentData = async () => {
    setLoading(true);
    setError('');
    
    try {
      // In a real application, this would call the API
      // const incidentResponse = await incidentsAPI.getIncidentById(Number(id));
      // const commentsResponse = await incidentsAPI.getIncidentComments(Number(id));
      // setIncident(incidentResponse.data);
      // setComments(commentsResponse.data);
      
      // For demo purposes, we'll use mock data
      setTimeout(() => {
        const incidentData = { ...mockIncident, relatedAlerts: mockRelatedAlerts };
        setIncident(incidentData);
        setComments(mockComments);
        
        // Pre-fill edit form data
        setEditFormData({
          title: mockIncident.Title,
          description: mockIncident.Description,
          priority: mockIncident.Priority,
          status: mockIncident.Status,
          assignedTo: mockIncident.AssignedTo || '',
        });
        
        setLoading(false);
      }, 1000);
    } catch (err: any) {
      setError('Failed to fetch incident data. ' + (err.message || ''));
      setLoading(false);
    }
  };
  
  const handleAddComment = async () => {
    if (!newComment.trim()) {
      return;
    }
    
    try {
      // In a real application, this would call the API
      // const response = await incidentsAPI.addIncidentComment(Number(id), {
      //   comment: newComment,
      //   author: 'Current User', // This would come from auth context
      // });
      
      // For demo purposes, we'll just update the local state
      const newCommentObj: Comment = {
        CommentID: comments.length + 1,
        IncidentID: Number(id),
        Comment: newComment,
        Author: 'Current User', // This would come from auth context
        CreatedAt: new Date().toISOString(),
      };
      
      setComments([...comments, newCommentObj]);
      setNewComment('');
    } catch (err: any) {
      setError('Failed to add comment. ' + (err.message || ''));
    }
  };
  
  const handleOpenEditDialog = () => {
    setOpenEditDialog(true);
  };
  
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };
  
  const handleEditFormChange = (event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = event.target;
    setEditFormData({
      ...editFormData,
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
  
  const validateEditForm = (): boolean => {
    const errors: any = {};
    
    if (!editFormData.title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!editFormData.description.trim()) {
      errors.description = 'Description is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleUpdateIncident = async () => {
    if (!validateEditForm()) {
      return;
    }
    
    try {
      // In a real application, this would call the API
      // await incidentsAPI.updateIncident(Number(id), {
      //   title: editFormData.title,
      //   description: editFormData.description,
      //   priority: editFormData.priority,
      //   status: editFormData.status,
      //   assignedTo: editFormData.assignedTo || null,
      // });
      
      // For demo purposes, we'll just update the local state
      if (incident) {
        const wasResolved = incident.Status === 'Resolved';
        const isNowResolved = editFormData.status === 'Resolved';
        
        const updatedIncident: Incident = {
          ...incident,
          Title: editFormData.title,
          Description: editFormData.description,
          Priority: editFormData.priority,
          Status: editFormData.status,
          AssignedTo: editFormData.assignedTo || null,
          UpdatedAt: new Date().toISOString(),
          ResolvedAt: isNowResolved && !wasResolved ? new Date().toISOString() : incident.ResolvedAt,
        };
        
        setIncident(updatedIncident);
      }
      
      handleCloseEditDialog();
    } catch (err: any) {
      setError('Failed to update incident. ' + (err.message || ''));
    }
  };
  
  const handleResolveIncident = async () => {
    try {
      // In a real application, this would call the API
      // await incidentsAPI.updateIncident(Number(id), {
      //   status: 'Resolved',
      // });
      
      // For demo purposes, we'll just update the local state
      if (incident) {
        const updatedIncident: Incident = {
          ...incident,
          Status: 'Resolved',
          UpdatedAt: new Date().toISOString(),
          ResolvedAt: new Date().toISOString(),
        };
        
        setIncident(updatedIncident);
        
        // Also update the edit form data
        setEditFormData({
          ...editFormData,
          status: 'Resolved',
        });
      }
    } catch (err: any) {
      setError('Failed to resolve incident. ' + (err.message || ''));
    }
  };
  
  const handleCloseIncident = async () => {
    try {
      // In a real application, this would call the API
      // await incidentsAPI.updateIncident(Number(id), {
      //   status: 'Closed',
      // });
      
      // For demo purposes, we'll just update the local state
      if (incident) {
        const updatedIncident: Incident = {
          ...incident,
          Status: 'Closed',
          UpdatedAt: new Date().toISOString(),
          ResolvedAt: incident.ResolvedAt || new Date().toISOString(),
        };
        
        setIncident(updatedIncident);
        
        // Also update the edit form data
        setEditFormData({
          ...editFormData,
          status: 'Closed',
        });
      }
    } catch (err: any) {
      setError('Failed to close incident. ' + (err.message || ''));
    }
  };
  
  const getPriorityChip = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'critical':
        return <Chip label="Critical" color="error" />;
      case 'high':
        return <Chip label="High" sx={{ bgcolor: 'orange', color: 'white' }} />;
      case 'medium':
        return <Chip label="Medium" color="warning" />;
      case 'low':
        return <Chip label="Low" color="info" />;
      default:
        return <Chip label={priority} />;
    }
  };
  
  const getStatusChip = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return <Chip label="Open" color="error" />;
      case 'in progress':
        return <Chip label="In Progress" color="warning" />;
      case 'resolved':
        return <Chip label="Resolved" color="success" />;
      case 'closed':
        return <Chip label="Closed" color="default" />;
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
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (!incident && !loading) {
    return (
      <Box sx={{ mt: 3 }}>
        <Alert severity="error">
          Incident not found. The incident may have been deleted or you don't have permission to view it.
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/incidents')}
          sx={{ mt: 2 }}
        >
          Back to Incidents
        </Button>
      </Box>
    );
  }
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={() => navigate('/incidents')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            Incident Details
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="outlined" 
            startIcon={<RefreshIcon />}
            onClick={fetchIncidentData}
          >
            Refresh
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<EditIcon />}
            onClick={handleOpenEditDialog}
          >
            Edit
          </Button>
        </Box>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Incident Overview Card */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Typography variant="h5">{incident?.Title}</Typography>
            <Typography variant="body2" color="text.secondary">
              Created: {new Date(incident?.CreatedAt || '').toLocaleString()}
              {incident?.UpdatedAt && ` • Updated: ${new Date(incident.UpdatedAt).toLocaleString()}`}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2 }}>
            {getPriorityChip(incident?.Priority || '')}
            {getStatusChip(incident?.Status || '')}
          </Grid>
          
          <Grid item xs={12}>
            <Divider />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle1">Description</Typography>
            <Typography variant="body1" paragraph>
              {incident?.Description}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">Device</Typography>
            <Typography 
              variant="body1" 
              component={incident?.DeviceID ? "a" : "span"}
              href={incident?.DeviceID ? `/devices/${incident.DeviceID}` : undefined}
              onClick={incident?.DeviceID ? (e) => {
                e.preventDefault();
                navigate(`/devices/${incident.DeviceID}`);
              } : undefined}
              sx={incident?.DeviceID ? { 
                color: 'primary.main', 
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' }
              } : {}}
            >
              {incident?.DeviceName || 'N/A'}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">Assigned To</Typography>
            <Typography variant="body1">
              {incident?.AssignedTo || 'Unassigned'}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">Resolution Time</Typography>
            <Typography variant="body1">
              {incident?.ResolvedAt ? 
                `${Math.round((new Date(incident.ResolvedAt).getTime() - new Date(incident.CreatedAt).getTime()) / (1000 * 60 * 60))} hours` : 
                'Not resolved yet'
              }
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <Divider />
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {incident?.Status !== 'Resolved' && incident?.Status !== 'Closed' && (
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<CheckCircleIcon />}
                  onClick={handleResolveIncident}
                >
                  Resolve Incident
                </Button>
              )}
              
              {incident?.Status !== 'Closed' && (
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<CloseIcon />}
                  onClick={handleCloseIncident}
                >
                  Close Incident
                </Button>
              )}
              
              {incident?.DeviceID && (
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/devices/${incident.DeviceID}`)}
                >
                  View Device
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Related Alerts Card */}
      {incident?.relatedAlerts && incident.relatedAlerts.length > 0 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Related Alerts
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <List>
            {incident.relatedAlerts.map((alert) => (
              <ListItem
                key={alert.AlertID}
                button
                onClick={() => navigate(`/alerts/${alert.AlertID}`)}
                sx={{ mb: 1, bgcolor: 'background.paper', borderRadius: 1 }}
              >
                <ListItemIcon>
                  {getSeverityIcon(alert.Severity)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body1">{alert.Message}</Typography>
                      {getSeverityChip(alert.Severity)}
                    </Box>
                  }
                  secondary={
                    <Typography variant="caption">
                      {alert.DeviceName} • {new Date(alert.Timestamp).toLocaleString()}
                    </Typography>
                  }
                />
                <Chip 
                  label={alert.Status} 
                  color={
                    alert.Status === 'New' ? 'error' : 
                    alert.Status === 'In Progress' ? 'warning' : 
                    alert.Status === 'Acknowledged' ? 'info' : 
                    alert.Status === 'Resolved' ? 'success' : 
                    'default'
                  } 
                  size="small" 
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
      
      {/* Comments Card */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Comments
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <List>
          {comments.map((comment) => (
            <ListItem key={comment.CommentID} alignItems="flex-start" sx={{ mb: 2 }}>
              <ListItemIcon>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  {comment.Author.charAt(0)}
                </Avatar>
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle2">{comment.Author}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(comment.CreatedAt).toLocaleString()}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Typography
                    variant="body2"
                    color="text.primary"
                    sx={{ mt: 1 }}
                  >
                    {comment.Comment}
                  </Typography>
                }
              />
            </ListItem>
          ))}
          
          {comments.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
              No comments yet. Be the first to add a comment.
            </Typography>
          )}
        </List>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            label="Add a comment"
            multiline
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Type your comment here..."
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<SendIcon />}
            onClick={handleAddComment}
            disabled={!newComment.trim()}
            sx={{ alignSelf: 'flex-end' }}
          >
            Send
          </Button>
        </Box>
      </Paper>
      
      {/* Edit Incident Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="md" fullWidth>
        <DialogTitle>Edit Incident</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              fullWidth
              label="Incident Title"
              name="title"
              value={editFormData.title}
              onChange={handleEditFormChange}
              error={!!formErrors.title}
              helperText={formErrors.title}
              required
            />
            
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={editFormData.description}
              onChange={handleEditFormChange}
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
                value={editFormData.priority}
                label="Priority"
                onChange={handleEditFormChange}
              >
                <MenuItem value="Critical">Critical</MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={editFormData.status}
                label="Status"
                onChange={handleEditFormChange}
              >
                <MenuItem value="Open">Open</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Resolved">Resolved</MenuItem>
                <MenuItem value="Closed">Closed</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Assigned To"
              name="assignedTo"
              value={editFormData.assignedTo}
              onChange={handleEditFormChange}
              placeholder="Leave blank for unassigned"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button onClick={handleUpdateIncident} variant="contained" color="primary">
            Update Incident
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default IncidentDetail;

// Helper component for the grid layout
const Grid = {
  container: ({ children, spacing }: any) => (
    <Box sx={{ 
      display: 'flex', 
      flexWrap: 'wrap', 
      margin: -spacing/2 
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

