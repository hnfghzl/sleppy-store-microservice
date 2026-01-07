const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT) || 3307,
  database: process.env.DB_NAME || "microservices_db",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
});

const initDatabase = async () => {
  try {
    console.log(`Connecting to MySQL at ${process.env.DB_HOST}:${process.env.DB_PORT}...`);
    
    const connection = await pool.getConnection();
    console.log("MySQL connected successfully!");
    connection.release();
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log("Auth database initialized");
  } catch (error) {
    console.error("Database initialization error:", error);
  }
};

const query = async (text, params) => {
  const [rows] = await pool.execute(text, params);
  return { rows, insertId: rows.insertId };
};

module.exports = {
  query,
  initDatabase,
  pool,
};
