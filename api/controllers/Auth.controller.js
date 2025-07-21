const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Auth = require("../models/auth");

const registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await Auth.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await Auth.create({
      username,
      email,
      password: hashedPassword,
      role: "user",
    });

    const token = jwt.sign(
      { id: newUser.id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    const { password: _, ...userData } = newUser.dataValues;
    res.status(201).json({
      message: "User registered successfully",
      user: userData,
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await Auth.findOne({ where: { email } });
    if (!user) return next(new Error("User not found"));

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return next(new Error("Invalid Password"));

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    const { password: _, ...userData } = user.dataValues;
    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      })
      .status(200)
      .json({
        message: "User logged in successfully",
        userData,
      });
  } catch (error) {
    next(error);
  }
};

const signOut = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res
      .status(200)
      .json({ success: true, message: "User has been logged out!" });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    await Auth.destroy({ where: { id: req.params.id } });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await Auth.findAll({
      attributes: ["id", "username", "email", "role"],
    });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  signOut,
  deleteUser,
  getUsers,
};
