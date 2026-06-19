-- ============================================================
-- NoteShare Application - Database Setup Script
-- Run this in MySQL Workbench or MySQL CLI before starting app
-- ============================================================

-- Step 1: Create the database
CREATE DATABASE IF NOT EXISTS notes_db;
USE notes_db;

-- Step 2: Create the users table
CREATE TABLE IF NOT EXISTS users (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(150) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    role        VARCHAR(20)  NOT NULL DEFAULT 'STUDENT',
    created_at  VARCHAR(20)
);

-- Step 3: Create the notes table
CREATE TABLE IF NOT EXISTS notes (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    title           VARCHAR(200)  NOT NULL,
    subject         VARCHAR(100)  NOT NULL,
    description     VARCHAR(500),
    file_name       VARCHAR(255)  NOT NULL,
    file_path       VARCHAR(500)  NOT NULL,
    file_type       VARCHAR(100),
    uploaded_by     VARCHAR(100),
    uploader_id     BIGINT,
    upload_date     VARCHAR(20),
    download_count  INT DEFAULT 0
);

-- Step 4: Insert a default admin user
-- Email: admin@notes.com | Password: admin123
INSERT INTO users (name, email, password, role, created_at)
VALUES ('Admin', 'admin@notes.com', 'admin123', 'ADMIN', '2024-01-01')
ON DUPLICATE KEY UPDATE id = id; -- Skip if already exists

-- Step 5: Insert sample student data (optional - for testing)
INSERT INTO users (name, email, password, role, created_at) VALUES
('Priya Sharma',   'priya@example.com',  'student123', 'STUDENT', '2024-01-10'),
('Rahul Verma',    'rahul@example.com',  'student123', 'STUDENT', '2024-01-12')
ON DUPLICATE KEY UPDATE id = id;

-- Verify the setup
SELECT 'Setup complete! Tables created.' AS Status;
SELECT * FROM users;
