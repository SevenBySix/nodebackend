// index.js

const express = require('express');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const bcrypt = require('bcrypt');

const db = require('./db.js'); //Import the database pool
const database = require('./database.js');
const User = require("./models/Client");

const authMiddleware = require("./auth/authMiddleware");
const { generateToken } = require("./auth/jwtUtils");
const authRoutes = require("./auth/authRoutes");

const port = 5000;
const app = express();

app.use(cors({
  origin: '*',  // Allows requests from any origin
  methods: ['GET', 'POST'],
}));

app.use(express.json());

// Route to accept SQL queries from the frontend for debug purposes
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

//adding auth routes for authentication
app.use("/clientAuth", authRoutes);

// Route to accept Scheduling request
app.post('/api/schedule', async (req, res) => {
	const {petName, email, date, time} = req.body;

    	if (err) {
      		console.error('Error inserting data:', err);
      		res.status(500).send('Error scheduling appointment.');
    	} else {
      		res.status(201).send('Appointment scheduled successfully.');
    	}	
});

// HTTPS options
const options = {
  key: fs.readFileSync('/home/ubuntu/private.key'),    
  cert: fs.readFileSync('/home/ubuntu/certificate.crt') 
};

// connect to the database server
async function initdb(){
	try {
  		await database.authenticate();
  		console.log('Connection to database has been established successfully.');
	} catch (error) {
  		console.error('Unable to connect to the database:', error);
	}
	try {
    		await database.sync(); //this will force syncing and create tables that dont already exist
    	console.log("Database synchronized.");
  	} catch (error) {
    		console.error("Failed to sync database:", error);
  	}
}
initdb();

https.createServer(options, app).listen(port, () => {
  console.log(`Secure server running on port ${port}`);
});
