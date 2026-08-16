const JWT = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).send({
        success: false,
        message: "Authorization token required",
      });
    }

    // Expected format:
    // Authorization: Bearer TOKEN

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).send({
        success: false,
        message: "Invalid authorization format",
      });
    }

    const token = parts[1];

    const decoded = JWT.verify(
      token,
      process.env.JWT_CODE
    );

    req.user = decoded;

    next();
  } catch (error) {
    console.log("AUTH ERROR:", error);

    return res.status(401).send({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = authMiddleware;