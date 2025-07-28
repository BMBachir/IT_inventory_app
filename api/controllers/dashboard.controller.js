const { Material, User, SousCategorie, Categorie } = require("../models");

const { fn, col } = require("sequelize");

exports.getData = async (req, res) => {
  try {
    // Compter total matériel, utilisateurs et catégories
    const [totalMaterials, totalUsers, totalCategories] = await Promise.all([
      Material.count(),
      User.count(),
      Categorie.count(),
    ]);

    // Récupérer le nombre de matériels groupé par catégorie
    const materialsGroupedByCategorie = await Material.findAll({
      attributes: ["categorieId", [fn("COUNT", col("id")), "count"]],
      group: ["categorieId"],
      raw: true,
    });

    // Récupérer les catégories
    const categories = await Categorie.findAll({
      attributes: ["code", "nom"],
      raw: true,
    });

    // Construire les stats par catégorie
    const categoryMaterialCounts = categories.map((cat) => {
      const found = materialsGroupedByCategorie.find(
        (item) => item.categorieId === cat.code
      );
      return {
        categoryId: cat.code,
        categoryName: cat.nom,
        materialsCount: found ? parseInt(found.count) : 0,
      };
    });

    // Envoyer les résultats
    res.json({
      totalMaterials,
      totalUsers,
      totalCategories,
      categoryMaterialCounts,
    });
  } catch (error) {
    console.error("get error:", error);
    res.status(500).json({ message: "Failed to get data." });
  }
};
