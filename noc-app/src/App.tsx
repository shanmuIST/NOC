import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import MainLayout from './layouts/MainLayout';
import Dashboard from './components/dashboard/Dashboard';
import DeviceList from './components/devices/DeviceList';
import DeviceDetail from './components/devices/DeviceDetail';
import AlertList from './components/alerts/AlertList';
import AlertDetail from './components/alerts/AlertDetail';
import IncidentList from './components/incidents/IncidentList';
import IncidentDetail from './components/incidents/IncidentDetail';
import IncidentCreate from './components/incidents/IncidentCreate';
import Reports from './components/reports/Reports';
import Login from './components/auth/Login';
import NotFound from './components/common/NotFound';
import './App.css';

// Create a dark theme for the NOC application
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#ff9800',
    },
    info: {
      main: '#2196f3',
    },
    success: {
      main: '#4caf50',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="devices" element={<DeviceList />} />
            <Route path="devices/:id" element={<DeviceDetail />} />
            <Route path="alerts" element={<AlertList />} />
            <Route path="alerts/:id" element={<AlertDetail />} />
            <Route path="incidents" element={<IncidentList />} />
            <Route path="incidents/create" element={<IncidentCreate />} />
            <Route path="incidents/:id" element={<IncidentDetail />} />
            <Route path="reports" element={<Reports />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

