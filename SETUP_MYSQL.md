# Cara Setup Database MySQL

## Opsi 1: Menggunakan phpMyAdmin (Recommended)

1. **Pastikan XAMPP sudah jalan:**

   - Buka XAMPP Control Panel
   - Start **Apache**
   - Start **MySQL**

2. **Buka phpMyAdmin:**

   - Buka browser, kunjungi: http://localhost/phpmyadmin

3. **Import SQL Script:**

   - Klik tab **SQL** di bagian atas
   - Copy semua isi file `create_databases.sql`
   - Paste ke text area
   - Klik **Go**

4. **Verifikasi:**
   - Cek di sidebar kiri, harusnya muncul 5 database baru:
     - auth_db
     - product_db
     - order_db
     - payment_db
     - user_db

## Opsi 2: Menggunakan MySQL CLI

```cmd
cd "d:\kuliah\Semester 7\Web service praktik\tugas_besar"
"C:\xampp\mysql\bin\mysql.exe" -u root -p < create_databases.sql
```

Default password XAMPP MySQL: (kosong, langsung Enter)

## Setelah Database Dibuat

1. **Install mysql2 di semua service:**

   ```cmd
   cd services\auth-service && npm install mysql2
   cd ..\product-service && npm install mysql2
   cd ..\order-service && npm install mysql2
   cd ..\payment-service && npm install mysql2
   cd ..\user-service && npm install mysql2
   ```

2. **Update file .env di setiap service:**

   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=nama_database
   ```

3. **Jalankan aplikasi:**
   ```cmd
   start.bat
   ```

Tables akan dibuat otomatis saat service pertama kali dijalankan!
