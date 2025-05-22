import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (username: string, password: string) => 
    api.post('/auth/login', { username, password }),
  
  logout: () => 
    api.post('/auth/logout'),
  
  getCurrentUser: () => 
    api.get('/auth/me'),
};

// Devices API
export const devicesAPI = {
  getAllDevices: () => 
    api.get('/devices'),
  
  getDeviceById: (id: number) => 
    api.get(`/devices/${id}`),
  
  createDevice: (deviceData: any) => 
    api.post('/devices', deviceData),
  
  updateDevice: (id: number, deviceData: any) => 
    api.put(`/devices/${id}`, deviceData),
  
  deleteDevice: (id: number) => 
    api.delete(`/devices/${id}`),
};

// Alerts API
export const alertsAPI = {
  getAllAlerts: () => 
    api.get('/alerts'),
  
  getAlertById: (id: number) => 
    api.get(`/alerts/${id}`),
  
  getAlertsByDevice: (deviceId: number) => 
    api.get(`/alerts/device/${deviceId}`),
  
  createAlert: (alertData: any) => 
    api.post('/alerts', alertData),
  
  updateAlertStatus: (id: number, status: string) => 
    api.put(`/alerts/${id}/status`, { status }),
  
  deleteAlert: (id: number) => 
    api.delete(`/alerts/${id}`),
};

// Incidents API
export const incidentsAPI = {
  getAllIncidents: () => 
    api.get('/incidents'),
  
  getIncidentById: (id: number) => 
    api.get(`/incidents/${id}`),
  
  createIncident: (incidentData: any) => 
    api.post('/incidents', incidentData),
  
  updateIncident: (id: number, incidentData: any) => 
    api.put(`/incidents/${id}`, incidentData),
  
  getIncidentComments: (id: number) => 
    api.get(`/incidents/${id}/comments`),
  
  addIncidentComment: (id: number, commentData: any) => 
    api.post(`/incidents/${id}/comments`, commentData),
};

// Reports API
export const reportsAPI = {
  getAlertStats: () => 
    api.get('/reports/alert-stats'),
  
  getIncidentStats: () => 
    api.get('/reports/incident-stats'),
  
  getDeviceStatus: () => 
    api.get('/reports/device-status'),
  
  getDetailedReport: (startDate: string, endDate: string) => 
    api.get('/reports/detailed', { params: { startDate, endDate } }),
};

export default api;

