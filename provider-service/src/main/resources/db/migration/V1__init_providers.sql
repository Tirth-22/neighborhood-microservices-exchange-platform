-- V1__init_providers.sql
-- Initial schema for provider service
-- Note: This migration is safe - tables are only created if they don't exist

CREATE TABLE IF NOT EXISTS providers (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    service_type VARCHAR(50),
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    active BOOLEAN NOT NULL DEFAULT FALSE,
    approved_by VARCHAR(255),
    approved_at TIMESTAMP,
    version BIGINT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS service_offerings (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    provider_username VARCHAR(255),
    provider_name VARCHAR(255),
    price DECIMAL(10, 2),
    average_rating DECIMAL(3, 2),
    review_count INTEGER DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    provider_id BIGINT REFERENCES providers(id),
    created_at TIMESTAMP,
    version BIGINT DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_providers_username ON providers(username);
CREATE INDEX IF NOT EXISTS idx_providers_status ON providers(status);
CREATE INDEX IF NOT EXISTS idx_service_offerings_provider ON service_offerings(provider_id);
