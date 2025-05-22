-- Create NOC Database Schema

-- Create Devices Table
CREATE TABLE Devices (
    DeviceID INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Type NVARCHAR(50) NOT NULL,
    IPAddress NVARCHAR(50) NOT NULL,
    Location NVARCHAR(100),
    Status NVARCHAR(20) NOT NULL,
    LastUpdated DATETIME NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- Create Alerts Table
CREATE TABLE Alerts (
    AlertID INT IDENTITY(1,1) PRIMARY KEY,
    DeviceID INT FOREIGN KEY REFERENCES Devices(DeviceID),
    Severity NVARCHAR(20) NOT NULL, -- Critical, Major, Minor, Warning, Info
    Message NVARCHAR(500) NOT NULL,
    Source NVARCHAR(100),
    Timestamp DATETIME NOT NULL,
    Status NVARCHAR(20) NOT NULL, -- New, In Progress, Resolved, Acknowledged
    ResolutionTimestamp DATETIME NULL
);

-- Create Incidents Table
CREATE TABLE Incidents (
    IncidentID INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(1000),
    Priority NVARCHAR(20) NOT NULL, -- Critical, High, Medium, Low
    Status NVARCHAR(20) NOT NULL, -- Open, In Progress, Resolved, Closed
    DeviceID INT NULL FOREIGN KEY REFERENCES Devices(DeviceID),
    AssignedTo NVARCHAR(100),
    CreatedAt DATETIME NOT NULL,
    UpdatedAt DATETIME NULL,
    ResolvedAt DATETIME NULL
);

-- Create IncidentAlerts Table (for linking incidents to alerts)
CREATE TABLE IncidentAlerts (
    IncidentID INT FOREIGN KEY REFERENCES Incidents(IncidentID),
    AlertID INT FOREIGN KEY REFERENCES Alerts(AlertID),
    PRIMARY KEY (IncidentID, AlertID)
);

-- Create IncidentComments Table
CREATE TABLE IncidentComments (
    CommentID INT IDENTITY(1,1) PRIMARY KEY,
    IncidentID INT FOREIGN KEY REFERENCES Incidents(IncidentID),
    Comment NVARCHAR(1000) NOT NULL,
    Author NVARCHAR(100) NOT NULL,
    CreatedAt DATETIME NOT NULL
);

-- Create Users Table
CREATE TABLE Users (
    UserID INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(50) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) NOT NULL,
    FullName NVARCHAR(100) NOT NULL,
    Role NVARCHAR(20) NOT NULL, -- Admin, Operator, Viewer
    LastLogin DATETIME NULL,
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- Create Maintenance Table
CREATE TABLE Maintenance (
    MaintenanceID INT IDENTITY(1,1) PRIMARY KEY,
    DeviceID INT FOREIGN KEY REFERENCES Devices(DeviceID),
    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(1000),
    ScheduledStart DATETIME NOT NULL,
    ScheduledEnd DATETIME NOT NULL,
    Status NVARCHAR(20) NOT NULL, -- Scheduled, In Progress, Completed, Cancelled
    CreatedBy NVARCHAR(100) NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- Create DeviceMetrics Table
CREATE TABLE DeviceMetrics (
    MetricID INT IDENTITY(1,1) PRIMARY KEY,
    DeviceID INT FOREIGN KEY REFERENCES Devices(DeviceID),
    MetricName NVARCHAR(100) NOT NULL,
    MetricValue FLOAT NOT NULL,
    Timestamp DATETIME NOT NULL,
    INDEX IX_DeviceMetrics_DeviceID_Timestamp (DeviceID, Timestamp)
);

-- Create sample data for testing

-- Insert sample devices
INSERT INTO Devices (Name, Type, IPAddress, Location, Status, LastUpdated)
VALUES 
('Core Router 1', 'Router', '192.168.1.1', 'Main Data Center', 'Active', GETDATE()),
('Core Switch 1', 'Switch', '192.168.1.2', 'Main Data Center', 'Active', GETDATE()),
('Edge Firewall', 'Firewall', '192.168.1.3', 'Main Data Center', 'Active', GETDATE()),
('Web Server 1', 'Server', '192.168.2.10', 'Application Cluster', 'Active', GETDATE()),
('Web Server 2', 'Server', '192.168.2.11', 'Application Cluster', 'Maintenance', GETDATE()),
('Database Server', 'Server', '192.168.2.20', 'Database Cluster', 'Active', GETDATE()),
('Backup Server', 'Server', '192.168.2.30', 'Storage Area', 'Active', GETDATE()),
('Branch Router', 'Router', '10.10.10.1', 'Branch Office', 'Warning', GETDATE()),
('Branch Switch', 'Switch', '10.10.10.2', 'Branch Office', 'Active', GETDATE()),
('Monitoring Server', 'Server', '192.168.3.10', 'Management Network', 'Active', GETDATE());

-- Insert sample alerts
INSERT INTO Alerts (DeviceID, Severity, Message, Source, Timestamp, Status)
VALUES 
(1, 'Warning', 'High CPU utilization', 'SNMP Monitor', DATEADD(HOUR, -2, GETDATE()), 'New'),
(1, 'Minor', 'Interface flapping', 'SNMP Trap', DATEADD(HOUR, -5, GETDATE()), 'Acknowledged'),
(3, 'Critical', 'Multiple connection failures', 'Security Monitor', DATEADD(HOUR, -1, GETDATE()), 'New'),
(5, 'Info', 'Scheduled maintenance started', 'System', DATEADD(HOUR, -12, GETDATE()), 'Acknowledged'),
(8, 'Major', 'Link down', 'SNMP Trap', DATEADD(MINUTE, -30, GETDATE()), 'New'),
(4, 'Warning', 'Disk space below threshold', 'Agent', DATEADD(HOUR, -4, GETDATE()), 'In Progress'),
(6, 'Critical', 'Database connection failures', 'Application Monitor', DATEADD(MINUTE, -45, GETDATE()), 'New'),
(10, 'Minor', 'Service restart required', 'Agent', DATEADD(HOUR, -3, GETDATE()), 'Resolved');

-- Insert sample incidents
INSERT INTO Incidents (Title, Description, Priority, Status, DeviceID, AssignedTo, CreatedAt, UpdatedAt)
VALUES 
('Database connectivity issues', 'Multiple applications reporting database connection failures', 'Critical', 'In Progress', 6, 'John Smith', DATEADD(HOUR, -1, GETDATE()), GETDATE()),
('Branch office network outage', 'Branch office reporting complete network outage', 'High', 'Open', 8, NULL, DATEADD(MINUTE, -30, GETDATE()), NULL),
('Web server performance degradation', 'Users reporting slow response times on web applications', 'Medium', 'In Progress', 4, 'Jane Doe', DATEADD(HOUR, -4, GETDATE()), DATEADD(HOUR, -2, GETDATE())),
('Firewall policy update', 'Scheduled update of firewall security policies', 'Low', 'Closed', 3, 'Admin User', DATEADD(DAY, -2, GETDATE()), DATEADD(DAY, -1, GETDATE()));

-- Link incidents to alerts
INSERT INTO IncidentAlerts (IncidentID, AlertID)
VALUES 
(1, 7),
(2, 5),
(3, 6);

-- Insert sample users
INSERT INTO Users (Username, PasswordHash, Email, FullName, Role)
VALUES 
('admin', 'hashed_password_here', 'admin@noc.example', 'Admin User', 'Admin'),
('operator', 'hashed_password_here', 'operator@noc.example', 'John Smith', 'Operator'),
('viewer', 'hashed_password_here', 'viewer@noc.example', 'Jane Doe', 'Viewer');

-- Insert sample comments
INSERT INTO IncidentComments (IncidentID, Comment, Author, CreatedAt)
VALUES 
(1, 'Investigating database connection issues. Initial analysis shows high load on the database server.', 'John Smith', DATEADD(MINUTE, -45, GETDATE())),
(1, 'Identified memory leak in database connection pool. Restarting the service.', 'John Smith', DATEADD(MINUTE, -15, GETDATE())),
(2, 'Dispatched technician to branch office to check physical connectivity.', 'Admin User', DATEADD(MINUTE, -20, GETDATE())),
(3, 'Applied configuration changes to increase available resources.', 'Jane Doe', DATEADD(HOUR, -1, GETDATE()));

