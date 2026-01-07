# 🧪 E-COMMERCE COMPLETE FLOW - MANUAL TEST CHECKLIST

## ✅ Prerequisites

- [ ] MySQL server running on port 3307
- [ ] All databases created (auth_db, product_db, order_db)
- [ ] All 6 microservices running (ports 3000-3005)
- [ ] Frontend running on port 3006

## 📋 Test Scenarios

### 1️⃣ CUSTOMER REGISTRATION & LOGIN

**Objective**: Verify user can register and login successfully

#### Test Steps:

1. [ ] Open browser: `http://localhost:3006/register`
2. [ ] Fill registration form:
   - Full Name: `Test Customer`
   - Email: `testcustomer@example.com`
   - Password: `Test123456`
   - Confirm Password: `Test123456`
3. [ ] Click "Register" button
4. [ ] Verify redirect to `/customer` page
5. [ ] Logout
6. [ ] Go to `http://localhost:3006/login`
7. [ ] Login with registered credentials
8. [ ] Verify successful login and redirect to customer page

**Expected Result**:

- ✅ Registration successful
- ✅ Auto-redirect to customer page after registration
- ✅ Can login with same credentials
- ✅ Redirected to `/customer` after login

---

### 2️⃣ BROWSE PRODUCTS

**Objective**: Verify customer can view all available products

#### Test Steps:

1. [ ] After login, verify you're on `/customer` page
2. [ ] Check if products are displayed
3. [ ] Verify product information shown:
   - [ ] Product name
   - [ ] Category badge
   - [ ] Description
   - [ ] Price in Rupiah format
   - [ ] "Add to Cart" button
4. [ ] Test category filter:
   - [ ] Click "All Categories"
   - [ ] Click "Design"
   - [ ] Click "Streaming"
   - [ ] Click "Games"
   - [ ] Click "Study"
5. [ ] Verify filtering works correctly

**Expected Result**:

- ✅ All products displayed in grid layout
- ✅ Product cards show complete information
- ✅ Category filter works correctly
- ✅ Price formatted as Rp XXX,XXX

---

### 3️⃣ ADD TO CART

**Objective**: Verify shopping cart functionality

#### Test Steps:

1. [ ] Click "Add to Cart" on first product (e.g., Spotify)
2. [ ] Verify alert shows: "Product added to cart!"
3. [ ] Verify cart badge shows "1" in the header
4. [ ] Click "Add to Cart" on second product (e.g., Netflix)
5. [ ] Verify cart badge updates to "2"
6. [ ] Click "Add to Cart" on same product again
7. [ ] Verify cart badge increases (quantity should increase)

**Expected Result**:

- ✅ Alert confirmation after adding product
- ✅ Cart badge displays total quantity
- ✅ Badge updates in real-time
- ✅ Can add same product multiple times

---

### 4️⃣ VIEW CART

**Objective**: Verify cart page displays correct items and allows modifications

#### Test Steps:

1. [ ] Click "Cart" button in header
2. [ ] Verify redirect to `/customer/cart`
3. [ ] Check cart items display:
   - [ ] Product name
   - [ ] Product price
   - [ ] Quantity with +/- buttons
   - [ ] Remove button (trash icon)
4. [ ] Test quantity increase:
   - [ ] Click "+" button on first item
   - [ ] Verify quantity increases
   - [ ] Verify total price updates
5. [ ] Test quantity decrease:
   - [ ] Click "-" button on first item
   - [ ] Verify quantity decreases
   - [ ] Verify total price updates
6. [ ] Test remove item:
   - [ ] Click trash icon on one item
   - [ ] Verify item removed from cart
7. [ ] Verify Order Summary shows:
   - [ ] Subtotal
   - [ ] Total items count
   - [ ] Total price

**Expected Result**:

- ✅ All cart items displayed correctly
- ✅ Quantity controls work properly
- ✅ Total price calculated correctly
- ✅ Remove item works
- ✅ Order summary accurate

---

### 5️⃣ CHECKOUT WITH QRIS

**Objective**: Verify complete checkout flow with QRIS payment

#### Test Steps:

1. [ ] On cart page, click "Proceed to Checkout"
2. [ ] Verify QRIS payment modal opens
3. [ ] Check modal displays:
   - [ ] Total items count
   - [ ] Total amount in Rupiah
   - [ ] QRIS QR code image
   - [ ] E-wallet logos (GP, OV, DA)
   - [ ] "Cancel" and "Confirm Payment" buttons
4. [ ] Verify QR code is visible and loads
5. [ ] Click "Confirm Payment" button
6. [ ] Wait for processing
7. [ ] Verify success alert: "Payment successful! All orders completed."
8. [ ] Verify redirect to `/customer/orders` page

**Expected Result**:

- ✅ Modal opens with correct information
- ✅ QR code displays properly
- ✅ Payment processes successfully
- ✅ Multiple orders created (one per cart item)
- ✅ Cart cleared after payment
- ✅ Redirected to order history

---

### 6️⃣ VIEW ORDER HISTORY

**Objective**: Verify order history displays complete order information

#### Test Steps:

1. [ ] On orders page, verify orders are displayed
2. [ ] Check each order card shows:
   - [ ] Order ID
   - [ ] Order status badge (COMPLETED = green)
   - [ ] Payment status badge (PAID = blue)
   - [ ] Order date and time
   - [ ] Product image/icon
   - [ ] Product name
   - [ ] Product category badge
   - [ ] Quantity
   - [ ] Payment method (QRIS)
   - [ ] Total price in Rupiah
3. [ ] Verify orders sorted by date (newest first)
4. [ ] Verify all completed orders from checkout are shown

**Expected Result**:

- ✅ All orders displayed with complete details
- ✅ Product names shown (not just IDs)
- ✅ Status badges color-coded correctly
- ✅ Payment information visible
- ✅ Date formatted properly

---

### 7️⃣ NAVIGATION & UI

**Objective**: Verify all navigation links work correctly

#### Test Steps:

1. [ ] From orders page, click "Continue Shopping"
   - [ ] Verify redirect to `/customer`
2. [ ] Click "Cart" in header
   - [ ] Verify redirect to `/customer/cart`
3. [ ] Click "My Orders" in header
   - [ ] Verify redirect to `/customer/orders`
4. [ ] On cart page, test "Continue Shopping" button
   - [ ] Verify redirect to `/customer`
5. [ ] Test logout button
   - [ ] Click "Logout"
   - [ ] Verify redirect to `/login`
   - [ ] Verify cannot access customer pages without login

**Expected Result**:

- ✅ All navigation links work
- ✅ Cart badge persists across pages
- ✅ Logout clears session
- ✅ Protected routes require authentication

---

### 8️⃣ EDGE CASES

**Objective**: Test error handling and edge cases

#### Test Steps:

1. [ ] **Empty Cart Checkout**:
   - [ ] Clear all items from cart
   - [ ] Verify "Cart is empty" message shown
   - [ ] Verify cannot checkout
2. [ ] **Page Refresh**:
   - [ ] Add items to cart
   - [ ] Refresh browser
   - [ ] Verify cart items persist (localStorage)
3. [ ] **Multiple Products Same Category**:
   - [ ] Add 3+ products from same category
   - [ ] Verify all added correctly
4. [ ] **Large Quantity**:
   - [ ] Increase product quantity to 10+
   - [ ] Verify price calculation correct
5. [ ] **Network Error Simulation**:
   - [ ] Stop order-service
   - [ ] Try to checkout
   - [ ] Verify error message shown
   - [ ] Restart service

**Expected Result**:

- ✅ Appropriate error messages shown
- ✅ Cart persists on refresh
- ✅ No calculation errors
- ✅ Graceful error handling

---

## 🎯 ADMIN FUNCTIONALITY (BONUS)

**Objective**: Verify admin can manage orders and view customer orders

#### Test Steps:

1. [ ] Logout from customer account
2. [ ] Login as admin: `admin@admin.com` / `admin123`
3. [ ] Navigate to Orders management
4. [ ] Verify can see all customer orders
5. [ ] Verify order details display correctly
6. [ ] Test order status filter (if available)

**Expected Result**:

- ✅ Admin sees all orders from all users
- ✅ Can view order details
- ✅ Orders include customer information

---

## 📊 TEST RESULTS

### Summary

- **Total Test Cases**: ~50 test points
- **Passed**: **\_** / 50
- **Failed**: **\_** / 50
- **Blocked**: **\_** / 50

### Issues Found

1.
2.
3.

### Notes

-
-
-

---

## 🚀 AUTOMATED API TESTS

Run automated tests:

```bash
node test-complete-flow.js
```

Run quick service check:

```bash
test-flow.bat
```

---

## ✅ FINAL VERIFICATION

- [ ] All microservices running stable
- [ ] No console errors in browser
- [ ] No 500 errors in API responses
- [ ] Cart functionality complete
- [ ] Payment flow works end-to-end
- [ ] Order history accurate
- [ ] UI/UX smooth and responsive

---

## 📝 SIGN-OFF

**Tester Name**: **********\_**********
**Test Date**: **********\_**********
**Test Result**: ⬜ PASS ⬜ FAIL
**Comments**:

---

---

---
