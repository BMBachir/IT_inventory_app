const ActionHistory = require("../models/actionHistory");
const Material = require("../models/material");
const User = require("../models/user");

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    await ActionHistory.create({
      entityType: "User",
      entityId: user.id,
      userId: req.user.id,
      actionType: "created",
      fieldName: null,
      oldValue: null,
      newValue: null,
    });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      order: [["fullname", "ASC"]],
    });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const oldValues = user.toJSON();

    await user.update(req.body);

    const newValues = user.toJSON();

    for (const key of Object.keys(newValues)) {
      if (oldValues[key] !== newValues[key]) {
        await ActionHistory.create({
          entityType: "User",
          entityId: user.id,
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
    if (
      oldValues.bloc !== newValues.bloc ||
      oldValues.service !== newValues.service
    ) {
      const materials = await Material.findAll({ where: { userId: user.id } });

      for (const material of materials) {
        if (!material.codebar) continue;

        let parts = material.codebar.split("-");
        if (parts.length < 4) continue;

        if (oldValues.bloc !== newValues.bloc) {
          parts[0] = `B${newValues.bloc}`;
        }

        if (oldValues.service !== newValues.service) {
          parts[1] = newValues.service;
        }

        const oldBarcode = material.codebar;
        const newBarcode = parts.join("-");

        if (newBarcode !== oldBarcode) {
          await material.update({ codebar: newBarcode });

          const hi = await ActionHistory.create({
            entityType: "Material",
            entityId: material.id,
            userId: req.user.id,
            actionType: "barcode_updated",
            fieldName: "barcode",
            oldValue: oldBarcode,
            newValue: newBarcode,
          });
          console.log(hi);
        }
      }
    }

    res.status(200).json({ message: "User updated", user });
  } catch (err) {
    console.error("Update user error:", err);
    res.status(400).json({ error: err.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.destroy();

    await ActionHistory.create({
      entityType: "User",
      entityId: user.id,
      userId: req.user.id,
      actionType: "deleted",
      fieldName: null,
      oldValue: null,
      newValue: null,
    });

    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(400).json({ error: err.message });
  }
};
