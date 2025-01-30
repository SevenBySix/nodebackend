const Appointment = require("../models/Appointment");
const Client = require("../models/Client");
const authMiddleware = require("../auth/authMiddleware");

async function scheduleWithAuth(req, res) {
  const { patientName, patientBreed, patientType, clientName, date, time } = req.body;

  // Extract email from the authenticated user's token
  const email = req.user.Email;

  if (!patientName || !patientBreed || !patientType || !clientName || !date || !time) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const client = await Client.findOne({ where: { email } });

    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    const clientId = client.id;

    const existingAppointment = await Appointment.findOne({
      where: { date, time }
    });

    if (existingAppointment) {
      return res.status(409).json({ error: "The requested date and time slot is already booked." });
    }

    const newAppointment = await Appointment.create({
      client_id: clientId,
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


async function schedule(req, res){
	const { email, patientName, patientBreed, patientType,
	clientName, date, time} = req.body;

	if (!email || !patientName || !patientBreed || 
		!patientType || !clientName || !date || !time){        
		return res.status(400).json({ error: "All fields are required." });
    	}
	try{
		const client = await Client.findOne({ where: { email } });

		const clientId = client.id;

		const existingAppointment = await Appointment.findOne({
		where: {date, time}
		});
		if (existingAppointment) {
            	return res.status(409).json({ error: "The requested date and time slot is already booked." });
        	}

		const newAppointment = await Appointment.create({
			client_id: clientId,
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
        const clientEmail = req.user.Email; // Extracted from JWT

        // Find the client by email to get their ID
        const client = await Client.findOne({ where: { email: clientEmail } });
        if (!client) {
            return res.status(404).json({ error: "Client not found" });
        }

        // Fetch all appointments for this client
        const appointments = await Appointment.findAll({
            where: { client_email: clientEmail }
        });

        res.status(200).json({ message: "Appointments retrieved successfully", appointments });
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ error: "Failed to retrieve appointments", details: error.message });
    }
}


module.exports = {schedule, scheduleWithAuth, getAppointments};
