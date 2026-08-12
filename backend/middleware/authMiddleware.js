const JWT = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    // Get Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).send({
        success: false,
        message: "Authorization token required",
      });
    }

    // Expected:
    // Authorization: Bearer TOKEN
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).send({
        success: false,
        message: "Invalid authorization format",
      });
    }

    // Verify JWT
    const decoded = JWT.verify(
      token,
      process.env.JWT_CODE
    );

    // Store decoded user inside req.user
    req.user = decoded;

    next();
  } catch (error) {
    console.log(error);

    return res.status(401).send({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = authMiddleware;