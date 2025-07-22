const { Material, User, SousCategorie, Categorie } = require("../models");

exports.createMaterial = async (req, res) => {
  try {
    const newMaterial = await Material.create(req.body);

    const fullMaterial = await Material.findByPk(newMaterial.id, {
      include: [
        {
          model: User,
          attributes: ["id", "fullname", "email", "service", "bloc"],
        },
        {
          model: SousCategorie,
          as: "SousCategorie", // <-- must match exactly with model alias
          include: [
            {
              model: Categorie,
              as: "categorie",
              attributes: ["code", "nom"],
            },
          ],
        },
      ],
    });

    res.status(201).json(fullMaterial);
  } catch (error) {
    console.error("Create error:", error);
    res.status(500).json({ message: "Failed to create material." });
  }
};

// 🔹 Update Material
exports.updateMaterial = async (req, res) => {
  try {
    const { userId, sousCategorieId } = req.body;

    const material = await Material.findByPk(req.params.id);
    if (!material)
      return res.status(404).json({ message: "Material not found" });

    // Optional: check if user exists
    if (userId) {
      const userExists = await User.findByPk(userId);
      if (!userExists)
        return res.status(400).json({ message: "User not found" });
    }

    // Optional: check if sous-categorie exists
    if (sousCategorieId) {
      const scExists = await SousCategorie.findOne({
        where: { code: sousCategorieId },
      });
      if (!scExists)
        return res.status(400).json({ message: "Sous-catégorie not found" });
    }

    await material.update(req.body);
    res.status(200).json(material);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Failed to update material." });
  }
};

// 🔹 Delete Material
exports.deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findByPk(req.params.id);
    if (!material)
      return res.status(404).json({ message: "Material not found" });

    await material.destroy();
    res.status(200).json({ message: "Material deleted successfully." });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Failed to delete material." });
  }
};

exports.getAllMaterials = async (req, res) => {
  try {
    const materials = await Material.findAll();
    res.status(200).json(materials);
  } catch (error) {
    console.error("Error fetching materials:", error);
    res.status(500).json({ message: "Failed to retrieve materials" });
  }
};

// 🔹 Get Material by Code
exports.getMaterialByCode = async (req, res) => {
  try {
    const { code } = req.params;

    const material = await Material.findOne({
      where: { codebar: code },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "email"],
        },
        {
          model: SousCategorie,
          as: "sousCategorie",
          attributes: ["code", "name", "categorieId"],
          include: [
            {
              model: Categorie,
              as: "categorie",
              attributes: ["code", "name"],
            },
          ],
        },
      ],
    });

    if (!material)
      return res.status(404).json({ message: "Material not found" });

    res.status(200).json(material);
  } catch (error) {
    console.error("Fetch by code error:", error);
    res.status(500).json({ message: "Failed to fetch material." });
  }
};
