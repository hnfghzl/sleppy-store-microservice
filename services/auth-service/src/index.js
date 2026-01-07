const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("./config/database");
const { validateRegister, validateLogin } = require("./validators/auth");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

app.use(express.json());

// Initialize database
db.initDatabase();

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", service: "Auth Service" });
});

// Register
app.post("/register", async (req, res) => {
  try {
    const { error } = validateRegister(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password, fullName, role } = req.body;

    // Check if user exists
    const existingUser = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await db.query(
      "INSERT INTO users (email, password, full_name, role) VALUES (?, ?, ?, ?)",
      [email, hashedPassword, fullName, role || "user"]
    );

    // MySQL2 returns insertId directly in result object
    const userId = result.rows.insertId || result.insertId || result.rows[0]?.insertId;
    console.log("User created with ID:", userId);

    const user = {
      id: userId,
      email: email,
      full_name: fullName,
      role: role || "user",
    };

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    console.error("Error detail:", error.message);
    console.error("Error stack:", error.stack);
    res.status(500).json({ error: "Internal server error", detail: error.message });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { error } = validateLogin(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password } = req.body;

    // Find user
    const result = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Verify token
app.post("/verify", (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    res.json({
      valid: true,
      user: {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      },
    });
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Auth Service running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
