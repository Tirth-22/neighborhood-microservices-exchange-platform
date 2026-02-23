-- V4__add_provider_timezone.sql
ALTER TABLE providers ADD COLUMN IF NOT EXISTS timezone VARCHAR(50) DEFAULT 'UTC';
COMMENT ON COLUMN providers.timezone IS 'Timezone of the provider, e.g., Asia/Kolkata';

-- Ensure unique constraint on availability to prevent duplicates
-- This might already exist, but we enforce it for production reliability
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'uni_provider_day') THEN
        ALTER TABLE provider_availability ADD CONSTRAINT uni_provider_day UNIQUE (provider_username, day_of_week);
    END IF;
END $$;
