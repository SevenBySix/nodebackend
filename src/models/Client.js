const { DataTypes, Model } = require("sequelize");
const sequelize = require("../database");

class Client extends Model {}

Client.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize, // Passing the Sequelize instance
    modelName: "Client", // Model name
    tableName: "clients", // Optional, specify the table name
    timestamps: true
  }
);

module.exports = Client;
