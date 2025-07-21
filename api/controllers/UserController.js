const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  try {
    const { nom, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ nom, email, password: hashedPassword });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.update(req.body, { where: { id } });
    res.status(200).json({ message: "User updated" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.destroy({ where: { id } });
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
