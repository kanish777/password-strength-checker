const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Aiven MySQL Connection Pool Configuration
const createPool = () => {
  const config = {
    host: process.env.AIVEN_MYSQL_HOST,
    port: parseInt(process.env.AIVEN_MYSQL_PORT) || 3306,
    user: process.env.AIVEN_MYSQL_USER,
    password: process.env.AIVEN_MYSQL_PASSWORD,
    database: process.env.AIVEN_MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
      rejectUnauthorized: process.env.NODE_ENV === 'production'
    }
  };

  // If Aiven CA certificate file path is provided
  const certPath = process.env.AIVEN_MYSQL_CA_CERT || path.join(__dirname, 'ca.pem');
  if (fs.existsSync(certPath)) {
    config.ssl.ca = fs.readFileSync(certPath);
    config.ssl.rejectUnauthorized = true;
  }

  return mysql.createPool(config);
};

let pool;

// Initialize database connection and create tables
const initializeDatabase = async () => {
  try {
    pool = createPool();
    
    // Test connection
    const connection = await pool.getConnection();
    console.log('✅ Connected to Aiven MySQL Database');
    
    // Create tables if they don't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS password_checks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        strength VARCHAR(50) NOT NULL,
        score INT NOT NULL,
        has_emoji BOOLEAN DEFAULT FALSE,
        suggestions JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    console.log('✅ Database tables initialized');
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('⚠️ Server will continue without database. Set Aiven credentials in .env file.');
  }
};

// Routes

// Health check
app.get('/api/health', async (req, res) => {
  try {
    if (pool) {
      await pool.execute('SELECT 1');
      res.json({ status: 'healthy', database: 'connected', timestamp: new Date().toISOString() });
    } else {
      res.json({ status: 'healthy', database: 'disconnected', timestamp: new Date().toISOString() });
    }
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', error: error.message });
  }
});

// Save a password check
app.post('/api/password-checks', async (req, res) => {
  try {
    if (!pool) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    const { strength, score, has_emoji, suggestions } = req.body;

    if (!strength || score === undefined) {
      return res.status(400).json({ error: 'Missing required fields: strength and score' });
    }

    const [result] = await pool.execute(
      `INSERT INTO password_checks (strength, score, has_emoji, suggestions) VALUES (?, ?, ?, ?)`,
      [strength, score, has_emoji || false, JSON.stringify(suggestions || [])]
    );

    res.status(201).json({
      id: result.insertId,
      message: 'Password check saved successfully',
      data: { strength, score, has_emoji, suggestions }
    });
  } catch (error) {
    console.error('Error saving password check:', error);
    res.status(500).json({ error: 'Failed to save password check' });
  }
});

// Get password check history
app.get('/api/password-checks', async (req, res) => {
  try {
    if (!pool) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    const limit = Math.min(Math.max(parseInt(req.query.limit || 10) || 10, 1), 100);
    const offset = Math.max(parseInt(req.query.offset || 0) || 0, 0);

    const [rows] = await pool.execute(
      `SELECT id, strength, score, has_emoji, suggestions, created_at 
       FROM password_checks 
       ORDER BY created_at DESC 
       LIMIT ${limit} OFFSET ${offset}`
    );

    // Parse suggestions JSON
    const formattedRows = rows.map(row => ({
      ...row,
      suggestions: typeof row.suggestions === 'string' ? JSON.parse(row.suggestions) : row.suggestions
    }));

    res.json(formattedRows);
  } catch (error) {
    console.error('Error fetching password checks:', error);
    res.status(500).json({ error: 'Failed to fetch password checks' });
  }
});

// Get a specific password check
app.get('/api/password-checks/:id', async (req, res) => {
  try {
    if (!pool) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    const [rows] = await pool.execute(
      'SELECT * FROM password_checks WHERE id = ?',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Password check not found' });
    }

    const row = rows[0];
    row.suggestions = typeof row.suggestions === 'string' ? JSON.parse(row.suggestions) : row.suggestions;

    res.json(row);
  } catch (error) {
    console.error('Error fetching password check:', error);
    res.status(500).json({ error: 'Failed to fetch password check' });
  }
});

// Delete a password check
app.delete('/api/password-checks/:id', async (req, res) => {
  try {
    if (!pool) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    const [result] = await pool.execute(
      'DELETE FROM password_checks WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Password check not found' });
    }

    res.json({ message: 'Password check deleted successfully' });
  } catch (error) {
    console.error('Error deleting password check:', error);
    res.status(500).json({ error: 'Failed to delete password check' });
  }
});

// Get statistics
app.get('/api/password-checks/stats', async (req, res) => {
  try {
    if (!pool) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    const [totalResult] = await pool.execute(
      'SELECT COUNT(*) as total FROM password_checks'
    );

    const [strengthStats] = await pool.execute(
      `SELECT strength, COUNT(*) as count 
       FROM password_checks 
       GROUP BY strength 
       ORDER BY FIELD(strength, 'Very Strong', 'Strong', 'Medium', 'Weak', 'Very Weak')`
    );

    const [avgScore] = await pool.execute(
      'SELECT AVG(score) as average_score FROM password_checks'
    );

    const [emojiStats] = await pool.execute(
      'SELECT has_emoji, COUNT(*) as count FROM password_checks GROUP BY has_emoji'
    );

    const [recentChecks] = await pool.execute(
      `SELECT DATE(created_at) as date, COUNT(*) as count 
       FROM password_checks 
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
       GROUP BY DATE(created_at)
       ORDER BY date DESC`
    );

    res.json({
      total: totalResult[0].total,
      averageScore: Math.round(avgScore[0].average_score || 0),
      byStrength: strengthStats,
      emojiUsage: emojiStats,
      last7Days: recentChecks
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Clear all history (use with caution)
app.delete('/api/password-checks', async (req, res) => {
  try {
    if (!pool) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    // Require confirmation header
    if (req.headers['x-confirm-delete'] !== 'true') {
      return res.status(400).json({ 
        error: 'Confirmation required',
        message: 'Send X-Confirm-Delete: true header to confirm deletion'
      });
    }

    await pool.execute('DELETE FROM password_checks');
    res.json({ message: 'All password checks deleted successfully' });
  } catch (error) {
    console.error('Error clearing history:', error);
    res.status(500).json({ error: 'Failed to clear history' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
const startServer = async () => {
  await initializeDatabase();
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
  });
};

startServer();
