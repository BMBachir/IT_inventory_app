const express = require("express");
const router = express.Router();
const sousCategorieController = require("../controllers/sousCategorie.controller");

router.get("/", sousCategorieController.getAllSousCategories);
router.get("/:id", sousCategorieController.getSousCategorie);
router.post("/create", sousCategorieController.createSousCategorie);
router.put("/update/:id", sousCategorieController.updateSousCategorie);
router.delete("/delete/:id", sousCategorieController.deleteSousCategorie);

module.exports = router;
