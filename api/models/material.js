const db = require("../config/db");
const { DataTypes } = require("sequelize");

const Material = db.define(
  "material",
  {
    code: {
      type: DataTypes.STRING(200),
    },
    codebar: {
      type: DataTypes.STRING(200),
    },
    nom: {
      type: DataTypes.STRING(200),
    },
    marque: {
      type: DataTypes.STRING(200),
    },
    cpu: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    ram: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    disk: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    Ncpu: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Nram: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Ndisk: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ecran: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "user",
        key: "id",
      },
    },

    categorieId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Categorie",
        key: "code",
      },
    },
  },
  {
    timestampes: false,
    freezeTableName: true,
  }
);

module.exports = Material;
