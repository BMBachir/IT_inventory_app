const Material = require("../models/material");
const Categorie = require("../models/categorie");
const User = require("../models/user");
const { Op } = require("sequelize");
exports.getMaterialsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const materials = await Material.findAll({
      where: { UserId: userId },
      include: [
        {
          model: Categorie,
          attributes: ["code", "nom"],
        },
        {
          model: User,
          attributes: ["fullname", "service"],
        },
      ],
    });
    res.status(200).json(materials);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.generateBarcode = async (categorieCode, materialCode) => {
  if (!categorieCode || !materialCode) {
    throw new Error("Le code catégorie et le code matériel sont requis");
  }

  const prefix = `${categorieCode}-${materialCode}`;

  const lastMaterial = await Material.findOne({
    where: {
      codebar: {
        [Op.like]: `${prefix}-%`,
      },
    },
    order: [["codebar", "DESC"]],
  });

  let nextNumber = 1;

  if (lastMaterial) {
    const lastCode = lastMaterial.codebar;
    const lastParts = lastCode.split("-");
    const lastSeq = parseInt(lastParts[2]);
    nextNumber = lastSeq + 1;
  }

  const formattedNumber = String(nextNumber).padStart(4, "0");

  return `${prefix}-${formattedNumber}`;
};
