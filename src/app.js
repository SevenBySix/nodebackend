// index.js

const express = require('express');
const cors = require('cors');
const db = require('./db.js'); // Import the database pool
const port = 5000;
const app = express();

// Middleware
app.use(cors());
app.use(cors({
  origin: '*',  // Allows requests from any origin
  methods: ['GET', 'POST'],
}));

app.use(express.json());

// Route to accept SQL queries from the frontend
app.post('/api/query', async (req, res) => {
  const { query } = req.body; // Get the SQL query from the request body

  try {
    const result = await db.execute(query);
    res.json(result);  // Return the result to the frontend
  } catch (error) {
    console.error('Database error:', error.message);
    // Respond with a 500 error if the DB is unavailable
    res.status(500).json({ message: 'Database not available' });
  }
});

// Start the server

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
