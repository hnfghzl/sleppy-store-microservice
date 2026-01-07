# API Documentation - Premium App Marketplace

## Table of Contents

1. [Authentication](#authentication)
2. [Products](#products)
3. [Orders](#orders)
4. [Payments](#payments)
5. [Users](#users)

## Base URL

```
http://localhost:3000/api
```

---

## Authentication

### Register User

**Endpoint:** `POST /auth/register`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "role": "user" // optional: "user" or "admin"
}
```

**Response (201):**

```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "fullName": "John Doe",
    "role": "user"
  }
}
```

### Login

**Endpoint:** `POST /auth/login`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "fullName": "John Doe",
    "role": "user"
  }
}
```

### Verify Token

**Endpoint:** `POST /auth/verify`

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "valid": true,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "user"
  }
}
```

---

## Products

### Get All Products

**Endpoint:** `GET /products`

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `category` (optional): Filter by category
- `search` (optional): Search in name and description

**Response (200):**

```json
{
  "products": [
    {
      "id": 1,
      "name": "Adobe Creative Cloud",
      "description": "Suite lengkap aplikasi kreatif",
      "category": "Design",
      "price": 699000,
      "features": ["Photoshop", "Illustrator"],
      "image_url": "https://...",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  }
}
```

### Get Product by ID

**Endpoint:** `GET /products/:id`

**Response (200):**

```json
{
  "id": 1,
  "name": "Adobe Creative Cloud",
  "description": "Suite lengkap aplikasi kreatif",
  "category": "Design",
  "price": 699000,
  "features": ["Photoshop", "Illustrator"],
  "image_url": "https://...",
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Create Product (Admin Only)

**Endpoint:** `POST /products`

**Headers:**

```
Authorization: Bearer <admin-token>
```

**Request Body:**

```json
{
  "name": "New App",
  "description": "App description",
  "category": "Productivity",
  "price": 99000,
  "features": ["Feature 1", "Feature 2"],
  "imageUrl": "https://..."
}
```

**Response (201):**

```json
{
  "message": "Product created successfully",
  "product": {
    "id": 6,
    "name": "New App",
    "description": "App description",
    "category": "Productivity",
    "price": 99000,
    "features": ["Feature 1", "Feature 2"],
    "image_url": "https://...",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### Update Product (Admin Only)

**Endpoint:** `PUT /products/:id`

**Headers:**

```
Authorization: Bearer <admin-token>
```

**Request Body:**

```json
{
  "name": "Updated App",
  "description": "Updated description",
  "category": "Productivity",
  "price": 89000,
  "features": ["Feature 1", "Feature 2"],
  "imageUrl": "https://..."
}
```

### Delete Product (Admin Only)

**Endpoint:** `DELETE /products/:id`

**Headers:**

```
Authorization: Bearer <admin-token>
```

**Response (200):**

```json
{
  "message": "Product deleted successfully"
}
```

---

## Orders

### Create Order

**Endpoint:** `POST /orders`

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "productId": 1,
  "quantity": 1,
  "totalPrice": 699000
}
```

**Response (201):**

```json
{
  "message": "Order created successfully",
  "order": {
    "id": 1,
    "user_id": 1,
    "product_id": 1,
    "quantity": 1,
    "total_price": 699000,
    "status": "pending",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### Get My Orders

**Endpoint:** `GET /orders/my-orders`

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200):**

```json
[
  {
    "id": 1,
    "user_id": 1,
    "product_id": 1,
    "quantity": 1,
    "total_price": 699000,
    "status": "pending",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

### Get Order by ID

**Endpoint:** `GET /orders/:id`

**Headers:**

```
Authorization: Bearer <token>
```

### Get All Orders (Admin Only)

**Endpoint:** `GET /orders`

**Headers:**

```
Authorization: Bearer <admin-token>
```

**Query Parameters:**

- `page` (optional): Page number
- `limit` (optional): Items per page
- `status` (optional): Filter by status

### Update Order Status (Admin Only)

**Endpoint:** `PATCH /orders/:id/status`

**Headers:**

```
Authorization: Bearer <admin-token>
```

**Request Body:**

```json
{
  "status": "completed"
}
```

**Status values:** `pending`, `paid`, `processing`, `completed`, `cancelled`

---

## Payments

### Create Payment

**Endpoint:** `POST /payments`

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "orderId": 1,
  "amount": 699000,
  "paymentMethod": "bank_transfer"
}
```

**Payment Methods:** `credit_card`, `bank_transfer`, `e-wallet`, `virtual_account`

**Response (201):**

```json
{
  "message": "Payment initiated successfully",
  "payment": {
    "id": 1,
    "user_id": 1,
    "order_id": 1,
    "amount": 699000,
    "payment_method": "bank_transfer",
    "payment_reference": "PAY-1234567890-ABC123",
    "status": "pending",
    "created_at": "2024-01-01T00:00:00Z"
  },
  "instructions": {
    "paymentReference": "PAY-1234567890-ABC123",
    "amount": 699000,
    "paymentMethod": "bank_transfer",
    "note": "Please complete the payment and verify using the payment reference"
  }
}
```

### Get Payment by ID

**Endpoint:** `GET /payments/:id`

**Headers:**

```
Authorization: Bearer <token>
```

### Verify Payment

**Endpoint:** `POST /payments/:id/verify`

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "paymentReference": "PAY-1234567890-ABC123"
}
```

**Response (200):**

```json
{
  "message": "Payment verified successfully",
  "payment": {
    "id": 1,
    "user_id": 1,
    "order_id": 1,
    "amount": 699000,
    "payment_method": "bank_transfer",
    "payment_reference": "PAY-1234567890-ABC123",
    "status": "completed",
    "verified_at": "2024-01-01T00:01:00Z"
  }
}
```

### Get All Payments (Admin Only)

**Endpoint:** `GET /payments`

**Headers:**

```
Authorization: Bearer <admin-token>
```

---

## Users

### Get Current User Profile

**Endpoint:** `GET /users/me`

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "id": 1,
  "email": "user@example.com",
  "full_name": "John Doe",
  "phone": "+628123456789",
  "address": "Jakarta, Indonesia",
  "role": "user",
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Update Current User Profile

**Endpoint:** `PUT /users/me`

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "fullName": "John Doe Updated",
  "phone": "+628123456789",
  "address": "Jakarta, Indonesia"
}
```

### Get All Users (Admin Only)

**Endpoint:** `GET /users`

**Headers:**

```
Authorization: Bearer <admin-token>
```

**Query Parameters:**

- `page` (optional): Page number
- `limit` (optional): Items per page
- `role` (optional): Filter by role

### Get User by ID (Admin Only)

**Endpoint:** `GET /users/:id`

**Headers:**

```
Authorization: Bearer <admin-token>
```

### Delete User (Admin Only)

**Endpoint:** `DELETE /users/:id`

**Headers:**

```
Authorization: Bearer <admin-token>
```

---

## Error Responses

### 400 Bad Request

```json
{
  "error": "Validation error message"
}
```

### 401 Unauthorized

```json
{
  "error": "Invalid token"
}
```

### 403 Forbidden

```json
{
  "error": "Access denied. Admin only."
}
```

### 404 Not Found

```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal server error"
}
```
