const { Material, User, SousCategorie, Categorie } = require("../models");

exports.createMaterial = async (req, res) => {
  try {
    const { userId, sousCategorieId, ...rest } = req.body;

    // Fetch user and sousCategorie
    const user = await User.findByPk(userId);
    const sousCategorie = await SousCategorie.findByPk(sousCategorieId);

    if (!user || !sousCategorie) {
      return res
        .status(404)
        .json({ message: "User or SousCategorie not found." });
    }

    // Generate counter: count how many materials exist with same bloc, service, and sousCategorie
    const materialCount = await Material.count({
      where: {
        userId,
        sousCategorieId,
      },
    });

    const counter = String(materialCount + 1).padStart(2, "0"); // e.g., 01, 02, etc.

    const codebar = `${user.bloc}-${user.service}-${sousCategorie.code}-${counter}`;

    // Create material with generated codebar
    const newMaterial = await Material.create({
      ...rest,
      userId,
      sousCategorieId,
      codebar,
    });

    const fullMaterial = await Material.findByPk(newMaterial.id, {
      include: [
        {
          model: User,
          attributes: ["id", "fullname", "email", "service", "bloc"],
        },
        {
          model: SousCategorie,
          as: "SousCategorie",
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
    const codebar = req.params.codebar;
    console.log(codebar);
    const material = await Material.findOne({
      where: { codebar },
      include: [
        {
          model: SousCategorie,
          as: "SousCategorie",
          include: [
            {
              model: Categorie,
              as: "categorie",
            },
          ],
        },
        {
          model: User,
          as: "user",
        },
      ],
    });

    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    res.json(material);
  } catch (error) {
    console.error("Fetch by code error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
