const db = require("../config/db");
const Material = require("./material");
const Categorie = require("./categorie");
const User = require("./user");
const SousCategorie = require("./sousCategorie");

// User ↔ Material
User.hasMany(Material, { foreignKey: "userId" });
Material.belongsTo(User, { foreignKey: "userId" });

// Categorie ↔ Material
Categorie.hasMany(Material, { foreignKey: "categorieId" });
Material.belongsTo(Categorie, { foreignKey: "categorieId" });

// Categorie ↔ SousCategorie
Categorie.hasMany(SousCategorie, {
  foreignKey: "categorieId",
  as: "sousCategories",
});
SousCategorie.belongsTo(Categorie, {
  foreignKey: "categorieId",
  as: "categorie",
});

// SousCategorie ↔ Material (missing relation before)
SousCategorie.hasMany(Material, { foreignKey: "sousCategorieId" });
Material.belongsTo(SousCategorie, { foreignKey: "sousCategorieId" });

const models = {
  db,
  User,
  Categorie,
  Material,
  SousCategorie,
};

db.sync({ force: true })
  .then(() => {
    console.log("✅ Tables and relations recreated successfully");
  })
  .catch((err) => {
    console.error("❌ Unable to recreate tables:", err);
  });

module.exports = models;
