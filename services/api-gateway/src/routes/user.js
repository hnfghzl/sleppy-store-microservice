const express = require("express");
const axios = require("axios");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");
const router = express.Router();

const USER_SERVICE_URL =
  process.env.USER_SERVICE_URL || "http://localhost:3005";

// Get current user profile
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const response = await axios.get(
      `${USER_SERVICE_URL}/users/${req.user.id}`
    );
    res.json(response.data);
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { error: "Service unavailable" });
  }
});

// Update current user profile
router.put("/me", authMiddleware, async (req, res) => {
  try {
    const response = await axios.put(
      `${USER_SERVICE_URL}/users/${req.user.id}`,
      req.body
    );
    res.json(response.data);
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { error: "Service unavailable" });
  }
});

// Get all users (admin only)
router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const response = await axios.get(`${USER_SERVICE_URL}/users`, {
      params: req.query,
    });
    res.json(response.data);
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { error: "Service unavailable" });
  }
});

// Create user (admin only)
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const response = await axios.post(`${USER_SERVICE_URL}/users`, req.body);
    res.json(response.data);
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { error: "Service unavailable" });
  }
});

// Get user by ID (admin only)
router.get("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const response = await axios.get(
      `${USER_SERVICE_URL}/users/${req.params.id}`
    );
    res.json(response.data);
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { error: "Service unavailable" });
  }
});

// Delete user (admin only)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const response = await axios.delete(
      `${USER_SERVICE_URL}/users/${req.params.id}`
    );
    res.json(response.data);
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { error: "Service unavailable" });
  }
});

module.exports = router;
