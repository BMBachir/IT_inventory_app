const express = require("express");
const categorieController = require("../controllers/CategorieController");
const router = express.Router();

router.post("/create", categorieController.createCategorie);
router.get("/", categorieController.getAllCategories);
router.put("/:code", categorieController.updateCategorie);
router.delete("delete/:code", categorieController.deleteCategorie);

module.exports = router;
