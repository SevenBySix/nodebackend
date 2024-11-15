const Appointment = require("../models/Appointment");
const Client = require("../models/Client");

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
			clientId,
			email,
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

module.exports = {schedule};
