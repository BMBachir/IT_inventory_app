const ActionHistory = require("../models/actionHistory");
const Auth = require("../models/auth");
const Material = require("../models/material");
const SousCategorie = require("../models/sousCategorie");
const User = require("../models/user");

exports.getAllHistories = async (req, res) => {
  try {
    const histories = await ActionHistory.findAll({
      include: [
        {
          model: Auth,
          as: "admin",
          attributes: ["id", "username"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const results = [];

    for (const h of histories) {
      let entityDetails = null;

      if (h.entityType === "Material") {
        const material = await Material.findByPk(h.entityId, {
          include: [
            {
              model: SousCategorie,
              as: "SousCategorie",
              attributes: ["id", "nom"],
            },
            {
              model: User,
              attributes: ["id", "fullname"],
            },
          ],
          attributes: ["id", "marque", "codebar"],
        });
        let codebar = "";
        if (material?.codebar) {
          const code = material.codebar.split("-");
          codebar = code.slice(2).join("-");
        }
        entityDetails = material
          ? {
              type: "Material",
              label: `${codebar || ""} 
              `,
              owner: material.user?.fullname || null,
            }
          : null;
      }

      if (h.entityType === "User") {
        const user = await User.findByPk(h.entityId, {
          attributes: ["id", "fullname"],
        });

        entityDetails = user
          ? {
              type: "User",
              label: user.fullname,
            }
          : null;
      }

      results.push({
        id: h.id,
        entityType: h.entityType,
        entityId: h.entityId,
        entity: entityDetails,
        doneBy: h.admin?.username || "Unknown",
        actionType: h.actionType,
        champ: h.fieldName,
        old: h.oldValue,
        new: h.newValue,
        date: h.createdAt,
      });
    }

    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
