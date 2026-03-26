const express = require("express");
const router = express.Router();
const materialController = require("../controllers/MaterialController");
const {
  authenticateUser,
  authorizeAdmin,
} = require("../middleware/authMiddleware");

router.post(
  "/create",
  authenticateUser,
  authorizeAdmin,
  materialController.createMaterial,
);

router.get(
  "/",
  authenticateUser,
  authorizeAdmin,
  materialController.getAllMaterials,
);

router.get(
  "/by-user/:userId",
  authenticateUser,
  authorizeAdmin,
  materialController.getMaterialsByUser,
);
router.delete(
  "/delete/:id",
  authenticateUser,
  authorizeAdmin,
  materialController.deleteMaterial,
);
router.put(
  "/update/:id",
  authenticateUser,
  authorizeAdmin,
  materialController.updateMaterial,
);

router.get(
  "/:codebar",
  authenticateUser,
  authorizeAdmin,
  materialController.getMaterialByCode,
);

module.exports = router;
