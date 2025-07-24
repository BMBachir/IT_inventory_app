const express = require("express");
const router = express.Router();
const materialController = require("../controllers/MaterialController");

router.post("/create", materialController.createMaterial);

router.get("/", materialController.getAllMaterials);

router.get("/:codebar", materialController.getMaterialByCode);

router.put("/update/:id", materialController.updateMaterial);

router.delete("/delete/:id", materialController.deleteMaterial);

module.exports = router;
