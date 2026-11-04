-- Run this SQL in your Supabase SQL Editor to create the users table and seed sample data

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample users for testing
INSERT INTO users (username, email, password) VALUES
    ('alice', 'alice@example.com', 'alice@123'),
    ('bob', 'bob@example.com', 'bob@456'),
    ('charlie', 'charlie@example.com', 'charlie@789')
ON CONFLICT (username) DO NOTHING;
