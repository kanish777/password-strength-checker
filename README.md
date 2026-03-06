# 🔐 Password Strength Checker

A full-stack application for checking password strength with advanced features including emoji support, personal information detection, and real-time analysis.

## 📁 Project Structure

```
├── frontend/           # React frontend source files
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API service
│   │   ├── utils/          # Utility functions
│   │   └── App.jsx         # Main app component
│   └── README.md
│
├── backend/            # Node.js/Express backend
│   ├── server.js           # Express server with Aiven MySQL
│   ├── package.json        # Backend dependencies
│   ├── .env.example        # Environment template
│   └── README.md
│
├── src/               # Vite project source (built version)
│   └── App.tsx            # Combined frontend code
│
└── README.md          # This file
```

## ✨ Features

### Password Analysis
- **Real-time strength meter** - Visual progress bar updates as you type
- **Comprehensive scoring** - 0-100 score based on multiple criteria
- **5 strength levels** - Very Weak, Weak, Medium, Strong, Very Strong

### Security Criteria Checks
- ✓ Minimum length (8+ characters)
- ✓ Uppercase letters (A-Z)
- ✓ Lowercase letters (a-z)
- ✓ Numbers (0-9)
- ✓ Special symbols (!@#$%^&*)
- ✓ Emoji characters (bonus)
- ✓ No common patterns
- ✓ No sequential characters

### 😀 Emoji Password Feature
Emojis significantly increase password complexity:
- Expands character set from ~95 to thousands
- Makes brute-force attacks exponentially harder
- Visual indicator shows detected emojis
- Security bonus calculation

### 👤 Smart Personal Info Detector
Prevents using easily-guessable information:
- Detects your name in passwords
- Finds birth year patterns
- Identifies email username usage
- Alerts with specific warnings

### ⚡ Password Generator
Create strong passwords instantly:
- Configurable length (8-32 chars)
- Toggle character types
- Include emojis option
- Copy to clipboard

### 🚫 Anti-Paste Protection
- Clipboard pasting is blocked
- Encourages typing passwords manually
- Increases security awareness

## 🚀 Quick Start

### Frontend Only (Vite Build)
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Backend (with Aiven MySQL)

1. **Set up Aiven MySQL:**
   - Create account at https://console.aiven.io
   - Create MySQL service
   - Get connection credentials

2. **Configure backend:**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your Aiven credentials
   ```

3. **Run backend:**
   ```bash
   npm start
   # Or for development with auto-reload:
   npm run dev
   ```

## 🔧 Environment Configuration

### Backend (.env)
```env
AIVEN_MYSQL_HOST=your-mysql-host.aivencloud.com
AIVEN_MYSQL_PORT=3306
AIVEN_MYSQL_USER=avnadmin
AIVEN_MYSQL_PASSWORD=your-password
AIVEN_MYSQL_DATABASE=defaultdb
PORT=3001
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | Health check |
| POST | /api/password-checks | Save password check |
| GET | /api/password-checks | Get history |
| GET | /api/password-checks/:id | Get specific check |
| DELETE | /api/password-checks/:id | Delete check |
| GET | /api/password-checks/stats | Get statistics |

## 🗄️ Database Schema

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

## 🔒 Security Notes

- **Passwords are NEVER stored** - Only strength scores and metadata
- **Local analysis** - Password checking happens in the browser
- **SSL/TLS required** - Aiven enforces secure connections
- **No transmission of actual passwords** to the server

## 🛠️ Technologies

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Vite

### Backend
- Node.js
- Express.js
- mysql2 (with connection pooling)
- dotenv

### Database
- Aiven MySQL Cloud

## 📝 License

MIT License
