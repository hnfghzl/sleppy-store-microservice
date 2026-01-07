const axios = require("axios");

const API_BASE = "http://localhost:3000/api";
let authToken = "";
let testUserId = "";
let testProductIds = [];
let testOrderIds = [];

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, message) {
  log(`\n[${"=".repeat(60)}]`, "cyan");
  log(`STEP ${step}: ${message}`, "cyan");
  log(`[${"=".repeat(60)}]`, "cyan");
}

function logSuccess(message) {
  log(`✅ ${message}`, "green");
}

function logError(message) {
  log(`❌ ${message}`, "red");
}

function logInfo(message) {
  log(`ℹ️  ${message}`, "blue");
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Test 1: Register new customer
async function testRegister() {
  logStep(1, "REGISTER NEW CUSTOMER");
  try {
    const timestamp = Date.now();
    const response = await axios.post(`${API_BASE}/auth/register`, {
      email: `test${timestamp}@example.com`,
      password: "Test123456",
      fullName: "Test User Flow",
    });

    logSuccess("Customer registered successfully");
    logInfo(`User ID: ${response.data.user.id}`);
    logInfo(`Email: ${response.data.user.email}`);
    testUserId = response.data.user.id;
    return true;
  } catch (error) {
    logError(
      `Register failed: ${error.response?.data?.error || error.message}`
    );
    return false;
  }
}

// Test 2: Login
async function testLogin() {
  logStep(2, "LOGIN");
  try {
    // Try login with existing user
    const response = await axios.post(`${API_BASE}/auth/login`, {
      email: "user@user.com",
      password: "user123",
    });

    authToken = response.data.token;
    testUserId = response.data.user.id;

    logSuccess("Login successful");
    logInfo(`Token: ${authToken.substring(0, 30)}...`);
    logInfo(`User ID: ${testUserId}`);
    logInfo(`Role: ${response.data.user.role}`);
    return true;
  } catch (error) {
    // If login fails, try to register and login
    logInfo("Existing user login failed, creating new test user...");
    try {
      const timestamp = Date.now();
      const testEmail = `testflow${timestamp}@example.com`;
      const testPassword = "Test123456";

      // Register
      await axios.post(`${API_BASE}/auth/register`, {
        email: testEmail,
        password: testPassword,
        fullName: "Test Flow User",
      });

      logInfo("New user registered, logging in...");

      // Login with new user
      const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
        email: testEmail,
        password: testPassword,
      });

      authToken = loginResponse.data.token;
      testUserId = loginResponse.data.user.id;

      logSuccess("Login successful with new user");
      logInfo(`Email: ${testEmail}`);
      logInfo(`Token: ${authToken.substring(0, 30)}...`);
      return true;
    } catch (registerError) {
      logError(
        `Register and login failed: ${
          registerError.response?.data?.error || registerError.message
        }`
      );
      return false;
    }
  }
}

// Test 3: Browse Products
async function testBrowseProducts() {
  logStep(3, "BROWSE PRODUCTS");
  try {
    const response = await axios.get(`${API_BASE}/products`);
    const products = Array.isArray(response.data)
      ? response.data
      : response.data.products;

    logSuccess(`Found ${products.length} products`);

    if (products.length > 0) {
      products.slice(0, 3).forEach((product, index) => {
        logInfo(
          `${index + 1}. ${product.name} - Rp ${product.price.toLocaleString(
            "id-ID"
          )} (${product.category})`
        );
        testProductIds.push(product.id);
      });
    }

    return products.length > 0;
  } catch (error) {
    logError(
      `Browse products failed: ${error.response?.data?.error || error.message}`
    );
    return false;
  }
}

// Test 4: Add products to cart (simulate localStorage)
async function testAddToCart() {
  logStep(4, "ADD PRODUCTS TO CART");

  if (testProductIds.length === 0) {
    logError("No products available to add to cart");
    return false;
  }

  // Simulate adding 2 products to cart
  const cart = [];
  for (let i = 0; i < Math.min(2, testProductIds.length); i++) {
    cart.push({
      id: Date.now() + i,
      product_id: testProductIds[i],
      quantity: i + 1,
    });
  }

  logSuccess(`Added ${cart.length} products to cart`);
  cart.forEach((item, index) => {
    logInfo(
      `${index + 1}. Product ID: ${item.product_id}, Quantity: ${item.quantity}`
    );
  });

  // Store in "memory" for checkout test
  global.testCart = cart;
  return true;
}

// Test 5: Checkout from cart
async function testCheckout() {
  logStep(5, "CHECKOUT WITH QRIS PAYMENT");

  if (!global.testCart || global.testCart.length === 0) {
    logError("Cart is empty");
    return false;
  }

  try {
    let successCount = 0;
    let failCount = 0;

    for (const item of global.testCart) {
      try {
        const response = await axios.post(
          `${API_BASE}/orders/checkout`,
          {
            productId: item.product_id,
            quantity: item.quantity,
            paymentMethod: "qris",
          },
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );

        testOrderIds.push(response.data.order.id);
        logSuccess(
          `Order created: #${response.data.order.id} - Product: ${item.product_id}, Qty: ${item.quantity}`
        );
        successCount++;
      } catch (error) {
        logError(
          `Failed to create order for product ${item.product_id}: ${
            error.response?.data?.error || error.message
          }`
        );
        failCount++;
      }

      await sleep(500); // Small delay between requests
    }

    logInfo(`Checkout summary: ${successCount} success, ${failCount} failed`);
    return successCount > 0;
  } catch (error) {
    logError(
      `Checkout failed: ${error.response?.data?.error || error.message}`
    );
    return false;
  }
}

// Test 6: View order history
async function testOrderHistory() {
  logStep(6, "VIEW ORDER HISTORY");
  try {
    const response = await axios.get(`${API_BASE}/orders/my-orders`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    const orders = response.data.data || response.data;

    logSuccess(`Found ${orders.length} orders in history`);

    if (orders.length > 0) {
      orders.slice(0, 5).forEach((order, index) => {
        logInfo(
          `${index + 1}. Order #${order.id} - ${order.product_name} (${
            order.product_category
          })`
        );
        logInfo(
          `   Status: ${order.status}, Payment: ${
            order.payment_status
          }, Total: Rp ${order.total_price.toLocaleString("id-ID")}`
        );
      });
    }

    return orders.length > 0;
  } catch (error) {
    logError(
      `View order history failed: ${
        error.response?.data?.error || error.message
      }`
    );
    return false;
  }
}

// Test 7: Verify order details
async function testVerifyOrders() {
  logStep(7, "VERIFY ORDER DETAILS");

  if (testOrderIds.length === 0) {
    logError("No orders to verify");
    return false;
  }

  try {
    let successCount = 0;

    for (const orderId of testOrderIds) {
      try {
        const response = await axios.get(`${API_BASE}/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        const order = response.data;
        logSuccess(`Order #${orderId} verified`);
        logInfo(
          `  Product ID: ${order.product_id}, Quantity: ${order.quantity}`
        );
        logInfo(
          `  Status: ${order.status}, Payment Status: ${order.payment_status}`
        );
        logInfo(`  Total: Rp ${order.total_price.toLocaleString("id-ID")}`);
        successCount++;
      } catch (error) {
        logError(
          `Failed to verify order #${orderId}: ${
            error.response?.data?.error || error.message
          }`
        );
      }
    }

    return successCount === testOrderIds.length;
  } catch (error) {
    logError(`Verify orders failed: ${error.message}`);
    return false;
  }
}

// Main test runner
async function runTests() {
  log("\n" + "=".repeat(80), "cyan");
  log("🚀 STARTING COMPLETE E-COMMERCE FLOW TEST", "cyan");
  log("=".repeat(80) + "\n", "cyan");

  const results = {
    total: 0,
    passed: 0,
    failed: 0,
  };

  const tests = [
    // { name: 'Register', fn: testRegister },
    { name: "Login", fn: testLogin },
    { name: "Browse Products", fn: testBrowseProducts },
    { name: "Add to Cart", fn: testAddToCart },
    { name: "Checkout", fn: testCheckout },
    { name: "Order History", fn: testOrderHistory },
    { name: "Verify Orders", fn: testVerifyOrders },
  ];

  for (const test of tests) {
    results.total++;
    const passed = await test.fn();
    if (passed) {
      results.passed++;
    } else {
      results.failed++;
    }
    await sleep(1000); // Delay between tests
  }

  // Print summary
  log("\n" + "=".repeat(80), "cyan");
  log("📊 TEST SUMMARY", "cyan");
  log("=".repeat(80), "cyan");
  log(`Total Tests: ${results.total}`, "blue");
  log(`Passed: ${results.passed}`, "green");
  log(`Failed: ${results.failed}`, results.failed > 0 ? "red" : "green");
  log(
    `Success Rate: ${((results.passed / results.total) * 100).toFixed(2)}%`,
    "yellow"
  );
  log("=".repeat(80) + "\n", "cyan");

  if (results.failed === 0) {
    log(
      "✅ ALL TESTS PASSED! E-commerce flow is working perfectly! 🎉",
      "green"
    );
  } else {
    log(
      `⚠️  ${results.failed} test(s) failed. Please check the errors above.`,
      "yellow"
    );
  }
}

// Run all tests
runTests().catch((error) => {
  logError(`Test runner failed: ${error.message}`);
  process.exit(1);
});
