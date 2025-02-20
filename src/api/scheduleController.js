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
    let patient = await Patient.findOne({ 
      where: { 
        client_id: client.id, 
        patientName: patientName 
      } 
    });

    if (!patient) {
      // Create the patient if it doesn't exist
      patient = await Patient.create({
        client_id: client.id,
        patientName,
        patientBreed,
        patientType,
        notes: "", // Default empty notes
        medications: "", // Default empty medications
        diagnoses: "" // Default empty diagnoses
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
      patient_id: patient.id,
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

        // Find all appointments for the client, including all related data
        const appointments = await Appointment.findAll({
            include: [
                {
                    model: Patient,
                    required: true,
                    include: [
                        {
                            model: Client,
                            required: true,
                            where: { email: email },
                            attributes: ['id', 'name', 'email'] // Excluding password
                        }
                    ],
                    attributes: [
                        'id',
                        'patientName',
                        'patientBreed',
                        'patientType',
                        'medications',
                        'diagnoses',
                        'notes'
                    ]
                }
            ],
            attributes: [
                'id',
                'date',
                'time',
                'patient_id'
            ]
        });

        if (!appointments.length) {
            return res.status(404).json({ 
                message: "No appointments found for this client" 
            });
        }

        res.status(200).json({ 
            message: "Appointments retrieved successfully",
            appointments 
        });
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ 
            error: "Failed to retrieve appointments", 
            details: error.message 
        });
    }
}

module.exports = {schedule, getAppointments};
