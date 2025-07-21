const express = require("express");
const authController = require("../controllers/Auth.controller.js");

const router = express.Router();

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.get("/logout", authController.signOut);
router.delete("/delete-user/:id", authController.deleteUser);
router.get("/get-users", authController.getUsers);

module.exports = router;
