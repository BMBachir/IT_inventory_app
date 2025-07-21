const express = require("express");
const categorieController = require("../controllers/CategorieController");
const router = express.Router();

router.post("/create", categorieController.createCategorie);
router.get("/", categorieController.getAllCategories);
router.put("/:id", categorieController.updateCategorie);
router.delete("/:id", categorieController.deleteCategorie);

module.exports = router;
