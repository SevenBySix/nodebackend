// index.js

const express = require('express');
const cors = require('cors');
const db = require('./db.js'); // Import the database pool
const port = 5000;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Route to accept SQL queries from the frontend
app.post('/api/query', async (req, res) => {
  const { query } = req.body; // Get the SQL query from the request body

  try {
    const [rows] = await db.query(query); // Run the query
    res.json({ success: true, data: rows }); // Return the result
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).json({ success: false, message: 'Error executing query', error: err.message });
  }
});

// Start the server

app.listen(port, () => {
  console.log(`Server running on port ${PORT}`);
});
