const express = require("express");
const router = express.Router();
const dataController = require("../controllers/dashboard.controller");
const {
  authenticateUser,
  authorizeAdmin,
} = require("../middleware/authMiddleware");

router.get("/", authenticateUser, authorizeAdmin, dataController.getData);

module.exports = router;
