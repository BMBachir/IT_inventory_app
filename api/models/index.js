const db = require("../config/db");
const Material = require("./material");
const Categorie = require("./categorie");
const User = require("./user");

User.hasMany(Material, { foreignKey: "userId" });
Material.belongsTo(User, { foreignKey: "userId" });

Categorie.hasMany(Material, { foreignKey: "categorieId" });
Material.belongsTo(Categorie, { foreignKey: "categorieId" });

const models = {
  User,
  Categorie,
  Material,
};

db.sync()
  .then(() => {
    console.log("✅ Tables and relations created successfully");
  })
  .catch((err) => {
    console.error("❌ Unable to create tables:", err);
  });

module.exports = { db, ...models };
