const axios = require("axios");

const AUTH_SERVICE_URL =
  process.env.AUTH_SERVICE_URL || "http://localhost:3001";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const response = await axios.post(
      `${AUTH_SERVICE_URL}/verify`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    req.user = response.data.user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

const adminMiddleware = async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ error: "Access denied. Admin only." });
  }
};

module.exports = { authMiddleware, adminMiddleware };
