-- V2__add_profile_image_column.sql
-- Add profile_image_url column to users table for file upload feature

ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image_url VARCHAR(500);
