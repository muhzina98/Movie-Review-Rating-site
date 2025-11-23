const jwt = require("jsonwebtoken");

const authAdmin = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ error: "User not authorized" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decodedToken) {
      return res.status(401).json({ error: "User not authorized" });
    }

    if (decodedToken.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admin only" });
    }

    req.user = {
      id: decodedToken.id,
      email: decodedToken.email,
      role: decodedToken.role,
    };

    next();
  } catch (error) {
    console.error("authAdmin error:", error.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = authAdmin;
