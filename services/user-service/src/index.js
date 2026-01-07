const express = require("express");
const db = require("./config/database");
const { validateUserUpdate } = require("./validators/user");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3005;

app.use(express.json());

// Initialize database
db.initDatabase();

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", service: "User Service" });
});

// Get all users with pagination
app.get("/users", async (req, res) => {
  try {
    console.log("GET /users called with query:", req.query);
    const { page = 1, limit = 10, role } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    let query =
      "SELECT id, email, full_name, role, created_at FROM users WHERE 1=1";
    let countQuery = "SELECT COUNT(*) as count FROM users WHERE 1=1";
    const params = [];
    const countParams = [];

    if (role) {
      query += ` AND role = ?`;
      countQuery += ` AND role = ?`;
      params.push(role);
      countParams.push(role);
    }

    // Add LIMIT and OFFSET directly to query string
    query += ` ORDER BY created_at DESC LIMIT ${limitNum} OFFSET ${offset}`;

    console.log("Executing query:", query);
    console.log("With params:", params);

    const [users, count] = await Promise.all([
      db.query(query, params),
      db.query(countQuery, countParams),
    ]);

    console.log("Users found:", users);
    console.log("Count result:", count);

    // db.query now returns rows directly
    const userRows = Array.isArray(users) ? users : [];
    const totalCount =
      Array.isArray(count) && count.length > 0 ? count[0].count : 0;

    console.log("Returning users:", userRows.length);

    res.json({
      data: userRows,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: parseInt(totalCount),
        totalPages: Math.ceil(totalCount / limitNum),
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
    console.error("Error stack:", error.stack);
    res
      .status(500)
      .json({ error: "Internal server error", detail: error.message });
  }
});

// Create new user
app.post("/users", async (req, res) => {
  try {
    const { email, fullName, role, password } = req.body;

    // Validate required fields
    if (!email || !fullName) {
      return res
        .status(400)
        .json({ error: "Email and full name are required" });
    }

    // Check if email already exists
    const existingUser = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash password or use default
    const bcrypt = require("bcryptjs");
    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : await bcrypt.hash("password123", 10); // default password

    const result = await db.query(
      `INSERT INTO users (email, password, full_name, role) 
       VALUES (?, ?, ?, ?)`,
      [email, hashedPassword, fullName, role || "user"]
    );

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: result.insertId,
        email,
        fullName,
        role: role || "user",
      },
    });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get user by ID
app.get("/users/:id", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, email, full_name, role, created_at FROM users WHERE id = ?",
      [req.params.id]
    );

    if (result.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result[0]);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update user profile
app.put("/users/:id", async (req, res) => {
  try {
    const { error } = validateUserUpdate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { fullName } = req.body;

    const result = await db.query(
      `UPDATE users 
       SET full_name = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [fullName, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get updated user
    const updated = await db.query(
      "SELECT id, email, full_name, role, created_at FROM users WHERE id = ?",
      [req.params.id]
    );

    res.json({
      message: "User profile updated successfully",
      user: updated[0],
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete user
app.delete("/users/:id", async (req, res) => {
  try {
    const result = await db.query("DELETE FROM users WHERE id = ?", [
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get user statistics
app.get("/users/:id/stats", async (req, res) => {
  try {
    const userResult = await db.query(
      "SELECT id, email, full_name FROM users WHERE id = ?",
      [req.params.id]
    );

    if (userResult.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Note: In production, these would be actual queries to order/payment services
    res.json({
      user: userResult[0],
      stats: {
        totalOrders: 0,
        totalSpent: 0,
        activeSubscriptions: 0,
      },
    });
  } catch (error) {
    console.error("Get user stats error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`User Service running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
