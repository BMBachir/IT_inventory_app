const express = require("express");
const router = express.Router();
const dataController = require("../controllers/dashboard.controller");

router.get("/", dataController.getData);

module.exports = router;
