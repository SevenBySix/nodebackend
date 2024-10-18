const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Create MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',  // Replace with your MySQL host
  user: 'root',       // Replace with your MySQL username
  password: '',       // Replace with your MySQL password
  database: 'test_db' // Replace with your MySQL database name
}).promise();

// API endpoint for running SQL queries
app.post('/api/query', async (req, res) => {
  const { query } = req.body;

  try {
    const [rows] = await pool.query(query);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).json({ success: false, message: 'Error executing query', error: err.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
