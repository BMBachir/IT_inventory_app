// models/Material.js
const db = require("../config/db");
const { DataTypes } = require("sequelize");

const Material = db.define(
  "material",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    codebar: {
      type: DataTypes.STRING(200),
    },
    marque: {
      type: DataTypes.STRING(200),
    },

    cpu: { type: DataTypes.STRING(200), allowNull: true },
    ram: { type: DataTypes.STRING(200), allowNull: true },
    disk: { type: DataTypes.STRING(200), allowNull: true },
    Ncpu: { type: DataTypes.INTEGER, allowNull: true },
    Nram: { type: DataTypes.INTEGER, allowNull: true },
    Ndisk: { type: DataTypes.INTEGER, allowNull: true },
    ecran: { type: DataTypes.STRING(200), allowNull: true },
    adf: { type: DataTypes.INTEGER, allowNull: true },
    clavier: { type: DataTypes.INTEGER, allowNull: true },
    souris: { type: DataTypes.INTEGER, allowNull: true },
    usb: { type: DataTypes.INTEGER, allowNull: true },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "user",
        key: "id",
      },
    },

    sousCategorieId: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: "SousCategorie",
        key: "code",
      },
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
  }
);

module.exports = Material;
