-- V3__add_availability_tables.sql
-- Provider Availability and Time Slot Management

-- Provider weekly availability schedule
CREATE TABLE IF NOT EXISTS provider_availability (
    id BIGSERIAL PRIMARY KEY,
    provider_username VARCHAR(255) NOT NULL,
    day_of_week VARCHAR(20) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    slot_duration_minutes INTEGER DEFAULT 60,
    is_available BOOLEAN DEFAULT TRUE,
    UNIQUE(provider_username, day_of_week)
);

-- Time slots for bookings
CREATE TABLE IF NOT EXISTS time_slots (
    id BIGSERIAL PRIMARY KEY,
    provider_username VARCHAR(255) NOT NULL,
    slot_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_booked BOOLEAN DEFAULT FALSE,
    booked_by VARCHAR(255),
    request_id BIGINT
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_provider_day ON provider_availability(provider_username, day_of_week);
CREATE INDEX IF NOT EXISTS idx_slot_provider_date ON time_slots(provider_username, slot_date);
CREATE INDEX IF NOT EXISTS idx_slot_status ON time_slots(provider_username, is_booked);
CREATE INDEX IF NOT EXISTS idx_slot_booked_by ON time_slots(booked_by);
