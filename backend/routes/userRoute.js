const express = require("express");

const router = express.Router();

const {
  registerController,
  deleteUserController,
  loginController,
  resetPasswordController,
  getProfileController,
  updateProfileController,
  loginWithOtpController,
  verifyOtpController,
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");

// Register
router.post("/register", registerController);

// Login
router.post("/login", loginController);

// Delete logged-in user
router.delete("/delete-user", authMiddleware, deleteUserController);

// Update password
router.put("/update-password", authMiddleware, resetPasswordController);

// Get user profile
router.get("/profile", authMiddleware, getProfileController);

// Update user profile
router.put("/update-profile", authMiddleware, updateProfileController);

// Login with OTP
router.post("/otp-login", loginWithOtpController);

// Verify OTP
router.post("/verify-otp", verifyOtpController);

module.exports = router;