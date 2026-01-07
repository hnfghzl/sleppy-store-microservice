# 🚀 Cara Menjalankan Aplikasi Microservice

## ✅ Sudah Siap Dijalankan!

Aplikasi sudah menggunakan **lowdb** (database JSON file) jadi tidak perlu install MySQL atau Docker lagi.

## 📌 Cara Menjalankan

### Opsi 1: Jalankan Semua Service Sekaligus (Recommended)

Buka **6 terminal** (Command Prompt atau PowerShell) yang berbeda dan jalankan perintah ini di masing-masing terminal:

**Terminal 1 - Auth Service:**

```cmd
cd "d:\kuliah\Semester 7\Web service praktik\tugas_besar\services\auth-service"
npm start
```

**Terminal 2 - Product Service:**

```cmd
cd "d:\kuliah\Semester 7\Web service praktik\tugas_besar\services\product-service"
npm start
```

**Terminal 3 - Order Service:**

```cmd
cd "d:\kuliah\Semester 7\Web service praktik\tugas_besar\services\order-service"
npm start
```

**Terminal 4 - Payment Service:**

```cmd
cd "d:\kuliah\Semester 7\Web service praktik\tugas_besar\services\payment-service"
npm start
```

**Terminal 5 - User Service:**

```cmd
cd "d:\kuliah\Semester 7\Web service praktik\tugas_besar\services\user-service"
npm start
```

**Terminal 6 - API Gateway:**

```cmd
cd "d:\kuliah\Semester 7\Web service praktik\tugas_besar\services\api-gateway"
npm start
```

### Opsi 2: Jalankan Satu-satu (Untuk Testing)

Jalankan service yang ingin di-test saja. Misalnya untuk test Auth Service:

```cmd
cd services\auth-service
npm start
```

Lalu di terminal lain, test dengan:

```cmd
curl http://localhost:3001/health
```

## 🌐 URL Akses

Setelah semua service jalan:

- **API Gateway:** http://localhost:3000
- **Auth Service:** http://localhost:3001
- **Product Service:** http://localhost:3002
- **Order Service:** http://localhost:3003
- **Payment Service:** http://localhost:3004
- **User Service:** http://localhost:3005

## 📝 Test API

### 1. Register User Baru

```cmd
curl -X POST http://localhost:3000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"user@example.com\",\"password\":\"password123\",\"fullName\":\"John Doe\"}"
```

### 2. Login

```cmd
curl -X POST http://localhost:3000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"user@example.com\",\"password\":\"password123\"}"
```

Akan mendapat **token**, simpan token tersebut.

### 3. Lihat Produk

```cmd
curl http://localhost:3000/api/products
```

### 4. Buat Order (Ganti YOUR_TOKEN dengan token dari login)

```cmd
curl -X POST http://localhost:3000/api/orders ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_TOKEN" ^
  -d "{\"productId\":1,\"quantity\":1}"
```

## 📁 Data Storage

Semua data disimpan dalam file JSON di folder `data/` masing-masing service:

- `services/auth-service/data/auth.json`
- `services/product-service/data/product.json`
- `services/order-service/data/order.json`
- `services/payment-service/data/payment.json`
- `services/user-service/data/user.json`

## ⚠️ Tips

1. **Jalankan service sesuai urutan dependencies** (Auth & Product dulu, baru Order & Payment)
2. **Jangan tutup terminal** selama service berjalan
3. **Tekan Ctrl+C** di terminal untuk menghentikan service
4. **Gunakan Postman** untuk test API yang lebih mudah (lihat POSTMAN_COLLECTION.md)

## 🐛 Troubleshooting

**Port sudah digunakan?**

```cmd
netstat -ano | findstr :3001
taskkill /PID <PID_NUMBER> /F
```

**Service tidak jalan?**

- Pastikan di folder yang benar
- Pastikan sudah `npm install`
- Check error di terminal

## 📚 Dokumentasi Lengkap

- **README.md** - Overview project
- **API_DOCS.md** - Dokumentasi lengkap semua API endpoint
- **ARCHITECTURE.md** - Penjelasan arsitektur microservice
- **POSTMAN_COLLECTION.md** - Collection untuk import ke Postman
