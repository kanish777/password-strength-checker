# Password Strength Checker - Backend

## Overview
Node.js/Express backend API for the Password Strength Checker application, connected to Aiven MySQL Cloud Database.

## Prerequisites
- Node.js 16+
- npm or yarn
- Aiven MySQL Database account

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Aiven MySQL

1. **Create an Aiven Account**: Go to [https://console.aiven.io](https://console.aiven.io) and create a free account.

2. **Create a MySQL Service**:
   - Click "Create Service"
   - Select "MySQL"
   - Choose your cloud provider and region
   - Select the plan (Free tier available for testing)
   - Click "Create Service"

3. **Get Connection Details**:
   - Once the service is running, go to the service overview
   - Find the connection details:
     - Host: `mysql-xxxxx-xxxxx.aivencloud.com`
     - Port: `3306` (or custom port)
     - User: `avnadmin` (default)
     - Password: (shown in console)
     - Database: `defaultdb`

4. **Download CA Certificate** (Optional but recommended):
   - In the Aiven console, download the CA certificate
   - Save it as `ca.pem` in the backend folder

### 3. Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` with your Aiven credentials:
```env
AIVEN_MYSQL_HOST=your-mysql-host.aivencloud.com
AIVEN_MYSQL_PORT=3306
AIVEN_MYSQL_USER=avnadmin
AIVEN_MYSQL_PASSWORD=your-password-here
AIVEN_MYSQL_DATABASE=defaultdb
PORT=3001
FRONTEND_URL=http://localhost:5173
```

### 4. Run the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Health Check
```
GET /api/health
```
Returns server and database connection status.

### Password Checks

#### Save a password check
```
POST /api/password-checks
Content-Type: application/json

{
  "strength": "Strong",
  "score": 75,
  "has_emoji": true,
  "suggestions": ["Add more characters"]
}
```

#### Get password check history
```
GET /api/password-checks?limit=10&offset=0
```

#### Get a specific password check
```
GET /api/password-checks/:id
```

#### Delete a password check
```
DELETE /api/password-checks/:id
```

#### Get statistics
```
GET /api/password-checks/stats
```

#### Clear all history
```
DELETE /api/password-checks
Headers: X-Confirm-Delete: true
```

## Database Schema

The application automatically creates the following table:

```sql
CREATE TABLE password_checks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  strength VARCHAR(50) NOT NULL,
  score INT NOT NULL,
  has_emoji BOOLEAN DEFAULT FALSE,
  suggestions JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Security Notes

- **Never store actual passwords** - Only strength scores and metadata are stored
- **Use SSL/TLS** - Aiven requires SSL connections by default
- **Protect your credentials** - Never commit `.env` to version control
- **CA Certificate** - Use the Aiven CA certificate for secure connections

## Troubleshooting

### Connection Issues
1. Verify your Aiven service is running (status: "Running")
2. Check your IP is allowed in Aiven's "Allowed IP addresses"
3. Verify credentials in `.env` file
4. Ensure the CA certificate is correctly placed

### SSL Errors
If you get SSL certificate errors:
1. Download the CA certificate from Aiven console
2. Save as `ca.pem` in the backend folder
3. Restart the server

## Support
For Aiven-specific issues, check:
- [Aiven Documentation](https://docs.aiven.io/docs/products/mysql)
- [Aiven Support](https://aiven.io/support)
