const Client = require("../models/Client");
const { generateToken } = require("./jwtUtils");
const bcrypt = require('bcrypt');

// Registration function for clients
async function register(req, res) {
  const { email, password } = req.body;
  try {
    const existingUser = await Client.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await Client.create({ email, password: hashedPassword });
	 
    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ error: "Failed to register user", details: error.message });
  }
}

// Login function for clients
async function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await Client.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const passwordMatched = await bcrypt.compare(password, user.password);
    if (!passwordMatched) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = generateToken({ Email: email });
    res.status(201).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: "Failed to log in", details: error.message });
  }
}

module.exports = { register, login };
