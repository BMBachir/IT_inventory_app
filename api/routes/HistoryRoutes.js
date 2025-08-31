const express = require("express");
const router = express.Router();
const HistoryController = require("../controllers/History.controller");
const {
  authenticateUser,
  authorizeAdmin,
} = require("../middleware/authMiddleware");

router.get(
  "/all",
  authenticateUser,
  authorizeAdmin,
  HistoryController.getAllHistories
);

module.exports = router;
