const express = require("express");
const router = express.Router();

const scheduleController = require("./scheduleController");

router.post("/schedule", scheduleController.schedule);

module.exports = router;
