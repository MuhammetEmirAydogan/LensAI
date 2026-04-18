-- PostgreSQL initialization script
-- Runs once when the container is first created

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- Full-text search

-- Create test database
CREATE DATABASE lensai_test
  WITH
  OWNER = lensai
  ENCODING = 'UTF8'
  LC_COLLATE = 'en_US.utf8'
  LC_CTYPE = 'en_US.utf8'
  TEMPLATE = template0;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE lensai_dev TO lensai;
GRANT ALL PRIVILEGES ON DATABASE lensai_test TO lensai;
