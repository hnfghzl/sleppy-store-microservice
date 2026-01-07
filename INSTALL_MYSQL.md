# Panduan Instalasi MySQL untuk Windows

## Langkah 1: Download MySQL

1. Buka browser dan kunjungi: https://dev.mysql.com/downloads/installer/
2. Pilih **MySQL Installer for Windows**
3. Download versi **mysql-installer-community-8.0.xx.msi** (pilih yang lebih besar ~400MB)
4. Klik **No thanks, just start my download**

## Langkah 2: Install MySQL

1. **Jalankan file installer** yang sudah didownload
2. Pilih **Developer Default** atau **Server only**
3. Klik **Next** → **Execute** (tunggu download selesai)
4. Klik **Next** beberapa kali sampai ke **Configuration**

### Configuration:

**Type and Networking:**

- Config Type: **Development Computer**
- Port: **3306** (default)
- Centang **Open Windows Firewall**
- Klik **Next**

**Authentication Method:**

- Pilih: **Use Strong Password Encryption** (Recommended)
- Klik **Next**

**Accounts and Roles:**

- MySQL Root Password: `rootpassword` (atau password pilihan Anda)
- Ulangi password
- Klik **Next**

**Windows Service:**

- Centang **Configure MySQL Server as a Windows Service**
- Service Name: **MySQL80**
- Centang **Start the MySQL Server at System Startup**
- Klik **Next**

5. Klik **Execute** untuk apply configuration
6. Tunggu sampai selesai, klik **Finish**
7. Klik **Next** → **Finish** untuk complete installation

## Langkah 3: Verifikasi Instalasi

Buka Command Prompt dan jalankan:

```cmd
mysql --version
```

Output yang diharapkan:

```
mysql  Ver 8.0.xx for Win64 on x86_64
```

## Langkah 4: Login ke MySQL

```cmd
mysql -u root -p
```

Masukkan password yang Anda buat tadi (`rootpassword`)

## Langkah 5: Buat Database untuk Aplikasi

Setelah login ke MySQL, jalankan perintah berikut:

```sql
CREATE DATABASE auth_db;
CREATE DATABASE product_db;
CREATE DATABASE order_db;
CREATE DATABASE payment_db;
CREATE DATABASE user_db;

-- Verifikasi database sudah dibuat
SHOW DATABASES;

-- Keluar dari MySQL
EXIT;
```

## Langkah 6: Test Koneksi

```cmd
mysql -u root -p -e "SHOW DATABASES;"
```

Jika berhasil, Anda akan melihat list database termasuk 5 database yang baru dibuat.

## Troubleshooting

### Error: "mysql is not recognized"

**Solusi**: Tambahkan MySQL ke PATH

1. Cari lokasi instalasi MySQL (biasanya `C:\Program Files\MySQL\MySQL Server 8.0\bin`)
2. Tekan **Win + R**, ketik `sysdm.cpl`, Enter
3. Tab **Advanced** → **Environment Variables**
4. Pada **System variables**, cari **Path**, klik **Edit**
5. Klik **New**, paste path MySQL bin (contoh: `C:\Program Files\MySQL\MySQL Server 8.0\bin`)
6. Klik **OK** semua dialog
7. **Restart Command Prompt** dan coba lagi

### Error: "Access denied for user 'root'@'localhost'"

**Solusi**: Password salah atau user tidak ada

- Reset password via MySQL Installer
- Atau reinstall MySQL

### MySQL Service tidak jalan

**Solusi**: Start manual

1. Tekan **Win + R**, ketik `services.msc`, Enter
2. Cari **MySQL80**
3. Klik kanan → **Start**

## Setelah MySQL Terinstall

1. Update file `.env` di setiap service dengan password MySQL Anda
2. Jalankan: `npm install mysql2` di setiap folder service
3. Jalankan aplikasi dengan `start.bat`

Database tables akan dibuat otomatis saat service pertama kali dijalankan.
