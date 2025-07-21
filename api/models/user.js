const db = require("../config/db");
const { DataTypes } = require("sequelize");

const User = db.define(
  "user",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    fullname: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    service: {
      type: DataTypes.ENUM(
        "PROD",
        "SUPPLY",
        "IT",
        "MG",
        "HR",
        "TECH",
        "COMM",
        "MRK",
        "DFC",
        "HSE",
        "SECRT",
        "QUALITE",
        "CERTILAB"
      ),
    },
    bloc: {
      type: DataTypes.ENUM(
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "H1",
        "H2",
        "H3",
        "H4"
      ),
    },
    email: {
      type: DataTypes.STRING(200),
      validate: {
        isEmail: true,
      },
    },
    username: {
      type: DataTypes.STRING(255),
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
    },
    tel: {
      type: DataTypes.STRING(10),
      validate: {
        isNumeric: true,
        len: [10, 10],
      },
    },
  },
  {
    timestampes: false,
    freezeTableName: true,
  }
);

module.exports = User;
