# 📋 TODO LIST - Premium App Marketplace Microservices

## ✅ FASE 1: PERSIAPAN ENVIRONMENT (COMPLETED)

- [x] Setup struktur project microservices
- [x] Buat docker-compose.yml untuk MySQL
- [x] Buat package.json untuk semua services
- [x] Buat Dockerfile untuk setiap service
- [x] Buat file .env.example untuk konfigurasi

---

## 🔧 FASE 2: SETUP DEVELOPMENT ENVIRONMENT

### 2.1 Install Prerequisites

- [ ] Install Node.js (v18 atau lebih tinggi)
- [ ] Install MySQL Server atau XAMPP
- [ ] Install Docker Desktop (opsional, untuk deployment)
- [ ] Install Postman atau Thunder Client (untuk testing API)
- [ ] Install Git (untuk version control)

### 2.2 Setup Database

- [ ] Start MySQL Server
- [ ] Buat 5 database:
  - [ ] `CREATE DATABASE auth_db;`
  - [ ] `CREATE DATABASE product_db;`
  - [ ] `CREATE DATABASE order_db;`
  - [ ] `CREATE DATABASE payment_db;`
  - [ ] `CREATE DATABASE user_db;`
- [ ] Verifikasi database sudah terbuat dengan `SHOW DATABASES;`

### 2.3 Setup Project

- [ ] Clone atau extract project ke folder kerja
- [ ] Copy semua file `.env.example` menjadi `.env`:
  ```cmd
  copy services\api-gateway\.env.example services\api-gateway\.env
  copy services\auth-service\.env.example services\auth-service\.env
  copy services\product-service\.env.example services\product-service\.env
  copy services\order-service\.env.example services\order-service\.env
  copy services\payment-service\.env.example services\payment-service\.env
  copy services\user-service\.env.example services\user-service\.env
  ```
- [ ] Edit file `.env` sesuai konfigurasi MySQL Anda (username, password)
- [ ] Install dependencies untuk semua services:
  ```cmd
  cd services\api-gateway && npm install && cd ..\..
  cd services\auth-service && npm install && cd ..\..
  cd services\product-service && npm install && cd ..\..
  cd services\order-service && npm install && cd ..\..
  cd services\payment-service && npm install && cd ..\..
  cd services\user-service && npm install && cd ..\..
  ```

---

## 🚀 FASE 3: TESTING INDIVIDUAL SERVICES

### 3.1 Test Auth Service (Port 3001)

- [ ] Jalankan service: `cd services\auth-service && npm start`
- [ ] Test health check: `http://localhost:3001/health`
- [ ] Test register user:
  ```json
  POST http://localhost:3001/register
  {
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User"
  }
  ```
- [ ] Test login:
  ```json
  POST http://localhost:3001/login
  {
    "email": "test@example.com",
    "password": "password123"
  }
  ```
- [ ] Simpan token yang didapat untuk testing selanjutnya
- [ ] Verifikasi data masuk ke database `auth_db`

### 3.2 Test Product Service (Port 3002)

- [ ] Jalankan service: `cd services\product-service && npm start`
- [ ] Test health check: `http://localhost:3002/health`
- [ ] Test get all products: `GET http://localhost:3002/products`
- [ ] Test get product by ID: `GET http://localhost:3002/products/1`
- [ ] Verifikasi sample data sudah masuk (5 produk)
- [ ] Test pagination: `GET http://localhost:3002/products?page=1&limit=3`
- [ ] Test search: `GET http://localhost:3002/products?search=adobe`
- [ ] Test filter category: `GET http://localhost:3002/products?category=Design`

### 3.3 Test Order Service (Port 3003)

- [ ] Jalankan service: `cd services\order-service && npm start`
- [ ] Test health check: `http://localhost:3003/health`
- [ ] Test create order:
  ```json
  POST http://localhost:3003/orders
  {
    "userId": 1,
    "productId": 1,
    "quantity": 1,
    "totalPrice": 699000
  }
  ```
- [ ] Test get order by ID: `GET http://localhost:3003/orders/1`
- [ ] Test get orders by user: `GET http://localhost:3003/orders/user/1`

### 3.4 Test Payment Service (Port 3004)

- [ ] Jalankan service: `cd services\payment-service && npm start`
- [ ] Test health check: `http://localhost:3004/health`
- [ ] Test create payment:
  ```json
  POST http://localhost:3004/payments
  {
    "userId": 1,
    "orderId": 1,
    "amount": 699000,
    "paymentMethod": "bank_transfer"
  }
  ```
- [ ] Simpan payment reference dari response
- [ ] Test verify payment:
  ```json
  POST http://localhost:3004/payments/1/verify
  {
    "paymentReference": "PAY-xxx"
  }
  ```
- [ ] Verifikasi status order berubah menjadi "paid"

### 3.5 Test User Service (Port 3005)

- [ ] Jalankan service: `cd services\user-service && npm start`
- [ ] Test health check: `http://localhost:3005/health`
- [ ] Test get user: `GET http://localhost:3005/users/1`
- [ ] Test update user:
  ```json
  PUT http://localhost:3005/users/1
  {
    "fullName": "Updated Name",
    "phone": "+628123456789",
    "address": "Jakarta, Indonesia"
  }
  ```

---

## 🌐 FASE 4: TESTING MELALUI API GATEWAY

### 4.1 Jalankan Semua Services

- [ ] Buka 6 terminal/command prompt
- [ ] Terminal 1: API Gateway (Port 3000)
- [ ] Terminal 2: Auth Service (Port 3001)
- [ ] Terminal 3: Product Service (Port 3002)
- [ ] Terminal 4: Order Service (Port 3003)
- [ ] Terminal 5: Payment Service (Port 3004)
- [ ] Terminal 6: User Service (Port 3005)
- [ ] Verifikasi semua service running tanpa error

### 4.2 Test Complete User Flow (Via Gateway)

Base URL: `http://localhost:3000/api`

**Step 1: Register & Login**

- [ ] Register user baru:
  ```json
  POST /api/auth/register
  {
    "email": "customer@example.com",
    "password": "customer123",
    "fullName": "Customer User"
  }
  ```
- [ ] Login:
  ```json
  POST /api/auth/login
  {
    "email": "customer@example.com",
    "password": "customer123"
  }
  ```
- [ ] Simpan token dari response

**Step 2: Browse Products**

- [ ] Get all products: `GET /api/products`
- [ ] Get product detail: `GET /api/products/1`
- [ ] Test search: `GET /api/products?search=office`
- [ ] Test filter: `GET /api/products?category=Entertainment`

**Step 3: Create Order (Authenticated)**

- [ ] Create order dengan token:
  ```json
  POST /api/orders
  Headers: Authorization: Bearer <token>
  {
    "productId": 2,
    "quantity": 1,
    "totalPrice": 129000
  }
  ```
- [ ] Get my orders: `GET /api/orders/my-orders` (with token)
- [ ] Verifikasi order detail

**Step 4: Payment Process**

- [ ] Create payment:
  ```json
  POST /api/payments
  Headers: Authorization: Bearer <token>
  {
    "orderId": 1,
    "amount": 129000,
    "paymentMethod": "bank_transfer"
  }
  ```
- [ ] Catat payment reference
- [ ] Verify payment:
  ```json
  POST /api/payments/1/verify
  Headers: Authorization: Bearer <token>
  {
    "paymentReference": "PAY-xxx"
  }
  ```
- [ ] Verifikasi order status berubah ke "paid"

**Step 5: User Profile Management**

- [ ] Get profile: `GET /api/users/me` (with token)
- [ ] Update profile:
  ```json
  PUT /api/users/me
  Headers: Authorization: Bearer <token>
  {
    "fullName": "Updated Customer",
    "phone": "+6281234567890",
    "address": "Jl. Example No. 123, Jakarta"
  }
  ```

### 4.3 Test Admin Flow (Via Gateway)

- [ ] Register admin user:
  ```json
  POST /api/auth/register
  {
    "email": "admin@example.com",
    "password": "admin123",
    "fullName": "Admin User",
    "role": "admin"
  }
  ```
- [ ] Login sebagai admin dan simpan token

**Admin - Product Management**

- [ ] Create new product:
  ```json
  POST /api/products
  Headers: Authorization: Bearer <admin-token>
  {
    "name": "Grammarly Premium",
    "description": "AI-powered writing assistant",
    "category": "Productivity",
    "price": 149000,
    "features": ["Grammar check", "Plagiarism detector", "Tone suggestions"],
    "imageUrl": "https://via.placeholder.com/300"
  }
  ```
- [ ] Update product:
  ```json
  PUT /api/products/6
  Headers: Authorization: Bearer <admin-token>
  {
    "name": "Grammarly Premium Updated",
    "description": "Updated description",
    "category": "Productivity",
    "price": 139000,
    "features": ["Grammar check", "Plagiarism detector"],
    "imageUrl": "https://via.placeholder.com/300"
  }
  ```
- [ ] Get all orders: `GET /api/orders` (with admin token)
- [ ] Update order status:
  ```json
  PATCH /api/orders/1/status
  Headers: Authorization: Bearer <admin-token>
  {
    "status": "completed"
  }
  ```
- [ ] Get all payments: `GET /api/payments` (with admin token)
- [ ] Get all users: `GET /api/users` (with admin token)
- [ ] Delete user: `DELETE /api/users/3` (with admin token)

---

## 🔐 FASE 5: TESTING SECURITY & VALIDATION

### 5.1 Test Authentication

- [ ] Test access protected endpoint tanpa token (harus dapat 401)
- [ ] Test dengan token invalid (harus dapat 401)
- [ ] Test dengan token expired (jika sudah expired)
- [ ] Verifikasi user biasa tidak bisa akses admin endpoint (harus dapat 403)

### 5.2 Test Input Validation

- [ ] Test register dengan email invalid
- [ ] Test register dengan password < 6 karakter
- [ ] Test create product dengan price negatif
- [ ] Test create order dengan quantity 0 atau negatif
- [ ] Test payment dengan amount tidak sesuai order

### 5.3 Test Error Handling

- [ ] Test get product dengan ID tidak ada (harus dapat 404)
- [ ] Test get order yang bukan milik user (harus dapat 403)
- [ ] Test cancel order yang sudah completed
- [ ] Test verify payment dengan reference salah

---

## 📊 FASE 6: TESTING EDGE CASES

### 6.1 Test Data Consistency

- [ ] Buat order, lalu cek di order service dan payment service
- [ ] Verify payment, cek status order berubah
- [ ] Test pagination dengan berbagai kombinasi page & limit
- [ ] Test dengan data kosong (tabel kosong)

### 6.2 Test Concurrency (Opsional)

- [ ] Buat multiple orders bersamaan
- [ ] Login multiple users bersamaan
- [ ] Test rate limiting (jika sudah implement)

---

## 🐳 FASE 7: DOCKER DEPLOYMENT (Opsional)

### 7.1 Build Docker Images

- [ ] Build semua services:
  ```cmd
  docker compose build
  ```
- [ ] Verifikasi images terbuat: `docker images`

### 7.2 Run dengan Docker

- [ ] Start semua containers:
  ```cmd
  docker compose up -d
  ```
- [ ] Check status: `docker compose ps`
- [ ] View logs: `docker compose logs -f`
- [ ] Test semua endpoint via gateway
- [ ] Stop containers: `docker compose down`

---

## 📝 FASE 8: DOKUMENTASI & FINALISASI

### 8.1 Buat Dokumentasi

- [ ] Baca dan pahami README.md
- [ ] Baca API_DOCS.md untuk referensi endpoint
- [ ] Baca ARCHITECTURE.md untuk memahami arsitektur
- [ ] Import POSTMAN_COLLECTION.md ke Postman
- [ ] Buat catatan troubleshooting untuk masalah yang ditemui

### 8.2 Code Review

- [ ] Review kode di setiap service
- [ ] Pahami flow data antar service
- [ ] Pahami struktur database di setiap service
- [ ] Pahami authentication flow dengan JWT
- [ ] Pahami role-based access control (user vs admin)

### 8.3 Testing Checklist Final

- [ ] ✅ Semua service bisa running tanpa error
- [ ] ✅ Database terbuat dan terisi data
- [ ] ✅ User bisa register dan login
- [ ] ✅ User bisa browse dan search products
- [ ] ✅ User bisa create order
- [ ] ✅ User bisa melakukan payment
- [ ] ✅ Payment verification update order status
- [ ] ✅ Admin bisa CRUD products
- [ ] ✅ Admin bisa view all orders/payments/users
- [ ] ✅ Authentication & authorization bekerja
- [ ] ✅ Input validation bekerja
- [ ] ✅ Error handling bekerja dengan baik

---

## 🐛 FASE 9: TROUBLESHOOTING CHECKLIST

### Common Issues & Solutions

**Issue: Service tidak bisa connect ke database**

- [ ] Cek MySQL service sudah running
- [ ] Cek credentials di file .env
- [ ] Cek database sudah dibuat
- [ ] Cek port 3306 tidak bentrok

**Issue: "Cannot find module"**

- [ ] Jalankan `npm install` di folder service tersebut
- [ ] Cek package.json ada dependencies yang dibutuhkan
- [ ] Delete node_modules dan install ulang

**Issue: Port already in use**

- [ ] Cek port tidak digunakan aplikasi lain
- [ ] Kill process yang menggunakan port: `netstat -ano | findstr :<port>`
- [ ] Ganti port di file .env jika perlu

**Issue: Token invalid/expired**

- [ ] Login ulang untuk mendapat token baru
- [ ] Cek JWT_SECRET sama di semua service
- [ ] Cek format Authorization header: `Bearer <token>`

**Issue: CORS error**

- [ ] Pastikan API Gateway sudah enable CORS
- [ ] Cek origin request sesuai dengan CORS config

---

## 🎯 FASE 10: ENHANCEMENT IDEAS (Future)

### Fitur Tambahan yang Bisa Ditambahkan:

- [ ] Email notification service
- [ ] File upload untuk product images
- [ ] Reset password functionality
- [ ] Refresh token mechanism
- [ ] Admin dashboard (frontend)
- [ ] Customer dashboard (frontend)
- [ ] Real-time notifications dengan WebSocket
- [ ] Payment gateway integration (Midtrans, Xendit)
- [ ] Order tracking system
- [ ] Review & rating system
- [ ] Wishlist functionality
- [ ] Discount/coupon system
- [ ] Transaction history export (PDF/Excel)
- [ ] Automated testing (Jest, Mocha)
- [ ] API documentation dengan Swagger
- [ ] Monitoring dengan Prometheus & Grafana
- [ ] Logging dengan ELK Stack
- [ ] CI/CD pipeline dengan GitHub Actions

---

## 📈 PROGRESS TRACKER

**Overall Progress: 20%**

- ✅ FASE 1: PERSIAPAN ENVIRONMENT (100%)
- ⏳ FASE 2: SETUP DEVELOPMENT ENVIRONMENT (0%)
- ⏳ FASE 3: TESTING INDIVIDUAL SERVICES (0%)
- ⏳ FASE 4: TESTING MELALUI API GATEWAY (0%)
- ⏳ FASE 5: TESTING SECURITY & VALIDATION (0%)
- ⏳ FASE 6: TESTING EDGE CASES (0%)
- ⏳ FASE 7: DOCKER DEPLOYMENT (0%)
- ⏳ FASE 8: DOKUMENTASI & FINALISASI (0%)
- ⏳ FASE 9: TROUBLESHOOTING (0%)
- ⏳ FASE 10: ENHANCEMENT IDEAS (0%)

---

## 🎓 LEARNING OBJECTIVES

Setelah menyelesaikan semua fase, Anda harus memahami:

✅ **Microservices Architecture**

- Konsep separation of concerns
- Inter-service communication
- Database per service pattern
- API Gateway pattern

✅ **RESTful API Design**

- HTTP methods (GET, POST, PUT, DELETE, PATCH)
- Status codes (200, 201, 400, 401, 403, 404, 500)
- Request/Response structure
- API versioning

✅ **Authentication & Authorization**

- JWT token generation & verification
- Password hashing dengan bcrypt
- Role-based access control
- Protected routes

✅ **Database Design**

- Relational database concepts
- Table relationships
- CRUD operations
- SQL queries dengan MySQL

✅ **Node.js & Express.js**

- Routing
- Middleware
- Error handling
- Environment variables
- Async/await patterns

✅ **Docker & Containerization**

- Dockerfile
- Docker Compose
- Container networking
- Volume management

✅ **Testing & Debugging**

- API testing dengan Postman
- Log analysis
- Error troubleshooting
- Data validation

---

**Good luck! 🚀**

_Catatan: Checklist ini bisa disesuaikan dengan kebutuhan dan deadline tugas Anda._
