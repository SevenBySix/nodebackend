const express = require("express");
const router = express.Router();

const scheduleController = require("./scheduleController");
const authMiddleware = require("../auth/authMiddleware");
const { scheduleWithAuth } = require("./scheduleController");
const { getAppointments } = require("./scheduleController");

router.post("/schedule", scheduleController.schedule);
router.post("/schedule/auth", authMiddleware, scheduleWithAuth);
router.get("/appointments", authMiddleware, getAppointments);

module.exports = router;
