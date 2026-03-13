-- V5__add_service_coordinates.sql
-- Persist lat/lng for service map rendering from backend

ALTER TABLE service_offerings
    ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
    ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;

-- Backfill existing rows near Rajkot with stable random spread.
UPDATE service_offerings
SET latitude = 22.3039 + ((random() - 0.5) * 0.08),
    longitude = 70.8022 + ((random() - 0.5) * 0.08)
WHERE latitude IS NULL OR longitude IS NULL;
