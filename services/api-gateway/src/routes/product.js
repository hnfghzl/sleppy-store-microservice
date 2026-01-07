const express = require("express");
const axios = require("axios");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");
const router = express.Router();

const PRODUCT_SERVICE_URL =
  process.env.PRODUCT_SERVICE_URL || "http://localhost:3002";

// Get all products (public)
router.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${PRODUCT_SERVICE_URL}/products`, {
      params: req.query,
    });
    res.json(response.data);
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { error: "Service unavailable" });
  }
});

// Get product by ID (public)
router.get("/:id", async (req, res) => {
  try {
    const response = await axios.get(
      `${PRODUCT_SERVICE_URL}/products/${req.params.id}`
    );
    res.json(response.data);
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { error: "Service unavailable" });
  }
});

// Create product (admin only)
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const response = await axios.post(
      `${PRODUCT_SERVICE_URL}/products`,
      req.body
    );
    res.json(response.data);
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { error: "Service unavailable" });
  }
});

// Update product (admin only)
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const response = await axios.put(
      `${PRODUCT_SERVICE_URL}/products/${req.params.id}`,
      req.body
    );
    res.json(response.data);
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { error: "Service unavailable" });
  }
});

// Delete product (admin only)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const response = await axios.delete(
      `${PRODUCT_SERVICE_URL}/products/${req.params.id}`
    );
    res.json(response.data);
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { error: "Service unavailable" });
  }
});

module.exports = router;
