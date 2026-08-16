const express = require("express");

const router = express.Router();

const { registerController,deleteUserController,loginController,resetPasswordController,
	getProfileController,updateProfileController ,loginWithOtpController,verifyOtpController
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

// get user
router.get("/profile",authMiddleware, getProfileController)

router.put("/update-profile",authMiddleware,updateProfileController )

router.post("/otp-login",loginWithOtpController)
router.post("/verify-otp", verifyOtpController);

module.exports = router;