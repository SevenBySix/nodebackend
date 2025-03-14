const express = require("express");
const router = express.Router();

const authMiddleware = require("../auth/authMiddleware");
const { schedule } = require("./scheduleController");
const { getAppointments } = require("./scheduleController");
const { generatePatientPdf } = require("./pdfController");

router.post("/schedule", authMiddleware, schedule);
router.get("/appointments", authMiddleware, getAppointments);
router.get("/patient-pdf", authMiddleware, generatePatientPdf);

module.exports = router;
