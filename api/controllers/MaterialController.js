const { Material, User, SousCategorie, Categorie } = require("../models");
const ActionHistory = require("../models/actionHistory");
const { Op } = require("sequelize");
exports.createMaterial = async (req, res) => {
  try {
    const { userId, sousCategorieId, ...rest } = req.body;

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

    // Get all codebars for this sousCategorieId
    const materials = await Material.findAll({
      where: { sousCategorieId },
      attributes: ["codebar"],
    });

    // Extract the numeric parts (last 4 digits)
    const numbers = materials
      .map((m) => {
        const match = m.codebar.match(/(\d{4})$/);
        return match ? parseInt(match[1], 10) : null;
      })
      .filter((n) => n !== null)
      .sort((a, b) => a - b);

    let nextNumber = 1;
    for (let i = 0; i < numbers.length; i++) {
      if (numbers[i] !== i + 1) {
        nextNumber = i + 1;
        break;
      }
    }
    if (nextNumber === 1 && numbers.length > 0) {
      nextNumber = numbers[numbers.length - 1] + 1;
    }

    const counter = String(nextNumber).padStart(4, "0");
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
    //console.error("Create error:", error);
    res.status(500).json({ message: "Failed to create material." });
  }
};

exports.updateMaterial = async (req, res) => {
  try {
    const { userId, sousCategorieId, ...rest } = req.body;

    const material = await Material.findByPk(req.params.id);

    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    const oldValues = material.toJSON();

    let user = null;
    if (userId) {
      user = await User.findByPk(userId);

      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
    }

    let sousCategorie = null;
    if (sousCategorieId) {
      sousCategorie = await SousCategorie.findOne({
        where: { code: sousCategorieId },
      });
      if (!sousCategorie) {
        return res.status(400).json({ message: "Sous-catégorie not found" });
      }
    }

    let codebar = material.codebar;
    const isSousCategorieChanged =
      sousCategorieId && sousCategorieId !== material.sousCategorieId;

    if (user && sousCategorie && isSousCategorieChanged) {
      const prefix = `${sousCategorie.code}-`;

      const bar = `${user.bloc}-${user.service}-${sousCategorie.code}-`;

      // Find all existing codebars in the new sousCategorie
      const allMaterialsInNewCategory = await Material.findAll({
        where: {
          codebar: {
            [Op.like]: `%${prefix}%`,
          },
        },
        attributes: ["codebar"],
      });

      const existingSequentials = [
        ...new Set(
          allMaterialsInNewCategory
            .map((m) => {
              const match = m.codebar?.match(/(\d{4})$/);
              return match ? parseInt(match[1], 10) : null;
            })
            .filter((n) => n !== null)
        ),
      ].sort((a, b) => a - b);

      let newSequential = 1;

      if (existingSequentials.length > 0) {
        newSequential = null;

        for (let i = 1; i < existingSequentials.length; i++) {
          if (existingSequentials[i] !== existingSequentials[i - 1] + 1) {
            newSequential = existingSequentials[i - 1] + 1;

            break;
          }
        }

        // If no gaps → biggest + 1
        if (!newSequential) {
          newSequential =
            existingSequentials[existingSequentials.length - 1] + 1;
        }
      }

      codebar = `B${bar}${String(newSequential).padStart(4, "0")}`;
    } else if (user && !isSousCategorieChanged) {
      const match = material.codebar.match(/(\d{4})$/);
      const seq = match ? match[1] : "0001";

      const sousCode = sousCategorie?.code || material.sousCategorie.code;

      codebar = `B${user.bloc}-${user.service}-${sousCode}-${seq}`;
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
    //console.error("Update error:", error);
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
    //console.error("Delete error:", error);
    res.status(500).json({ message: "Failed to delete material." });
  }
};

exports.getAllMaterials = async (req, res) => {
  try {
    const materials = await Material.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "fullname", "email", "service", "bloc", "tel"],
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
    //console.error("Error fetching materials:", error);
    res.status(500).json({ message: "Failed to retrieve materials" });
  }
};
exports.getMaterialsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const materials = await Material.findAll({
      where: { userId },
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
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(materials);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve materials" });
  }
};

// 🔹 Get Material by Code
exports.getMaterialByCode = async (req, res) => {
  try {
    const codebar = req.params.codebar;

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
    //console.error("Fetch by code error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
