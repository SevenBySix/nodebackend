const fs = require('fs');
const PDFDocument = require('pdfkit');
const Patient = require("../models/Patient");
const Client = require("../models/Client");
const Appointment = require("../models/Appointment");

/**
 * Generates a PDF with all patient information and appointments
 * Uses JSON body for patient name and JWT token for authentication
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function generatePatientPdf(req, res) {
  try {
    const { patientName } = req.body;
    const userEmail = req.user.Email;
    
    if (!patientName) {
      return res.status(400).json({ error: "Patient name is required" });
    }

    // Find the client from the email in the token
    const client = await Client.findOne({ where: { email: userEmail } });
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    // Get the patient with all associated data
    const patient = await Patient.findOne({
      where: { 
        patientName: patientName,
        client_id: client.id 
      },
      include: [
        {
          model: Appointment,
          required: false
        }
      ]
    });

    if (!patient) {
      return res.status(404).json({ 
        error: "Patient not found or you don't have access to this patient's records" 
      });
    }

    // Create a new PDF document
    const doc = new PDFDocument();
    
    // Set the response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${patientName.replace(/\s+/g, '_')}_records.pdf`);
    
    // Pipe the PDF document to the response
    doc.pipe(res);

    // Add content to the PDF
    doc.fontSize(25).text('Patient Medical Record', { align: 'center' });
    doc.moveDown();
    
    // Patient basic information
    doc.fontSize(16).text('Patient Information');
    doc.fontSize(12).text(`Name: ${patient.patientName}`);
    doc.text(`Type: ${patient.patientType}`);
    doc.text(`Breed: ${patient.patientBreed}`);
    doc.moveDown();
    
    // Medical information
    doc.fontSize(16).text('Medical Information');
    doc.fontSize(12).text(`Medications: ${patient.medications || 'None'}`);
    doc.text(`Diagnoses: ${patient.diagnoses || 'None'}`);
    doc.text(`Notes: ${patient.notes || 'None'}`);
    doc.moveDown();
    
    // Owner information
    doc.fontSize(16).text('Owner Information');
    doc.fontSize(12).text(`Name: ${client.name || 'Not provided'}`);
    doc.text(`Email: ${client.email}`);
    doc.moveDown();
    
    // Appointment history
    doc.fontSize(16).text('Appointment History');
    
    if (patient.Appointments && patient.Appointments.length > 0) {
      patient.Appointments.forEach(appointment => {
        // Format the date and time for readability
        const appointmentDate = new Date(appointment.date);
        const formattedDate = appointmentDate.toLocaleDateString();
        
        doc.fontSize(12).text(`Date: ${formattedDate}, Time: ${appointment.time}`);
      });
    } else {
      doc.fontSize(12).text('No appointment history found.');
    }
    
    // Add a footer with timestamp
    const currentDate = new Date().toLocaleString();
    doc.fontSize(10).text(`Generated on: ${currentDate}`, {
      align: 'center',
      bottom: 30
    });
    
    // Finalize the PDF and end the stream
    doc.end();
    
  } catch (error) {
    console.error("Error generating patient PDF:", error);
    res.status(500).json({ 
      error: "Failed to generate patient PDF", 
      details: error.message 
    });
  }
}

module.exports = { generatePatientPdf };
