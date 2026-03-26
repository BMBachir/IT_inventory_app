const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");
const {
  authenticateUser,
  authorizeAdmin,
} = require("../middleware/authMiddleware");

router.post(
  "/create",
  authenticateUser,
  authorizeAdmin,
  userController.createUser,
);

router.get("/", authenticateUser, authorizeAdmin, userController.getAllUsers);
router.get(
  "/ActiveUsers",
  authenticateUser,
  authorizeAdmin,
  userController.getAllActiveUsers,
);
router.get(
  "/:id",
  authenticateUser,
  authorizeAdmin,
  userController.getUserById,
);
router.patch(
  "/updateStatus/:id",
  authenticateUser,
  authorizeAdmin,
  userController.updateStatus,
);
router.put(
  "/update/:id",
  authenticateUser,
  authorizeAdmin,
  userController.updateUser,
);
router.delete(
  "/delete/:id",
  authenticateUser,
  authorizeAdmin,
  userController.deleteUser,
);

module.exports = router;
