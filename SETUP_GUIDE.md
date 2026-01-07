# 🚀 Setup MySQL untuk Aplikasi

## Langkah 1: Jalankan XAMPP

1. Buka **XAMPP Control Panel**
2. Start **Apache** (untuk phpMyAdmin)
3. Start **MySQL**
4. Pastikan MySQL berwarna hijau (running)

## Langkah 2: Buat Database via phpMyAdmin

1. **Buka browser**, kunjungi: http://localhost/phpmyadmin
2. Klik tab **SQL** di bagian atas
3. **Copy SEMUA isi file `setup_database.sql`**
4. **Paste** ke text area SQL
5. Klik tombol **Go** di kanan bawah
6. Tunggu sampai muncul pesan sukses

### ✅ Verifikasi Database Sudah Dibuat

Di sidebar kiri phpMyAdmin, harusnya muncul 5 database baru:

- ✅ `auth_db`
- ✅ `product_db` (sudah ada 5 produk sample)
- ✅ `order_db`
- ✅ `payment_db`
- ✅ `user_db`

## Langkah 3: Update Password MySQL (Jika Ada)

Jika password MySQL XAMPP Anda BUKAN kosong, edit file `.env` di setiap folder service:

**Lokasi file .env:**

- `services/auth-service/.env`
- `services/product-service/.env`
- `services/order-service/.env`
- `services/payment-service/.env`
- `services/user-service/.env`

**Ubah baris:**

```
DB_PASSWORD=
```

**Menjadi:**

```
DB_PASSWORD=password_mysql_anda
```

## Langkah 4: Jalankan Aplikasi

```cmd
cd "d:\kuliah\Semester 7\Web service praktik\tugas_besar"
start.bat
```

Script akan membuka 6 terminal untuk:

- Auth Service (Port 3001)
- Product Service (Port 3002)
- Order Service (Port 3003)
- Payment Service (Port 3004)
- User Service (Port 3005)
- API Gateway (Port 3000)

**Tunggu 10 detik** sampai semua service siap.

## Langkah 5: Test API

### Test via Browser:

```
http://localhost:3000/api/products
```

### Test via PowerShell:

**Register User:**

```powershell
$body = @{email='john@test.com';password='Pass123';fullName='John Doe'} | ConvertTo-Json
Invoke-WebRequest -Uri 'http://localhost:3000/api/auth/register' -Method POST -Body $body -ContentType 'application/json' -UseBasicParsing
```

**Login:**

```powershell
$body = @{email='john@test.com';password='Pass123'} | ConvertTo-Json
Invoke-WebRequest -Uri 'http://localhost:3000/api/auth/login' -Method POST -Body $body -ContentType 'application/json' -UseBasicParsing
```

**Get Products:**

```powershell
Invoke-WebRequest -Uri 'http://localhost:3000/api/products' -UseBasicParsing
```

## ⚠️ Troubleshooting

### Error: "Can't connect to MySQL server"

**Solusi:**

1. Pastikan MySQL di XAMPP sudah running (warna hijau)
2. Coba restart MySQL di XAMPP Control Panel
3. Cek di Task Manager apakah `mysqld.exe` berjalan

### Error: "Access denied for user 'root'"

**Solusi:**

1. Cek password MySQL di phpMyAdmin
2. Update file `.env` dengan password yang benar
3. Restart semua service

### Error: "Unknown database"

**Solusi:**

1. Pastikan sudah jalankan `setup_database.sql` di phpMyAdmin
2. Refresh phpMyAdmin dan cek apakah 5 database sudah ada
3. Jika belum, jalankan ulang SQL script

### Tables Tidak Terbuat Otomatis

**Solusi:**
Tables akan dibuat otomatis saat service pertama kali dijalankan. Jika tidak:

1. Stop semua service (Ctrl+C di setiap terminal)
2. Jalankan `setup_database.sql` di phpMyAdmin (sudah ada CREATE TABLE)
3. Start ulang aplikasi dengan `start.bat`

### Port Sudah Digunakan

**Solusi:**

```cmd
netstat -ano | findstr ":3000"
taskkill /PID <nomor_pid> /F
```

## 📊 Cek Data di phpMyAdmin

Setelah test API, cek data yang masuk:

1. Buka http://localhost/phpmyadmin
2. Klik database `auth_db` → table `users` → Browse
3. Klik database `product_db` → table `products` → Browse
4. Klik database `order_db` → table `orders` → Browse

Anda akan melihat data yang masuk dari API!

## ✅ Checklist Setup

- [ ] XAMPP MySQL sudah running
- [ ] 5 database sudah dibuat di phpMyAdmin
- [ ] Tables sudah dibuat (auto atau manual)
- [ ] File .env sudah di-update (jika ada password)
- [ ] npm install mysql2 sudah dijalankan
- [ ] start.bat berhasil membuka 6 terminal
- [ ] API Gateway merespon di http://localhost:3000/api/products

Jika semua ✅, aplikasi sudah siap digunakan!
