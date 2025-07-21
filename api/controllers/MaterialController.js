const Material = require("../models/material");

exports.getMaterialsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const materials = await Material.findAll({
      where: { UserId: userId },
      include: ["Categorie"],
    });
    res.status(200).json(materials);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
