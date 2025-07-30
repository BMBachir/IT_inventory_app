const express = require("express");
const router = express.Router();
const sousCategorieController = require("../controllers/sousCategorie.controller");
const {
  authenticateUser,
  authorizeAdmin,
} = require("../middleware/authMiddleware");

router.get(
  "/",
  authenticateUser,
  authorizeAdmin,
  sousCategorieController.getAllSousCategories
);
router.get(
  "/:id",
  authenticateUser,
  authorizeAdmin,
  sousCategorieController.getSousCategorie
);
router.post(
  "/create",
  authenticateUser,
  authorizeAdmin,
  sousCategorieController.createSousCategorie
);
router.put(
  "/update/:id",
  authenticateUser,
  authorizeAdmin,
  sousCategorieController.updateSousCategorie
);
router.delete(
  "/delete/:id",
  authenticateUser,
  authorizeAdmin,
  sousCategorieController.deleteSousCategorie
);

module.exports = router;
