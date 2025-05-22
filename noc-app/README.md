# NOC (Network Operations Center) Application

A comprehensive Network Operations Center (NOC) application built with React.js and SQL Server, designed to monitor and manage network devices, alerts, and incidents.

## Features

- **Dashboard**: Real-time overview of network status, alerts, and incidents
- **Device Management**: Track and manage network devices
- **Alert Monitoring**: View and respond to alerts from various sources
- **Incident Management**: Create, track, and resolve incidents
- **Reporting**: Generate reports and visualize network performance metrics

## Tech Stack

### Frontend
- React.js with TypeScript
- Material-UI for UI components
- Recharts for data visualization
- React Router for navigation
- Axios for API communication

### Backend
- Node.js with Express
- SQL Server for database
- JWT for authentication

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- SQL Server (2016 or higher)

## Installation

### Setting up the Database

1. Connect to your SQL Server instance
2. Create a new database named `NOC_DB`
3. Run the SQL script in `server/database/schema.sql` to create the necessary tables and sample data

### Setting up the Backend

1. Navigate to the server directory:
   ```
   cd noc-app/server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example` and update with your SQL Server credentials:
   ```
   cp .env.example .env
   ```

4. Start the server:
   ```
   npm run dev
   ```

### Setting up the Frontend

1. Navigate to the project root directory:
   ```
   cd noc-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the API URL:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```
   npm start
   ```

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Log in with the demo credentials:
   - Username: `admin`
   - Password: `admin`
3. Explore the dashboard and various features of the NOC application

## Project Structure

```
noc-app/
├── public/                  # Static files
├── server/                  # Backend server
│   ├── database/            # Database scripts
│   ├── routes/              # API routes
│   └── server.js            # Express server
├── src/
│   ├── api/                 # API integration
│   ├── assets/              # Images and other assets
│   ├── components/          # React components
│   │   ├── alerts/          # Alert-related components
│   │   ├── auth/            # Authentication components
│   │   ├── common/          # Shared components
│   │   ├── dashboard/       # Dashboard components
│   │   ├── devices/         # Device management components
│   │   ├── incidents/       # Incident management components
│   │   └── reports/         # Reporting components
│   ├── layouts/             # Layout components
│   ├── services/            # API services
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   ├── App.tsx              # Main App component
│   └── index.tsx            # Entry point
└── package.json             # Project dependencies
```

## Development

### Adding New Features

1. Create new components in the appropriate directories
2. Update the API services as needed
3. Add new routes to the backend server

### Database Modifications

1. Create a new SQL script for your changes
2. Apply the changes to your development database
3. Update the schema.sql file for future installations

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [React](https://reactjs.org/)
- [Material-UI](https://mui.com/)
- [Recharts](https://recharts.org/)
- [Express](https://expressjs.com/)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/)

