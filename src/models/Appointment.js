const { DataTypes } = require("sequelize");
const database = require("../database");
const Patient = require("./Patient");

const Appointment = database.define("Appointment", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  patient_id: { type: DataTypes.INTEGER, allowNull: true, references: { model: Patient, key: "id" } },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  time: { type: DataTypes.TIME, allowNull: false }
}, { timestamps: false });

Patient.hasMany(Appointment, { foreignKey: "patient_id" });
Appointment.belongsTo(Patient, { foreignKey: "patient_id" });

module.exports = Appointment;

