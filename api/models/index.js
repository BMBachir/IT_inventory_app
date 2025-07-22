const db = require("../config/db");
const Categorie = require("./categorie");
const SousCategorie = require("./sousCategorie");
const Material = require("./material");
const User = require("./user"); // employee
const AuthUser = require("./auth"); // login

// Relations
User.hasMany(Material, { foreignKey: "userId" });
Material.belongsTo(User, { foreignKey: "userId" });

Categorie.hasMany(SousCategorie, {
  foreignKey: "categorieId",
  as: "sousCategories",
});
SousCategorie.belongsTo(Categorie, {
  foreignKey: "categorieId",
  as: "categorie",
});

Categorie.hasMany(Material, { foreignKey: "categorieId" });
Material.belongsTo(Categorie, { foreignKey: "categorieId" });

SousCategorie.hasMany(Material, { foreignKey: "sousCategorieId" });
Material.belongsTo(SousCategorie, {
  foreignKey: "sousCategorieId",
  as: "SousCategorie",
});

const models = {
  db,
  User,
  AuthUser,
  Categorie,
  SousCategorie,
  Material,
};

db.sync({ alter: true })
  .then(() => {
    console.log("✅ Database synced");
  })
  .catch((err) => {
    console.error("❌ Sync error:", err);
  });

module.exports = models;
