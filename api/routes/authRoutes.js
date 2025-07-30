const express = require("express");
const authController = require("../controllers/Auth.controller.js");
const {
  authenticateUser,
  authorizeAdmin,
} = require("../middleware/authMiddleware.js");

const router = express.Router();

router.post(
  "/register",
  authenticateUser,
  authorizeAdmin,
  authController.registerUser
);
router.post(
  "/login",

  authController.loginUser
);
router.get("/logout", authController.signOut);
router.delete(
  "/delete-user/:id",
  authenticateUser,
  authorizeAdmin,
  authController.deleteUser
);
router.get(
  "/get-users",
  authenticateUser,
  authorizeAdmin,
  authController.getUsers
);

module.exports = router;
