const JWT = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).send({
        success: false,
        message: "Authorization token required",
      });
    }

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