# Premium App Marketplace - Microservices Architecture

Aplikasi marketplace berbasis microservices untuk penjualan akses aplikasi premium. Sistem ini memungkinkan pengguna untuk melihat daftar aplikasi premium, melakukan pemesanan, dan memantau status pembelian. Admin dapat mengelola data aplikasi, pengguna, dan transaksi.

## 📋 Daftar Isi

- [Arsitektur Sistem](#arsitektur-sistem)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Microservices](#microservices)
- [Instalasi](#instalasi)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [API Documentation](#api-documentation)
- [Testing](#testing)

## 🏗️ Arsitektur Sistem

Aplikasi ini menggunakan arsitektur microservices dengan komponen-komponen berikut:

```
┌─────────────────┐
│   API Gateway   │  (Port 3000)
│   Entry Point   │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼──────┐ ┌────────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ Auth  │ │ Product │ │   Order    │ │ Payment  │ │   User   │ │PostgreSQL│
│Service│ │ Service │ │  Service   │ │ Service  │ │ Service  │ │Databases │
│:3001  │ │  :3002  │ │   :3003    │ │  :3004   │ │  :3005   │ │  :5432   │
└───────┘ └─────────┘ └────────────┘ └──────────┘ └──────────┘ └──────────┘
```

## 🛠️ Teknologi yang Digunakan

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL 15
- **Authentication**: JWT (JSON Web Tokens)
- **Containerization**: Docker & Docker Compose
- **Validation**: Joi
- **Password Hashing**: bcryptjs

## 🚀 Microservices

### 1. API Gateway (Port 3000)

Entry point untuk semua request dari client. Menangani routing ke service yang sesuai dan melakukan autentikasi/autorisasi.

**Fitur:**

- Request routing
- Authentication middleware
- Rate limiting
- CORS handling

### 2. Auth Service (Port 3001)

Menangani autentikasi dan autorisasi pengguna.

**Endpoints:**

- `POST /register` - Registrasi pengguna baru
- `POST /login` - Login pengguna
- `POST /verify` - Verifikasi token JWT

### 3. Product Service (Port 3002)

Mengelola data aplikasi premium yang tersedia.

**Endpoints:**

- `GET /products` - Daftar semua produk (dengan pagination & filter)
- `GET /products/:id` - Detail produk
- `POST /products` - Tambah produk (admin only)
- `PUT /products/:id` - Update produk (admin only)
- `DELETE /products/:id` - Hapus produk (admin only)

### 4. Order Service (Port 3003)

Mengelola pemesanan dan status transaksi.

**Endpoints:**

- `POST /orders` - Buat order baru
- `GET /orders` - Daftar semua order (admin only)
- `GET /orders/:id` - Detail order
- `GET /orders/user/:userId` - Order berdasarkan user
- `PATCH /orders/:id/status` - Update status order (admin only)
- `DELETE /orders/:id` - Cancel order

### 5. Payment Service (Port 3004)

Mengelola proses pembayaran.

**Endpoints:**

- `POST /payments` - Inisiasi pembayaran
- `GET /payments` - Daftar pembayaran (admin only)
- `GET /payments/:id` - Detail pembayaran
- `POST /payments/:id/verify` - Verifikasi pembayaran
- `GET /payments/order/:orderId` - Pembayaran berdasarkan order

### 6. User Service (Port 3005)

Mengelola data profil pengguna.

**Endpoints:**

- `GET /users` - Daftar pengguna (admin only)
- `GET /users/:id` - Detail pengguna
- `PUT /users/:id` - Update profil
- `DELETE /users/:id` - Hapus pengguna (admin only)
- `GET /users/:id/stats` - Statistik pengguna

## 📦 Instalasi

### Prerequisites

- Node.js 18 atau lebih tinggi
- Docker & Docker Compose (untuk deployment)
- PostgreSQL 15 (jika menjalankan tanpa Docker)

### Clone Repository

```bash
git clone <repository-url>
cd tugas_besar
```

### Instalasi Dependencies

#### Dengan Docker (Recommended)

```bash
docker-compose up -d
```

#### Tanpa Docker

```bash
# Install dependencies untuk semua services
npm run install:all
```

## 🎮 Menjalankan Aplikasi

### Dengan Docker Compose (Recommended)

1. **Start semua services:**

```bash
docker-compose up -d
```

2. **Cek status:**

```bash
docker-compose ps
```

3. **Lihat logs:**

```bash
docker-compose logs -f
```

4. **Stop semua services:**

```bash
docker-compose down
```

### Tanpa Docker (Development Mode)

1. **Setup environment variables untuk setiap service:**

```bash
# Copy .env.example ke .env untuk setiap service
cp services/api-gateway/.env.example services/api-gateway/.env
cp services/auth-service/.env.example services/auth-service/.env
cp services/product-service/.env.example services/product-service/.env
cp services/order-service/.env.example services/order-service/.env
cp services/payment-service/.env.example services/payment-service/.env
cp services/user-service/.env.example services/user-service/.env
```

2. **Jalankan PostgreSQL:**

```bash
# Pastikan PostgreSQL sudah terinstall dan running
# Buat databases: auth_db, product_db, order_db, payment_db, user_db
```

3. **Jalankan setiap service di terminal terpisah:**

```bash
# Terminal 1 - API Gateway
npm run start:gateway

# Terminal 2 - Auth Service
npm run start:auth

# Terminal 3 - Product Service
npm run start:product

# Terminal 4 - Order Service
npm run start:order

# Terminal 5 - Payment Service
npm run start:payment

# Terminal 6 - User Service
npm run start:user
```

## 📚 API Documentation

### Base URL

```
http://localhost:3000/api
```

### Authentication

Kebanyakan endpoint memerlukan JWT token. Include token dalam header:

```
Authorization: Bearer <your-jwt-token>
```

### Contoh Request

#### 1. Register User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "fullName": "John Doe"
  }'
```

#### 2. Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

#### 3. Get Products

```bash
curl http://localhost:3000/api/products
```

#### 4. Create Order (Authenticated)

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "productId": 1,
    "quantity": 1,
    "totalPrice": 699000
  }'
```

#### 5. Create Payment (Authenticated)

```bash
curl -X POST http://localhost:3000/api/payments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "orderId": 1,
    "amount": 699000,
    "paymentMethod": "bank_transfer"
  }'
```

### Response Format

#### Success Response

```json
{
  "message": "Operation successful",
  "data": { ... }
}
```

#### Error Response

```json
{
  "error": "Error message"
}
```

## 🧪 Testing

### Health Check

Cek apakah semua services running:

```bash
# API Gateway
curl http://localhost:3000/health

# Auth Service
curl http://localhost:3001/health

# Product Service
curl http://localhost:3002/health

# Order Service
curl http://localhost:3003/health

# Payment Service
curl http://localhost:3004/health

# User Service
curl http://localhost:3005/health
```

### Flow Testing

#### Complete Purchase Flow:

1. **Register/Login:**

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","fullName":"Test User"}'

# Login
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  | jq -r '.token')
```

2. **Browse Products:**

```bash
curl http://localhost:3000/api/products
```

3. **Create Order:**

```bash
ORDER=$(curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"productId":1,"quantity":1,"totalPrice":699000}')
```

4. **Make Payment:**

```bash
PAYMENT=$(curl -X POST http://localhost:3000/api/payments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"orderId":1,"amount":699000,"paymentMethod":"bank_transfer"}')
```

5. **Verify Payment:**

```bash
curl -X POST http://localhost:3000/api/payments/1/verify \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"paymentReference":"PAY-xxx"}'
```

## 🔐 Security

- Passwords di-hash menggunakan bcryptjs
- JWT untuk autentikasi stateless
- Rate limiting untuk mencegah abuse
- CORS protection
- Helmet untuk security headers
- Input validation dengan Joi

## 📊 Database Schema

### Auth Service

- **users**: id, email, password, full_name, role, created_at, updated_at

### Product Service

- **products**: id, name, description, category, price, features, image_url, created_at, updated_at

### Order Service

- **orders**: id, user_id, product_id, quantity, total_price, status, created_at, updated_at

### Payment Service

- **payments**: id, user_id, order_id, amount, payment_method, payment_reference, status, verified_at, created_at, updated_at

### User Service

- **users**: id, email, full_name, phone, address, role, created_at, updated_at

## 🤝 Contributing

1. Fork repository
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📝 License

MIT License

## 👥 Authors

- Nama Anda - Tugas Besar Web Service

## 🙏 Acknowledgments

- Express.js Documentation
- PostgreSQL Documentation
- Docker Documentation
- Microservices Architecture Patterns
