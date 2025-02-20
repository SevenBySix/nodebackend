const express = require("express");
const router = express.Router();

const authMiddleware = require("../auth/authMiddleware");
const { schedule } = require("./scheduleController");
const { getAppointments } = require("./scheduleController");

router.post("/schedule", authMiddleware, schedule);
router.get("/appointments", authMiddleware, getAppointments);

module.exports = router;
