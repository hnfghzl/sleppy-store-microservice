-- Buat database untuk aplikasi microservice
-- Jalankan script ini di phpMyAdmin atau MySQL CLI

-- Drop database jika sudah ada (opsional)
DROP DATABASE IF EXISTS auth_db;
DROP DATABASE IF EXISTS product_db;
DROP DATABASE IF EXISTS order_db;
DROP DATABASE IF EXISTS payment_db;
DROP DATABASE IF EXISTS user_db;

-- Buat database baru
CREATE DATABASE auth_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE product_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE order_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE payment_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE user_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Verifikasi
SHOW DATABASES;
