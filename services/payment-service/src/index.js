const express = require("express");
const axios = require("axios");
const db = require("./config/database");
const { validatePayment } = require("./validators/payment");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3004;
const ORDER_SERVICE_URL =
  process.env.ORDER_SERVICE_URL || "http://localhost:3003";

app.use(express.json());

// Initialize database
db.initDatabase();

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", service: "Payment Service" });
});

// Create payment
app.post("/payments", async (req, res) => {
  try {
    const { error } = validatePayment(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { userId, orderId, amount, paymentMethod } = req.body;

    // Generate payment reference
    const paymentReference = `PAY-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`;

    const result = await db.query(
      `INSERT INTO payments (user_id, order_id, amount, payment_method, payment_reference, status) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, orderId, amount, paymentMethod, paymentReference, "pending"]
    );

    res.status(201).json({
      message: "Payment initiated successfully",
      payment: {
        id: result.rows.insertId,
        user_id: userId,
        order_id: orderId,
        amount,
        payment_method: paymentMethod,
        payment_reference: paymentReference,
        status: "pending",
      },
      instructions: {
        paymentReference: paymentReference,
        amount: amount,
        paymentMethod: paymentMethod,
        note: "Please complete the payment and verify using the payment reference",
      },
    });
  } catch (error) {
    console.error("Create payment error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all payments with pagination
app.get("/payments", async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    let query = "SELECT * FROM payments WHERE 1=1";
    let countQuery = "SELECT COUNT(*) as count FROM payments WHERE 1=1";
    const params = [];

    if (status) {
      query += ` AND status = ?`;
      countQuery += ` AND status = ?`;
      params.push(status);
    }

    const countParams = [...params];
    query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    const [payments, count] = await Promise.all([
      db.query(query, params),
      db.query(countQuery, countParams),
    ]);

    res.json({
      payments: payments.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(count.rows[0].count),
        totalPages: Math.ceil(count.rows[0].count / limit),
      },
    });
  } catch (error) {
    console.error("Get payments error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get payment by ID
// Get payment by ID
app.get("/payments/:id", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM payments WHERE id = ?", [
      req.params.id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Payment not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Get payment error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Verify payment (simulate payment gateway callback)
app.post("/payments/:id/verify", async (req, res) => {
  try {
    const { paymentReference } = req.body;

    const paymentResult = await db.query(
      "SELECT * FROM payments WHERE id = ?",
      [req.params.id]
    );

    if (paymentResult.rows.length === 0) {
      return res.status(404).json({ error: "Payment not found" });
    }

    const payment = paymentResult.rows[0];

    if (payment.status === "completed") {
      return res.status(400).json({ error: "Payment already verified" });
    }

    // Verify payment reference
    if (payment.payment_reference !== paymentReference) {
      return res.status(400).json({ error: "Invalid payment reference" });
    }

    // Update payment status
    const updateResult = await db.query(
      `UPDATE payments 
       SET status = 'completed', verified_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [req.params.id]
    );

    // Get updated payment
    const updated = await db.query("SELECT * FROM payments WHERE id = ?", [
      req.params.id,
    ]);

    // Update order status
    try {
      await axios.patch(
        `${ORDER_SERVICE_URL}/orders/${payment.order_id}/status`,
        {
          status: "paid",
        }
      );
    } catch (orderError) {
      console.error("Error updating order status:", orderError);
    }

    res.json({
      message: "Payment verified successfully",
      payment: updated.rows[0],
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get payment by order ID
app.get("/payments/order/:orderId", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM payments WHERE order_id = ? ORDER BY created_at DESC",
      [req.params.orderId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Get order payments error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Payment Service running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
