-- ==========================================
-- SQL Script untuk Setup Database
-- Jalankan di phpMyAdmin atau MySQL CLI
-- ==========================================

-- 1. BUAT DATABASE
CREATE DATABASE IF NOT EXISTS auth_db;
CREATE DATABASE IF NOT EXISTS product_db;
CREATE DATABASE IF NOT EXISTS order_db;
CREATE DATABASE IF NOT EXISTS payment_db;
CREATE DATABASE IF NOT EXISTS user_db;

-- ==========================================
-- 2. AUTH DATABASE - Tables untuk Authentication
-- ==========================================
    USE auth_db;

    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_role (role)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================
-- 3. PRODUCT DATABASE - Tables untuk Aplikasi Premium
-- ==========================================
USE product_db;

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    price DECIMAL(10, 2) NOT NULL,
    features JSON,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_price (price)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert sample products
INSERT INTO products (name, description, category, price, features, image_url) VALUES
('Adobe Creative Cloud', 'Suite lengkap aplikasi kreatif untuk desain, video, dan web', 'Design', 699000.00, 
 '["Photoshop", "Illustrator", "Premiere Pro", "After Effects"]', 
 'https://via.placeholder.com/300'),

('Microsoft Office 365', 'Aplikasi produktivitas untuk bisnis dan pribadi', 'Productivity', 129000.00, 
 '["Word", "Excel", "PowerPoint", "Outlook", "OneDrive 1TB"]', 
 'https://via.placeholder.com/300'),

('Spotify Premium', 'Streaming musik tanpa iklan dengan kualitas tinggi', 'Entertainment', 54900.00, 
 '["Ad-free", "Offline download", "High quality audio"]', 
 'https://via.placeholder.com/300'),

('Netflix Premium', 'Streaming film dan series dengan kualitas 4K', 'Entertainment', 186000.00, 
 '["4K streaming", "4 screens", "Download content"]', 
 'https://via.placeholder.com/300'),

('AutoCAD', 'Software CAD profesional untuk desain 2D dan 3D', 'Design', 2850000.00, 
 '["2D drafting", "3D modeling", "Cloud collaboration"]', 
 'https://via.placeholder.com/300');

-- ==========================================
-- 4. ORDER DATABASE - Tables untuk Pemesanan
-- ==========================================
USE order_db;

CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    total_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_product_id (product_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================
-- 5. PAYMENT DATABASE - Tables untuk Pembayaran
-- ==========================================
USE payment_db;

CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    order_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_reference VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    verified_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_order_id (order_id),
    INDEX idx_payment_reference (payment_reference),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================
-- 6. USER DATABASE - Tables untuk Profil User
-- ==========================================
USE user_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================
-- VERIFIKASI
-- ==========================================
-- Cek semua database yang sudah dibuat
SHOW DATABASES;

-- Cek tables di setiap database
SELECT 'auth_db tables:' as info;
USE auth_db; SHOW TABLES;

SELECT 'product_db tables:' as info;
USE product_db; SHOW TABLES;

SELECT 'order_db tables:' as info;
USE order_db; SHOW TABLES;

SELECT 'payment_db tables:' as info;
USE payment_db; SHOW TABLES;

SELECT 'user_db tables:' as info;
USE user_db; SHOW TABLES;

-- Cek data sample products
SELECT 'Sample products:' as info;
USE product_db;
SELECT id, name, category, price FROM products;
