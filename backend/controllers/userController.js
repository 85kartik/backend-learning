const User = require("../modules/userModule");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

// ================= REGISTER =================

const registerController = async (req, res) => {
  try {
    const { email, password, name, phone, address } = req.body;

    // Validation
    if (!name) {
      return res.status(400).send({
        success: false,
        message: "Enter name",
      });
    }

    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Enter email",
      });
    }

    if (!password) {
      return res.status(400).send({
        success: false,
        message: "Enter password",
      });
    }

    // Check existing user
    const checkUser = await User.findOne({ email });

    if (checkUser) {
      return res.status(409).send({
        success: false,
        message: "User already exists. Try Login",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
    });

    // Generate JWT
    const token = JWT.sign(
      {
        _id: newUser._id,
      },
      process.env.JWT_CODE,
      {
        expiresIn: "7d",
      }
    );

    // Don't send password to frontend
    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      address: newUser.address,
    };

    return res.status(201).send({
      success: true,
      message: "Registered Successfully",
      user: userResponse,
      token,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).send({
      success: false,
      message: "Error in Register",
      error: error.message,
    });
  }
};

// ================= LOGIN =================

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Enter Email",
      });
    }

    if (!password) {
      return res.status(400).send({
        success: false,
        message: "Enter Password",
      });
    }

    // Find user
    const checkUser = await User.findOne({ email });

    if (!checkUser) {
      return res.status(404).send({
        success: false,
        message: "User does not exist. Try Register",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(
      password,
      checkUser.password
    );

    if (!isMatch) {
      return res.status(401).send({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    // Generate JWT
    const token = JWT.sign(
      {
        _id: checkUser._id,
      },
      process.env.JWT_CODE,
      {
        expiresIn: "7d",
      }
    );

    // Don't send password
    const userResponse = {
      _id: checkUser._id,
      name: checkUser.name,
      email: checkUser.email,
      phone: checkUser.phone,
      address: checkUser.address,
    };

    return res.status(200).send({
      success: true,
      message: "Login Successfully",
      user: userResponse,
      token,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).send({
      success: false,
      message: "Error in Login",
      error: error.message,
    });
  }
};

// ================= DELETE USER =================

const deleteUserController = async (req, res) => {
  try {
    // Get user ID from JWT
    const {userId} = req.user._id;

    // Find user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Delete user
    await User.findByIdAndDelete(userId);

    return res.status(200).send({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).send({
      success: false,
      message: "Error in deleting User",
      error: error.message,
    });
  }
};
// ================= RESET PASSWORD =================

const resetPasswordController = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validation
    if (!currentPassword) {
      return res.status(400).send({
        success: false,
        message: "Enter current password",
      });
    }

    if (!newPassword) {
      return res.status(400).send({
        success: false,
        message: "Enter new password",
      });
    }

    // Check new password length
    if (newPassword.length < 6) {
      return res.status(400).send({
        success: false,
        message: "New password must be at least 6 characters",
      });
    }

    // Get user ID from JWT
    const userId = req.user._id;

    // Find user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Check current password
    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(401).send({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    user.password = hashedPassword;

    await user.save();

    return res.status(200).send({
      success: true,
      message: "Password reset successfully",
    });

  } catch (error) {
    console.log(error);

    return res.status(500).send({
      success: false,
      message: "Error in resetting password",
      error: error.message,
    });
  }
};
module.exports = {
  registerController,
  loginController,
  deleteUserController,
  resetPasswordController
};