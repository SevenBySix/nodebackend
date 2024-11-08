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

// Route to accept Scheduling request
app.post('/api/schedule', async (req, res) => {
	const {name, email, date, time} = req.body;
	
	const sql = 'INSERT INSERT INTO appointments (name, email, date, time) VALUES (?, ?, ?, ?)';
  	const values = [name, email, date, time];'

	db.query(sql, values, (err, result) => {
    	if (err) {
      		console.error('Error inserting data:', err);
      		res.status(500).send('Error scheduling appointment.');
    	} else {
      		res.status(201).send('Appointment scheduled successfully.');
    	}});	
}

// HTTPS options
const options = {
  key: fs.readFileSync('/home/ubuntu/private.key'),    
  cert: fs.readFileSync('/home/ubuntu/certificate.crt') 
};

// Start the server
https.createServer(options, app).listen(port, () => {
  console.log(`Secure server running on port ${port}`);
});
