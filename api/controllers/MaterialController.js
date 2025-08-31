const { Material, User, SousCategorie, Categorie } = require("../models");
const ActionHistory = require("../models/actionHistory");

exports.createMaterial = async (req, res) => {
  try {
    const { userId, sousCategorieId, ...rest } = req.body;
    console.log(sousCategorieId);
    // Fetch user and sousCategorie
    const user = await User.findByPk(userId);
    const sousCategorie = await SousCategorie.findOne({
      where: { code: sousCategorieId },
    });

    if (!user || !sousCategorie) {
      return res
        .status(404)
        .json({ message: "User or SousCategorie not found." });
    }

    console.log("the sous cqtegorie code ", sousCategorieId);
    console.log("the sous cqtegorie result ", sousCategorie);

    const materialCount = await Material.count({
      where: {
        sousCategorieId,
      },
    });

    console.log("nbr of material with  sous categories ", materialCount);

    const counter = String(materialCount + 1).padStart(4, "0");
    console.log("counter is ", counter);
    const codebar = `B${user.bloc}-${user.service}-${sousCategorie.code}-${counter}`;

    const newMaterial = await Material.create({
      ...rest,
      userId,
      sousCategorieId,
      codebar,
    });

    await ActionHistory.create({
      entityType: "Material",
      entityId: newMaterial.id,
      userId: req.user.id,
      actionType: "created",
      fieldName: null,
      oldValue: null,
      newValue: null,
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
          attributes: ["code", "nom"],
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
    const { userId, sousCategorieId, ...rest } = req.body;

    const material = await Material.findByPk(req.params.id);
    if (!material)
      return res.status(404).json({ message: "Material not found" });
    const oldValues = material.toJSON();
    let user = null;
    if (userId) {
      user = await User.findByPk(userId);
      if (!user) return res.status(400).json({ message: "User not found" });
    }

    let sousCategorie = null;
    if (sousCategorieId) {
      sousCategorie = await SousCategorie.findOne({
        where: { code: sousCategorieId },
      });
      if (!sousCategorie)
        return res.status(400).json({ message: "Sous-catégorie not found" });
    }

    // Get original counter from existing codebar
    let codebar = material.codebar;
    if (user && sousCategorie && material.codebar) {
      const parts = material.codebar.split("-");
      const counter = parts[3];

      codebar = `B${user.bloc}-${user.service}-${sousCategorie.code}-${counter}`;
    }

    await material.update({ userId, sousCategorieId, codebar, ...rest });

    const newValues = material.toJSON();

    for (const key of Object.keys(newValues)) {
      if (oldValues[key] !== newValues[key]) {
        await ActionHistory.create({
          entityType: "Material",
          entityId: material.id,
          userId: req.user.id,
          actionType: "updated",
          fieldName: key,
          oldValue:
            oldValues[key] !== undefined ? String(oldValues[key]) : null,
          newValue:
            newValues[key] !== undefined ? String(newValues[key]) : null,
        });
      }
    }

    const updatedMaterial = await Material.findByPk(material.id, {
      include: [
        {
          model: User,
          attributes: ["id", "fullname", "email", "service", "bloc"],
        },
        {
          model: SousCategorie,
          as: "SousCategorie",
          attributes: ["code", "nom"],
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

    res.status(200).json(updatedMaterial);
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

    await ActionHistory.create({
      entityType: "Material",
      entityId: Material.id,
      userId: req.user.id,
      actionType: "deleted",
      fieldName: null,
      oldValue: null,
      newValue: null,
    });
    res.status(200).json({ message: "Material deleted successfully." });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Failed to delete material." });
  }
};

exports.getAllMaterials = async (req, res) => {
  try {
    const materials = await Material.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "fullname", "email", "service", "bloc"],
        },
        {
          model: SousCategorie,
          as: "SousCategorie",
          attributes: ["code", "nom"],
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
