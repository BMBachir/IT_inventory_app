// models/SousCategorie.js
const db = require("../config/db");
const { DataTypes } = require("sequelize");

const SousCategorie = db.define(
  "SousCategorie",
  {
    code: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nom: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    categorieId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Categorie",
        key: "code",
      },
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
  }
);

module.exports = SousCategorie;
