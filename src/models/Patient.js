const { DataTypes } = require("sequelize");
const database = require("../database");
const Client = require("./Client");

const Patient = database.define("Patient", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  client_id: { type: DataTypes.INTEGER, allowNull: true, references: { model: Client, key: "id" } },
  patientName: { type: DataTypes.STRING, allowNull: true },
  patientBreed: { type: DataTypes.STRING, allowNull: true },
  patientType: { type: DataTypes.STRING, allowNull: true },
  medications: { type: DataTypes.TEXT },
  diagnoses: { type: DataTypes.TEXT },
  notes: { type: DataTypes.TEXT }
}, { timestamps: false });

Client.hasMany(Patient, { foreignKey: "client_id" });
Patient.belongsTo(Client, { foreignKey: "client_id" });

module.exports = Patient;

