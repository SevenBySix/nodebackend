const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const Client = require("../models/Client");
const authMiddleware = require("../auth/authMiddleware");

async function schedule(req, res) {
  const { email, patientName, patientBreed, patientType, clientName, date, time } = req.body;

  if (!email || !patientName || !patientBreed || !patientType || !clientName || !date || !time) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const client = await Client.findOne({ where: { email } });

    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    // Check if the patient exists, if not, create the patient
    let patient = await Patient.findOne({ where: { client_id: client.id, name: patientName } });

    if (!patient) {
      // Create the patient if it doesn't exist
      patient = await Patient.create({
        client_id: client.id,
        name: patientName,
        breed: patientBreed,
        type: patientType,
        notes: "", // You can add additional default values as needed
      });
    }

    // Check if the appointment time slot is already booked
    const existingAppointment = await Appointment.findOne({
      where: { date, time }
    });

    if (existingAppointment) {
      return res.status(409).json({ error: "The requested date and time slot is already booked." });
    }

    // Create the appointment
    const newAppointment = await Appointment.create({
      client_id: client.id,
      patient_id: patient.id,  // Now referencing the newly created or found patient
      client_email: email,
      patientName,
      patientBreed,
      patientType,
      clientName,
      date,
      time
    });

    res.status(201).json({ message: "Appointment scheduled successfully", appointment: newAppointment });
  } catch (error) {
    console.error("Error scheduling appointment:", error);
    res.status(500).json({ error: "Failed to schedule appointment", details: error.message });
  }
}

async function getAppointments(req, res) {
    try {
        // Extract email from the JWT token
        const email = req.user.Email;  

        // Find the client based on the JWT token's email
        const client = await Client.findOne({ where: { email } });

        if (!client) {
            return res.status(404).json({ error: "Client not found" });
        }

        // Find all patients that belong to the client
        const patients = await Patient.findAll({ where: { client_id: client.id } });

        if (!patients.length) {
            return res.status(404).json({ error: "No patients found for this client" });
        }

        // Extract patient IDs
        const patientIds = patients.map(patient => patient.id);

        // Find all appointments linked to these patients
        const appointments = await Appointment.findAll({ where: { patient_id: patientIds } });

        res.status(200).json({ appointments });
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ error: "Failed to retrieve appointments", details: error.message });
    }
}

module.exports = {schedule, getAppointments};
