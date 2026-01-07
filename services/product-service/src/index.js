const express = require("express");
const db = require("./config/database");
const { validateProduct } = require("./validators/product");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", service: "Product Service" });
});

// Get all products with pagination and filters
app.get("/products", async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    let query = "SELECT * FROM products WHERE 1=1";
    let countQuery = "SELECT COUNT(*) as count FROM products WHERE 1=1";
    const params = [];
    const countParams = [];

    if (category) {
      query += ` AND category = ?`;
      countQuery += ` AND category = ?`;
      params.push(category);
      countParams.push(category);
    }

    if (search) {
      query += ` AND (name LIKE ? OR description LIKE ?)`;
      countQuery += ` AND (name LIKE ? OR description LIKE ?)`;
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam);
      countParams.push(searchParam, searchParam);
    }

    // Add LIMIT and OFFSET directly to query string (not as params)
    query += ` ORDER BY created_at DESC LIMIT ${limitNum} OFFSET ${offset}`;

    console.log("Executing query:", query);
    console.log("With params:", params);

    const [products, count] = await Promise.all([
      db.query(query, params),
      db.query(countQuery, countParams),
    ]);

    console.log("Products found:", products.rows.length);

    res.json({
      products: products.rows,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: parseInt(count.rows[0].count),
        totalPages: Math.ceil(count.rows[0].count / limitNum),
      },
    });
  } catch (error) {
    console.error("Get products error:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ error: "Internal server error", detail: error.message });
  }
});

// Get product by ID
app.get("/products/:id", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM products WHERE id = ?", [
      req.params.id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create product
app.post("/products", async (req, res) => {
  try {
    console.log("=== Received product data ===");
    console.log(JSON.stringify(req.body, null, 2));
    
    const { error } = validateProduct(req.body);
    if (error) {
      console.log("Validation error:", error.details[0].message);
      return res.status(400).json({ error: error.details[0].message });
    }

    const { name, description, category, price, features, imageUrl } = req.body;
    
    // Convert features to JSON string for MySQL JSON column
    let featuresJson = null;
    if (features) {
      if (Array.isArray(features)) {
        featuresJson = JSON.stringify(features);
      } else if (typeof features === 'string' && features.trim() !== '') {
        // Split comma-separated string into array
        const featuresArray = features.split(',').map(f => f.trim()).filter(f => f);
        featuresJson = JSON.stringify(featuresArray);
      }
    }
    
    console.log("Features to insert:", featuresJson);
    console.log("About to insert with params:", [name, description, category, price, featuresJson, imageUrl || null]);

    const connection = await db.pool.getConnection();
    try {
      const [result] = await connection.execute(
        `INSERT INTO products (name, description, category, price, features, image_url) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [name, description || '', category || '', price, featuresJson, imageUrl || null]
      );
      
      console.log("Insert successful, ID:", result.insertId);
      
      res.status(201).json({
        message: "Product created successfully",
        product: {
          id: result.insertId,
          name,
          description,
          category,
          price,
          features: featuresJson ? JSON.parse(featuresJson) : null,
          image_url: imageUrl,
        },
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("=== Create product error ===");
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    console.error("Error stack:", error.stack);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

// Update product
app.put("/products/:id", async (req, res) => {
  try {
    const { error } = validateProduct(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { name, description, category, price, features, imageUrl } = req.body;

    const result = await db.query(
      `UPDATE products 
       SET name = ?, description = ?, category = ?, price = ?, 
           features = ?, image_url = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        name,
        description,
        category,
        price,
        JSON.stringify(features),
        imageUrl,
        req.params.id,
      ]
    );

    if (result.rows.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({
      message: "Product updated successfully",
      product: {
        id: req.params.id,
        name,
        description,
        category,
        price,
        features,
        image_url: imageUrl,
      },
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete product
app.delete("/products/:id", async (req, res) => {
  try {
    const result = await db.query("DELETE FROM products WHERE id = ?", [
      req.params.id,
    ]);

    if (result.rows.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, '0.0.0.0', async () => {
  console.log(`Product Service running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  
  // Initialize database after server starts
  await db.initDatabase();
});
