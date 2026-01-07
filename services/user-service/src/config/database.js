const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT) || 3307,
  database: process.env.DB_NAME || "auth_db",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const initDatabase = async () => {
  try {
    // Note: We're using auth_db which already has users table from auth-service
    // Just ensure it has the columns we need
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255),
        full_name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log("User service: database checked");
  } catch (error) {
    console.error("Database initialization error:", error);
  }
};

const query = async (text, params) => {
  try {
    const [rows] = await pool.execute(text, params || []);
    return rows; // Return rows directly, not wrapped in object
  } catch (error) {
    console.error("Query error:", error);
    console.error("Query text:", text);
    console.error("Query params:", params);
    throw error;
  }
};

module.exports = {
  query,
  initDatabase,
  pool,
};
