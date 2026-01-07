const express = require("express");
const axios = require("axios");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");
const router = express.Router();

const ORDER_SERVICE_URL =
  process.env.ORDER_SERVICE_URL || "http://localhost:3003";

// Create order (authenticated users)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const response = await axios.post(`${ORDER_SERVICE_URL}/orders`, {
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

// Checkout - create order with instant payment
router.post("/checkout", authMiddleware, async (req, res) => {
  try {
    const response = await axios.post(`${ORDER_SERVICE_URL}/orders/checkout`, {
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

// Get user orders
router.get("/my-orders", authMiddleware, async (req, res) => {
  try {
    const response = await axios.get(
      `${ORDER_SERVICE_URL}/orders/user/${req.user.id}`
    );
    res.json(response.data);
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { error: "Service unavailable" });
  }
});

// Get order by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const response = await axios.get(
      `${ORDER_SERVICE_URL}/orders/${req.params.id}`
    );

    // Check if user owns this order or is admin
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

// Get all orders (admin only)
router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const response = await axios.get(`${ORDER_SERVICE_URL}/orders`, {
      params: req.query,
    });
    res.json(response.data);
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { error: "Service unavailable" });
  }
});

// Update order status (admin only)
router.patch(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const response = await axios.patch(
        `${ORDER_SERVICE_URL}/orders/${req.params.id}/status`,
        req.body
      );
      res.json(response.data);
    } catch (error) {
      res
        .status(error.response?.status || 500)
        .json(error.response?.data || { error: "Service unavailable" });
    }
  }
);

module.exports = router;
