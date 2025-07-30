const express = require("express");
const categorieController = require("../controllers/CategorieController");
const {
  authenticateUser,
  authorizeAdmin,
} = require("../middleware/authMiddleware");
const router = express.Router();

router.post(
  "/create",
  authenticateUser,
  authorizeAdmin,
  categorieController.createCategorie
);
router.get(
  "/",
  authenticateUser,
  authorizeAdmin,
  categorieController.getAllCategories
);
router.put(
  "/:code",
  authenticateUser,
  authorizeAdmin,
  categorieController.updateCategorie
);
router.delete(
  "/delete/:code",
  authenticateUser,
  authorizeAdmin,
  categorieController.deleteCategorie
);

module.exports = router;
