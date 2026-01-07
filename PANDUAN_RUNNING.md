# 🚀 Panduan Menjalankan Backend Microservices

## 📋 Prerequisites

Sebelum menjalankan aplikasi, pastikan sudah terinstall:

- ✅ **Node.js** v18 atau lebih tinggi
- ✅ **Laragon** (atau MySQL Server)
- ✅ **Git** (opsional)

---

## ⚙️ Setup Awal

### 1. Install Dependencies

Buka terminal dan jalankan perintah berikut di root folder project:

```cmd
npm install
```

Atau install per service:

```cmd
cd services/api-gateway && npm install
cd ../auth-service && npm install
cd ../product-service && npm install
cd ../order-service && npm install
cd ../payment-service && npm install
cd ../user-service && npm install
```

---

### 2. Setup Database MySQL

#### A. Start MySQL di Laragon

1. Buka **Laragon**
2. Klik **Start All**
3. Tunggu sampai MySQL berwarna hijau (started)
4. Catat port MySQL (biasanya **3307** untuk Laragon)

#### B. Import Database

1. Buka **HeidiSQL** dari Laragon (klik menu Database)
2. Klik tab **Query**
3. Buka file `setup_database.sql`
4. Copy seluruh isi file
5. Paste ke query editor
6. Klik **Execute** (F9)

Atau via phpMyAdmin:

1. Buka http://localhost/phpmyadmin
2. Klik tab **SQL**
3. Copy isi `setup_database.sql`
4. Paste dan klik **Go**

#### C. Verifikasi Database

Pastikan 5 database sudah terbuat:

- ✅ `auth_db`
- ✅ `product_db` (berisi 5 sample products)
- ✅ `order_db`
- ✅ `payment_db`
- ✅ `user_db`

---

### 3. Konfigurasi Environment Variables

File `.env` sudah dibuat otomatis di setiap service dengan konfigurasi:

```env
# MySQL Configuration
DB_HOST=localhost
DB_PORT=3307
DB_USER=root
DB_PASSWORD=
DB_NAME=<nama_database>

# Service Port
PORT=<port_number>
```

**Catatan:** Jika MySQL Anda menggunakan port **3306** (bukan 3307), edit file `.env` di semua services:

- `services/auth-service/.env`
- `services/product-service/.env`
- `services/order-service/.env`
- `services/payment-service/.env`
- `services/user-service/.env`

Ubah `DB_PORT=3307` menjadi `DB_PORT=3306`

---

## 🎯 Menjalankan Aplikasi

### Metode 1: Run All Services (RECOMMENDED)

Cara termudah untuk menjalankan semua services sekaligus:

```cmd
run-all.bat
```

Script ini akan:

- Stop semua Node.js process yang sedang berjalan
- Start 6 microservices secara berurutan
- Menampilkan status semua services
- Logs disimpan di file `logs-*.txt`

**Output yang diharapkan:**

```
============================================
All services are running in background!
============================================

Service URLs:
  API Gateway:     http://localhost:3000
  Auth Service:    http://localhost:3001
  Product Service: http://localhost:3002
  Order Service:   http://localhost:3003
  Payment Service: http://localhost:3004
  User Service:    http://localhost:3005
```

### Metode 2: Run Manual Per Service

Jika ingin run service satu per satu:

#### Terminal 1 - API Gateway

```cmd
cd services/api-gateway
node src/index.js
```

#### Terminal 2 - Auth Service

```cmd
cd services/auth-service
node src/index.js
```

#### Terminal 3 - Product Service

```cmd
cd services/product-service
node src/index.js
```

#### Terminal 4 - Order Service

```cmd
cd services/order-service
node src/index.js
```

#### Terminal 5 - Payment Service

```cmd
cd services/payment-service
node src/index.js
```

#### Terminal 6 - User Service

```cmd
cd services/user-service
node src/index.js
```

**Catatan:** Biarkan semua terminal tetap terbuka selama development.

---

## ✅ Verifikasi Services Running

Jalankan perintah ini untuk cek semua services:

```cmd
netstat -ano | findstr ":300"
```

**Output yang diharapkan:**

```
TCP    0.0.0.0:3000    LISTENING
TCP    0.0.0.0:3001    LISTENING
TCP    0.0.0.0:3002    LISTENING
TCP    0.0.0.0:3003    LISTENING
TCP    0.0.0.0:3004    LISTENING
TCP    0.0.0.0:3005    LISTENING
```

Atau test via browser:

- http://localhost:3000/health (API Gateway)
- http://localhost:3001/health (Auth Service)
- http://localhost:3002/health (Product Service)
- http://localhost:3003/health (Order Service)
- http://localhost:3004/health (Payment Service)
- http://localhost:3005/health (User Service)

---

## 🧪 Testing API dengan Postman

### 1. Health Check

```
GET http://localhost:3000/health
```

### 2. Get All Products

```
GET http://localhost:3000/api/products
```

### 3. Register User

```
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123",
  "fullName": "John Doe"
}
```

**Response:**

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

**💡 PENTING:** Copy **token** dari response untuk request selanjutnya!

### 4. Login

```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123"
}
```

### 5. Get Product by ID

```
GET http://localhost:3000/api/products/1
```

### 6. Create Order (BUTUH TOKEN!)

```
POST http://localhost:3000/api/orders
Authorization: Bearer <paste_token_disini>
Content-Type: application/json

{
  "productId": 1,
  "quantity": 2
}
```

### 7. Get My Orders

```
GET http://localhost:3000/api/orders
Authorization: Bearer <paste_token_disini>
```

### 8. Create Payment

```
POST http://localhost:3000/api/payments
Authorization: Bearer <paste_token_disini>
Content-Type: application/json

{
  "orderId": 1,
  "paymentMethod": "credit_card"
}
```

---

## 🛑 Menghentikan Services

### Metode 1: Stop All (RECOMMENDED)

```cmd
stop-all.bat
```

### Metode 2: Manual

Tekan `Ctrl + C` di setiap terminal yang menjalankan service.

### Metode 3: Kill Process

```cmd
taskkill /F /IM node.exe
```

---

## 📁 Struktur Project

```
tugas_besar/
├── services/
│   ├── api-gateway/        # Port 3000 - Entry point
│   ├── auth-service/       # Port 3001 - Authentication
│   ├── product-service/    # Port 3002 - Product catalog
│   ├── order-service/      # Port 3003 - Order management
│   ├── payment-service/    # Port 3004 - Payment processing
│   └── user-service/       # Port 3005 - User profiles
├── setup_database.sql      # SQL script untuk setup database
├── run-all.bat            # Script untuk start semua services
├── stop-all.bat           # Script untuk stop semua services
└── README.md              # Dokumentasi project
```

---

## 🐛 Troubleshooting

### Problem: Port Already in Use

**Error:** `EADDRINUSE: address already in use`

**Solusi:**

```cmd
# Cek process yang menggunakan port
netstat -ano | findstr ":3000"

# Kill process by PID
taskkill /F /PID <nomor_pid>

# Atau kill semua Node.js
taskkill /F /IM node.exe
```

### Problem: Cannot Connect to MySQL

**Error:** `ECONNREFUSED` atau `Can't connect to MySQL server`

**Solusi:**

1. Pastikan MySQL di Laragon sudah running (hijau)
2. Cek port MySQL di Laragon (3306 atau 3307)
3. Update file `.env` di semua services sesuai port yang benar
4. Restart services

### Problem: Database Not Found

**Error:** `Unknown database 'auth_db'`

**Solusi:**

1. Jalankan `setup_database.sql` di HeidiSQL/phpMyAdmin
2. Refresh database list
3. Pastikan 5 databases sudah terbuat

### Problem: Service Unavailable

**Error:** `{"error": "Service unavailable"}`

**Solusi:**

1. Cek apakah service backend yang dituju sudah running
2. Verifikasi dengan `netstat -ano | findstr ":300"`
3. Restart service yang mati

### Problem: Invalid Token

**Error:** `{"error": "Invalid token"}` atau `{"error": "Token required"}`

**Solusi:**

1. Login ulang untuk mendapatkan token baru
2. Copy token dari response login
3. Paste di Header `Authorization: Bearer <token>`
4. Pastikan tidak ada spasi extra setelah "Bearer"

---

## 📊 Port Mapping

| Service         | Port | Database   | Description               |
| --------------- | ---- | ---------- | ------------------------- |
| API Gateway     | 3000 | -          | Entry point semua request |
| Auth Service    | 3001 | auth_db    | Login, Register, JWT      |
| Product Service | 3002 | product_db | Product catalog           |
| Order Service   | 3003 | order_db   | Order management          |
| Payment Service | 3004 | payment_db | Payment processing        |
| User Service    | 3005 | user_db    | User profile              |

---

## 🎓 Architecture Overview

```
Client (Postman/Browser)
         ↓
   API Gateway (3000)
         ↓
    ┌────┴────┬────────┬────────┬────────┐
    ↓         ↓        ↓        ↓        ↓
  Auth    Product   Order   Payment   User
 (3001)   (3002)   (3003)   (3004)  (3005)
    ↓         ↓        ↓        ↓        ↓
 auth_db  product_db order_db payment_db user_db
```

**Fitur:**

- ✅ Microservices Architecture
- ✅ JWT Authentication
- ✅ MySQL Database (5 databases terpisah)
- ✅ RESTful API
- ✅ API Gateway Pattern
- ✅ Separation of Concerns

---

## 📝 Notes

- Semua request **HARUS** melalui **API Gateway** (port 3000)
- Request ke Auth dan Products **TIDAK butuh token**
- Request ke Orders, Payments, Users **BUTUH token** (dari login)
- Token berlaku selama **7 hari**
- Sample products sudah diinsert otomatis saat database initialization

---

## 🆘 Support

Jika ada masalah:

1. Cek logs di file `logs-*.txt`
2. Cek console output di terminal
3. Pastikan MySQL Laragon running
4. Restart services dengan `stop-all.bat` lalu `run-all.bat`

---

**Happy Coding! 🚀**
