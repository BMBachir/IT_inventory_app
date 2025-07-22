const db = require("../config/db");
const { DataTypes } = require("sequelize");

const SousCategorie = db.define(
  "SousCategorie",
  {
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true, // ✅ Make 'code' the primary key
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
        key: "code", // ✅ Correct foreign key
      },
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
    // ✅ Tell Sequelize NOT to create or expect 'id'
    id: false,
  }
);

module.exports = SousCategorie;
