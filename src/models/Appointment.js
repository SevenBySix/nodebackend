const { DataTypes, Model } = require("sequelize");
const sequelize = require("../database");
const Client = require("./Client");

class Appointment extends Model{}

Appointment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    client_id: {
      type: DataTypes.INTEGER,
      references: {
	      model: Client,
	      key: 'id',
      }
    },
    client_email: {
      type: DataTypes.STRING,
      references: {
              model: Client,
              key: 'email',
      }
    },
    patientName: {
      type: DataTypes.STRING
    },
    patientBreed: {
      type: DataTypes.STRING
    },
    patientType: {
      type: DataTypes.STRING
    },
    clientName: {
      type: DataTypes.STRING
    },
    date: {
      type: DataTypes.DATE
    },
    time: {
      type: DataTypes.TIME
    }
    
  },
  {
    sequelize, // Passing the Sequelize instance
    modelName: "Appointment", // Model name
    tableName: "appointments", // Table name; optional
    timestamps: true
  }
);

module.exports = Appointment;
