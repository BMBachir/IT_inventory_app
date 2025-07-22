const { Material, User } = require("../models");

// 🔹 Create Material
exports.createMaterial = async (req, res) => {
  try {
    const newMaterial = await Material.create(req.body);
    res.status(201).json(newMaterial);
  } catch (error) {
    console.error("Create error:", error);
    res.status(500).json({ message: "Failed to create material." });
  }
};

// 🔹 Update Material
exports.updateMaterial = async (req, res) => {
  try {
    const material = await Material.findByPk(req.params.id);
    if (!material)
      return res.status(404).json({ message: "Material not found" });

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

// 🔹 Get Material by Code
exports.getMaterialByCode = async (req, res) => {
  try {
    const { code } = req.params;

    const material = await Material.findOne({
      where: { code },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "email"],
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
