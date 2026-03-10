const db = require("../config/db");
const { DataTypes } = require("sequelize");

const SousCategorie = db.define(
  "SousCategorie",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
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
  { indexes: [{ unique: true, fields: ["code"] }] },
  {
    timestamps: true,
    freezeTableName: true,
  },
);

module.exports = SousCategorie;
