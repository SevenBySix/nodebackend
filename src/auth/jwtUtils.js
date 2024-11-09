// auth/jwtUtils.js
const jwt = require("jsonwebtoken");
const SECRET_KEY = "key"; //at some point this should be come an environmental variable

//Generate JWT token
function generateToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
}

//Verify JWT token
function verifyToken(token) {
  return jwt.verify(token, SECRET_KEY);
}

module.exports = { generateToken, verifyToken };

