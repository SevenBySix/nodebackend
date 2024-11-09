// auth/authMiddleware.js
const { verifyToken } = require("./jwtUtils");

function authMiddleware(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract the token from the "Bearer" scheme

  if (token) {
    try {
      const decoded = verifyToken(token);
      req.user = decoded; //putting decorded user data into req for later use
      next();
    } catch (err) {
      res.status(403).json({ error: "This token is invalid or expired" });
    }
  } else {
    res.status(401).json({ error: "No token provided" });
  }
}

module.exports = authMiddleware;

