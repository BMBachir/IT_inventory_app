const Categorie = require("../models/categorie");

exports.createCategorie = async (req, res) => {
  try {
    const categorie = await Categorie.create(req.body);
    res.status(201).json(categorie);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Categorie.findAll();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCategorie = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Categorie.update(req.body, { where: { id } });
    res.status(200).json({ message: "Updated successfully", updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteCategorie = async (req, res) => {
  try {
    const { id } = req.params;
    await Categorie.destroy({ where: { id } });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
