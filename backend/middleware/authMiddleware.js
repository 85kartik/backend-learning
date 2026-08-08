//const jwt = require("jsonwebtoken");
const User = require("../modules/userModule");

const JWT = require("jsonwebtoken");

const requireSignIn = (req, res, next) => {
  console.log("Authorization:", req.headers.authorization);

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization header missing",
      });
    }

    const token = authHeader.replace("Bearer ", "");

    const decoded = JWT.verify(token, process.env.JWT_CODE);

    req.user = decoded;

    next();
  } catch (error) {
    console.log("JWT ERROR:", error.message);

    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    next();
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Admin Middleware Error",
      error: error.message,
    });
  }
};

module.exports = {
  requireSignIn,
  isAdmin,
};