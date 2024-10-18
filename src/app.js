// index.js

const express = require('express');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const db = require('./db.js'); // Import the database pool
const port = 5000;
const app = express();

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

// HTTPS options
const options = {
  key: fs.readFileSync('~/private.key'),    
  cert: fs.readFileSync('~/certificate.crt') 
};

// Start the server
https.createServer(options, app).listen(port, () => {
  console.log(`Secure server running on port ${port}`);
});
