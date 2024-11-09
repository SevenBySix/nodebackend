// index.js

const express = require('express');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const bcrypt = require('bcrypt');

const db = require('./db.js'); //Import the database pool
const authMiddleware = require("./auth/authMiddleware");
const { generateToken } = require("./auth/jwtUtils");

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

//this is about what registration will look like, we need to make models for data objects
app.post('/api/register', async (req, res) => {
	try{
		const {email, password} = req.body;
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = new User({ email, password: hashedPassword });
		await user.save();//this may need to change
		res.status(201).json({ message: 'User registered successfully' });
	}catch (err){
		res.status(500).json({ error: 'Registration failed' });
	}
});

app.post('/api/login', async (req, res) => {
	try{
		const {email, password} = req.body;
		const user = await User.findOne({email});
		
		const passwordMatched = bcrypt.compare(password, user.password);
		if(passwordMatched){
			const token = generateToken({ Email: email });
			res.json({ token });
		}
	}catch (err){
		res.status(500).json({ error: 'Login failed' });
	}
});


// Route to accept Scheduling request
app.post('/api/schedule', async (req, res) => {
	const {petName, email, date, time} = req.body;
	
	// Get Owner id from email
	const sql = 'SELECT ID FROM owner WHERE Email = ?'; 
	const [rows] = await db.execute(sql, [email]);
	const ownerID = rows[0].ID;
//to do, do the same with patient ID, convert data and time into DATETIME mysql variable, then make the right insert statement::
	//get patient ID from email
	const sql = 'SELECT ID from patient WHERE name = ? AND '

	const sql = 'INSERT INSERT INTO appointments (name, email, date, time) VALUES (?, ?, ?, ?)';
  	const values = [petNname, email, date, time];'

	db.query(sql, values, (err, result) => {
    	if (err) {
      		console.error('Error inserting data:', err);
      		res.status(500).send('Error scheduling appointment.');
    	} else {
      		res.status(201).send('Appointment scheduled successfully.');
    	}});	
});

// HTTPS options
const options = {
  key: fs.readFileSync('/home/ubuntu/private.key'),    
  cert: fs.readFileSync('/home/ubuntu/certificate.crt') 
};

// Start the server
https.createServer(options, app).listen(port, () => {
  console.log(`Secure server running on port ${port}`);
});
