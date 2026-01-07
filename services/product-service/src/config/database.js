const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT) || 3307,
  database: process.env.DB_NAME || "product_db",
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
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        price DECIMAL(10, 2) NOT NULL,
        features JSON,
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log("Product database initialized");

    // Insert sample data if table is empty
    const [count] = await pool.query(
      "SELECT COUNT(*) as count FROM products"
    );
    if (count[0].count === 0) {
      await pool.query(`
        INSERT INTO products (name, description, category, price, features, image_url) VALUES
        ('Adobe Creative Cloud', 'Suite lengkap aplikasi kreatif untuk desain, video, dan web', 'Design', 699000, '["Photoshop", "Illustrator", "Premiere Pro", "After Effects"]', 'https://via.placeholder.com/300'),
        ('Microsoft Office 365', 'Aplikasi produktivitas untuk bisnis dan pribadi', 'Productivity', 129000, '["Word", "Excel", "PowerPoint", "Outlook", "OneDrive 1TB"]', 'https://via.placeholder.com/300'),
        ('Spotify Premium', 'Streaming musik tanpa iklan dengan kualitas tinggi', 'Entertainment', 54900, '["Ad-free", "Offline download", "High quality audio"]', 'https://via.placeholder.com/300'),
        ('Netflix Premium', 'Streaming film dan series dengan kualitas 4K', 'Entertainment', 186000, '["4K streaming", "4 screens", "Download content"]', 'https://via.placeholder.com/300'),
        ('AutoCAD', 'Software CAD profesional untuk desain 2D dan 3D', 'Design', 2850000, '["2D drafting", "3D modeling", "Cloud collaboration"]', 'https://via.placeholder.com/300')
      `);
      console.log("Sample products inserted");
    }
  } catch (error) {
    console.error("Database initialization error:", error);
  }
};

const query = async (text, params) => {
  const [rows] = await pool.execute(text, params);
  return { rows };
};

module.exports = {
  query,
  initDatabase,
  pool,
};
