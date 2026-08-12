const express = require("express");

const router = express.Router();

const {
  registerController,
  loginController,
  deleteUserController,
  resetPasswordController
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");

// Register
router.post("/register", registerController);

// Login
router.post("/login", loginController);

// Delete logged-in user
router.delete(
  "/delete-user",
  authMiddleware,
  deleteUserController
);
// update password

router.put("/update-password",authMiddleware,resetPasswordController)
module.exports = router;