-- Schema for EEC Care Complaint Management System

-- Create Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    roll_no VARCHAR(255) UNIQUE,
    mobile VARCHAR(255),
    department VARCHAR(255),
    class_name VARCHAR(255),
    year INTEGER,
    email VARCHAR(255) UNIQUE NOT NULL,
    google_id VARCHAR(255),
    created_at TIMESTAMP WITHOUT TIME ZONE
);

-- Create Complaints table
CREATE TABLE IF NOT EXISTS complaints (
    id UUID PRIMARY KEY,
    ticket_code VARCHAR(255) UNIQUE NOT NULL,
    user_id UUID,
    name VARCHAR(255),
    class_name VARCHAR(255),
    mobile VARCHAR(255),
    email VARCHAR(255),
    year INTEGER,
    description TEXT,
    category VARCHAR(255),
    block VARCHAR(255) NOT NULL,
    floor VARCHAR(255),
    complaint_date DATE,
    complaint_time TIME WITHOUT TIME ZONE,
    photo_url VARCHAR(255),
    video_url VARCHAR(255),
    status VARCHAR(255) DEFAULT 'Pending',
    admin_remarks TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE,
    updated_at TIMESTAMP WITHOUT TIME ZONE
);

-- Create Admins table
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    name VARCHAR(255),
    role VARCHAR(255),
    created_by UUID,
    created_at TIMESTAMP WITHOUT TIME ZONE
);

-- Create Indexes for performance
CREATE INDEX idx_complaints_ticket_code ON complaints(ticket_code);
CREATE INDEX idx_complaints_email ON complaints(email);
CREATE INDEX idx_complaints_category ON complaints(category);
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_users_email ON users(email);

-- Insert default main admin
INSERT INTO admins (id, email, password, name, role, created_at)
VALUES (gen_random_uuid(), 'warnerthepro@gmail.com', 'admin123', 'Main Admin', 'MAIN_ADMIN', CURRENT_TIMESTAMP)
ON CONFLICT (email) DO NOTHING;

-- Supabase Storage bucket policy (to be executed in Supabase SQL Editor if creating manually)
-- INSERT INTO storage.buckets (id, name) VALUES ('complaints', 'complaints');
-- CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'complaints' );
-- CREATE POLICY "Auth Upload" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'complaints' );
