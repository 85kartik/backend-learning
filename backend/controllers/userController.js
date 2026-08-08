const user = require("../modules/userModule");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const userRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate name
    if (!name) {
      return res.status(400).send({
        success: false,
        message: "Enter name",
      });
    }

    // Validate email
    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Enter Email",
      });
    }

    // Validate password
    if (!password || password.length < 6) {
      return res.status(400).send({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Check if user already exists
    const userExist = await user.findOne({ email });

    if (userExist) {
      return res.status(409).send({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await user.create({
      name,
      email,
      password: hashedPassword,
    });

    // Create JWT token
    const token = JWT.sign(
      {
        _id: newUser._id,
      },
      process.env.JWT_CODE,
      {
        expiresIn: "7d",
      }
    );

    // Response
    res.status(201).send({
      success: true,
      message: "Registration successful",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
      token,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error in registration",
      error: error.message,
    });
  }
};

module.exports = { userRegister };