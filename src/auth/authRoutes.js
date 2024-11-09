const express = require("express");
const router = express.Router();
const clientAuthController = require("./clientAuthController");

// Route for registration
router.post("/register", clientAuthController.register);

// Route for login
router.post("/login", clientAuthController.login);

module.exports = router;
