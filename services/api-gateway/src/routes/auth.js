const express = require("express");
const axios = require("axios");
const router = express.Router();

const AUTH_SERVICE_URL =
  process.env.AUTH_SERVICE_URL || "http://localhost:3001";

// Register
router.post("/register", async (req, res) => {
  try {
    const response = await axios.post(`${AUTH_SERVICE_URL}/register`, req.body);
    res.json(response.data);
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { error: "Service unavailable" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const response = await axios.post(`${AUTH_SERVICE_URL}/login`, req.body);
    res.json(response.data);
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { error: "Service unavailable" });
  }
});

// Verify token
router.post("/verify", async (req, res) => {
  try {
    const response = await axios.post(`${AUTH_SERVICE_URL}/verify`, req.body, {
      headers: { Authorization: req.headers.authorization },
    });
    res.json(response.data);
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { error: "Service unavailable" });
  }
});

module.exports = router;
