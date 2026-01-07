const express = require("express");
const axios = require("axios");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");
const router = express.Router();

const PAYMENT_SERVICE_URL =
  process.env.PAYMENT_SERVICE_URL || "http://localhost:3004";

// Create payment
router.post("/", authMiddleware, async (req, res) => {
  try {
    const response = await axios.post(`${PAYMENT_SERVICE_URL}/payments`, {
      ...req.body,
      userId: req.user.id,
    });
    res.json(response.data);
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { error: "Service unavailable" });
  }
});

// Get payment by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const response = await axios.get(
      `${PAYMENT_SERVICE_URL}/payments/${req.params.id}`
    );

    // Check if user owns this payment or is admin
    if (response.data.userId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json(response.data);
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { error: "Service unavailable" });
  }
});

// Get all payments (admin only)
router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const response = await axios.get(`${PAYMENT_SERVICE_URL}/payments`, {
      params: req.query,
    });
    res.json(response.data);
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { error: "Service unavailable" });
  }
});

// Verify payment
router.post("/:id/verify", authMiddleware, async (req, res) => {
  try {
    const response = await axios.post(
      `${PAYMENT_SERVICE_URL}/payments/${req.params.id}/verify`,
      req.body
    );
    res.json(response.data);
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { error: "Service unavailable" });
  }
});

module.exports = router;
