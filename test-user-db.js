const mysql = require("mysql2/promise");

async function testUserService() {
  const pool = mysql.createPool({
    host: "localhost",
    port: 3307,
    database: "auth_db",
    user: "root",
    password: "",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  try {
    console.log("Testing user service database connection...");

    // Test query
    const [rows] = await pool.execute(
      "SELECT id, email, full_name, role FROM users ORDER BY created_at DESC LIMIT 5"
    );

    console.log("✅ SUCCESS! Users found:", rows.length);
    console.log("\nUsers:");
    rows.forEach((user) => {
      console.log(`  - ${user.email} (${user.role}) - ID: ${user.id}`);
    });

    await pool.end();
  } catch (error) {
    console.error("❌ ERROR:", error.message);
    console.error("Stack:", error.stack);
  }
}

testUserService();
