const db = require("../config/db");
const Categorie = require("./categorie");
const SousCategorie = require("./sousCategorie");
const Material = require("./material");
const User = require("./user"); // employee
const AuthUser = require("./auth"); // login
const ActionHistory = require("./actionHistory");
const Auth = require("./auth");

// Define Associations

// 1. User ↔ Material
User.hasMany(Material, { foreignKey: "userId" });
Material.belongsTo(User, { foreignKey: "userId" });

// 2. Categorie ↔ SousCategorie
Categorie.hasMany(SousCategorie, {
  foreignKey: "categorieId",
  as: "sousCategories",
});

SousCategorie.belongsTo(Categorie, {
  foreignKey: "categorieId",
  targetKey: "code",
  as: "categorie",
});

// 3. Categorie ↔ Material
Categorie.hasMany(Material, { foreignKey: "categorieId" });
Material.belongsTo(Categorie, { foreignKey: "categorieId" });

// 4. SousCategorie ↔ Material
SousCategorie.hasMany(Material, { foreignKey: "sousCategorieId" });
Material.belongsTo(SousCategorie, {
  foreignKey: "sousCategorieId",
  targetKey: "code",
  as: "SousCategorie",
});
ActionHistory.belongsTo(Auth, { foreignKey: "userId", as: "admin" });
Auth.hasMany(ActionHistory, { foreignKey: "userId", as: "histories" });

const models = {
  db,
  User,
  AuthUser,
  Categorie,
  SousCategorie,
  Material,
  ActionHistory,
};

// Sync database
db.sync({ alter: true })
  .then(() => {
    console.log("✅ Database synced");
  })
  .catch((err) => {
    console.error("❌ Sync error:", err);
  });

module.exports = models;
