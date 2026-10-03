# EEC Care Complaint Management System - Backend

This is the Spring Boot backend for the EEC Care Complaint Management System for Eswari Engineering College.

## Tech Stack
- Java 17
- Spring Boot 3.2.x
- Spring Data JPA
- PostgreSQL (Supabase)
- Maven
- Supabase Storage (for media uploads)
- JavaMailSender & Thymeleaf (for email notifications)

## Prerequisites
1. Java 17 installed
2. Maven installed
3. Supabase project setup (Database & Storage)
4. Gmail app password (for sending emails)

## Environment Variables Needed
Create a `.env` file or export these variables:
- `SUPABASE_DB_URL` - JDBC URL for Supabase PostgreSQL (e.g. jdbc:postgresql://aws-0-eu-central-1.pooler.supabase.com:5432/postgres)
- `SUPABASE_DB_USERNAME` - DB User
- `SUPABASE_DB_PASSWORD` - DB Password
- `MAIL_USERNAME` - Your Gmail address (e.g., warnerthepro@gmail.com)
- `MAIL_PASSWORD` - Your Gmail App Password
- `SUPABASE_URL` - Supabase Project URL (e.g., https://xyz.supabase.co)
- `SUPABASE_SERVICE_KEY` - Supabase Service Role Key

## Supabase Storage Setup
1. Create a bucket named `complaints` and make it public.
2. Update policies to allow uploads.

## Running Locally
1. Navigate to the `backend` folder.
2. Build: `mvn clean install`
3. Run: `mvn spring-boot:run`
4. The server runs on `http://localhost:8080`.

## Default Admin
On startup, a default admin is created if not exists:
- Email: `warnerthepro@gmail.com`
- Password: `admin123`
