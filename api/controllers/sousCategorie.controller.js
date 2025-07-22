const { Categorie } = require("../models");
const SousCategorie = require("../models/sousCategorie");

// Create SousCategorie
exports.createSousCategorie = async (req, res) => {
  try {
    const { nom, categorieId } = req.body;

    if (!nom || !categorieId) {
      return res
        .status(400)
        .json({ message: "nom et categorieId sont requis." });
    }

    // Get the last code
    const lastSousCategorie = await SousCategorie.findOne({
      attributes: ["code"],
      where: { categorieId },
      order: [["code", "DESC"]],
    });

    let nextNumber = 1;

    if (lastSousCategorie && typeof lastSousCategorie.code === "string") {
      const parts = lastSousCategorie.code.split(".");
      const lastNum = parseInt(parts[1]);
      nextNumber = lastNum + 1;
    }

    const newCode = `${categorieId}.${nextNumber}`;

    const sousCategorie = await SousCategorie.create({
      code: newCode,
      nom,
      categorieId,
    });

    res.status(201).json(sousCategorie);
  } catch (error) {
    console.error("Create Error:", error);
    res.status(500).json({ message: "Erreur lors de la création." });
  }
};

// Get All SousCategories
exports.getAllSousCategories = async (req, res) => {
  try {
    const sousCategories = await SousCategorie.findAll({
      include: [{ model: Categorie, as: "categorie" }],
    });
    res.json(sousCategories);
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ message: "Erreur lors de la récupération." });
  }
};

// Get Single SousCategorie by code
exports.getSousCategorie = async (req, res) => {
  try {
    const { id } = req.params; // <-- changed from 'code' to 'id'
    const sousCategorie = await SousCategorie.findOne({
      where: { code: id }, // assuming 'code' is the primary key in DB
      include: [{ model: Categorie, as: "categorie" }],
    });

    if (!sousCategorie) {
      return res.status(404).json({ message: "Sous-catégorie introuvable." });
    }

    res.json(sousCategorie);
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ message: "Erreur lors de la récupération." });
  }
};

// Update SousCategorie
exports.updateSousCategorie = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, categorieId } = req.body;

    // Fetch the sous-catégorie by its code (e.g., 1.1, 2.3)
    const sousCategorie = await SousCategorie.findOne({ where: { code: id } });

    if (!sousCategorie) {
      return res.status(404).json({ message: "Sous-catégorie introuvable." });
    }

    // Check if the provided categorieId is consistent with the sousCategorie code
    const expectedPrefix = `${categorieId}.`;
    if (!String(sousCategorie.code).startsWith(expectedPrefix)) {
      return res.status(400).json({
        message: `Le code ${sousCategorie.code} ne correspond pas à la catégorie ${categorieId}.`,
      });
    }

    // Update the sous-catégorie
    await sousCategorie.update({ nom, categorieId });

    res.status(200).json({
      message: "Sous-catégorie mise à jour avec succès.",
      data: sousCategorie,
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Erreur lors de la mise à jour." });
  }
};

// Delete SousCategorie
exports.deleteSousCategorie = async (req, res) => {
  try {
    const { id } = req.params;

    const sousCategorie = await SousCategorie.findOne({ where: { code: id } });
    if (!sousCategorie) {
      return res.status(404).json({ message: "Sous-catégorie introuvable." });
    }

    await sousCategorie.destroy();
    res.json({ message: "Sous-catégorie supprimée." });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Erreur lors de la suppression." });
  }
};
