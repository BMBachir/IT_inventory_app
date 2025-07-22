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

    const sousCategorie = await SousCategorie.create({ nom, categorieId });
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
    const { code } = req.params;
    const { nom, categorieId } = req.body;

    const sousCategorie = await SousCategorie.findOne({ where: { code } });
    if (!sousCategorie) {
      return res.status(404).json({ message: "Sous-catégorie introuvable." });
    }

    await sousCategorie.update({ nom, categorieId });
    res.json(sousCategorie);
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Erreur lors de la mise à jour." });
  }
};

// Delete SousCategorie
exports.deleteSousCategorie = async (req, res) => {
  try {
    const { code } = req.params;

    const sousCategorie = await SousCategorie.findOne({ where: { code } });
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
