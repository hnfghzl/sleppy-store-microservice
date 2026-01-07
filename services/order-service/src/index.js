const express = require("express");
const axios = require("axios");
const db = require("./config/database");
const { validateOrder, validateOrderStatus } = require("./validators/order");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3003;
const PRODUCT_SERVICE_URL =
  process.env.PRODUCT_SERVICE_URL || "http://localhost:3002";

app.use(express.json());

// Initialize database
db.initDatabase();

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", service: "Order Service" });
});

// Create order
app.post("/orders", async (req, res) => {
  try {
    const { error } = validateOrder(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { productId, quantity = 1 } = req.body;

    // Extract userId from JWT token in header
    const userId = req.user?.id || req.body.userId;
    if (!userId) {
      return res
        .status(401)
        .json({ error: "User ID required (from JWT or request)" });
    }

    // Fetch product details to get price
    let productPrice;
    try {
      const productResponse = await axios.get(
        `${PRODUCT_SERVICE_URL}/products/${productId}`
      );
      productPrice = productResponse.data.price;
    } catch (err) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Calculate total price
    const totalPrice = productPrice * quantity;

    const result = await db.query(
      `INSERT INTO orders (user_id, product_id, quantity, total_price, status) 
       VALUES (?, ?, ?, ?, ?)`,
      [userId, productId, quantity, totalPrice, "pending"]
    );

    const orderId = result.insertId || result.rows.insertId;

    res.status(201).json({
      message: "Order created successfully",
      order: {
        id: orderId,
        user_id: userId,
        product_id: productId,
        quantity,
        total_price: totalPrice,
        status: "pending",
      },
    });
  } catch (error) {
    console.error("Create order error:", error);
    console.error("Error detail:", error.message);
    res
      .status(500)
      .json({ error: "Internal server error", detail: error.message });
  }
});

// Create order with instant payment (auto-complete)
app.post("/orders/checkout", async (req, res) => {
  try {
    const {
      productId,
      quantity = 1,
      paymentMethod = "credit_card",
      userId,
    } = req.body;

    // Get userId from JWT or body
    const finalUserId = req.user?.id || userId;
    if (!finalUserId) {
      return res.status(401).json({ error: "User ID required" });
    }

    // Fetch product details
    let product;
    try {
      const productResponse = await axios.get(
        `${PRODUCT_SERVICE_URL}/products/${productId}`
      );
      product = productResponse.data;
    } catch (err) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Calculate total
    const totalPrice = product.price * quantity;

    // Create order with completed status
    const orderResult = await db.query(
      `INSERT INTO orders (user_id, product_id, quantity, total_price, status, payment_method, payment_status) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        finalUserId,
        productId,
        quantity,
        totalPrice,
        "completed",
        paymentMethod,
        "paid",
      ]
    );

    const orderId = orderResult.insertId || orderResult.rows.insertId;

    res.status(201).json({
      message: "Order created and paid successfully",
      order: {
        id: orderId,
        user_id: finalUserId,
        product_id: productId,
        product_name: product.name,
        quantity,
        total_price: totalPrice,
        status: "completed",
        payment_method: paymentMethod,
        payment_status: "paid",
      },
    });
  } catch (error) {
    console.error("Checkout error:", error);
    res
      .status(500)
      .json({ error: "Internal server error", detail: error.message });
  }
});

// Get all orders with pagination
app.get("/orders", async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    let query = "SELECT * FROM orders WHERE 1=1";
    let countQuery = "SELECT COUNT(*) as count FROM orders WHERE 1=1";
    const params = [];
    const countParams = [];

    if (status) {
      query += ` AND status = ?`;
      countQuery += ` AND status = ?`;
      params.push(status);
      countParams.push(status);
    }

    // Add LIMIT and OFFSET directly to query string
    query += ` ORDER BY created_at DESC LIMIT ${limitNum} OFFSET ${offset}`;

    const [orders, count] = await Promise.all([
      db.query(query, params),
      db.query(countQuery, countParams),
    ]);

    res.json({
      orders: orders.rows,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: parseInt(count.rows[0].count),
        totalPages: Math.ceil(count.rows[0].count / limitNum),
      },
    });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get order by ID
// Get order by ID
app.get("/orders/:id", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM orders WHERE id = ?", [
      req.params.id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get orders by user ID (from JWT token)
app.get("/orders/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const result = await db.query(
      "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );

    // Fetch product details for each order
    const ordersWithProducts = await Promise.all(
      result.rows.map(async (order) => {
        try {
          const productResponse = await axios.get(
            `${PRODUCT_SERVICE_URL}/products/${order.product_id}`
          );
          return {
            ...order,
            product_name: productResponse.data.name,
            product_category: productResponse.data.category,
          };
        } catch (err) {
          return {
            ...order,
            product_name: "Product Not Found",
            product_category: "Unknown",
          };
        }
      })
    );

    res.json({ data: ordersWithProducts });
  } catch (error) {
    console.error("Get user orders error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update order status
app.patch("/orders/:id/status", async (req, res) => {
  try {
    const { error } = validateOrderStatus(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { status } = req.body;

    const result = await db.query(
      `UPDATE orders 
       SET status = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [status, req.params.id]
    );

    if (result.rows.affectedRows === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({
      message: "Order status updated successfully",
      order: {
        id: req.params.id,
        status,
      },
    });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Cancel order
app.delete("/orders/:id", async (req, res) => {
  try {
    const result = await db.query(
      `UPDATE orders 
       SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
       WHERE id = ? AND status = 'pending'`,
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Order not found or cannot be cancelled" });
    }

    res.json({ message: "Order cancelled successfully" });
  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Order Service running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
