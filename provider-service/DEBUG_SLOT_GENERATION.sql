-- ========================================
-- DEBUG SCRIPT FOR SLOT GENERATION ISSUE
-- ========================================

-- 1. Check provider status
SELECT id, username, status, active, timezone, created_at
FROM providers
WHERE username = 'YOUR_USERNAME_HERE';
-- Expected: status should be 'ACTIVE'

-- 2. Check weekly availability records
SELECT id, provider_username, day_of_week, start_time, end_time, 
       slot_duration_minutes, is_available
FROM provider_availability
WHERE provider_username = 'YOUR_USERNAME_HERE'
ORDER BY 
    CASE day_of_week
        WHEN 'MONDAY' THEN 1
        WHEN 'TUESDAY' THEN 2
        WHEN 'WEDNESDAY' THEN 3
        WHEN 'THURSDAY' THEN 4
        WHEN 'FRIDAY' THEN 5
        WHEN 'SATURDAY' THEN 6
        WHEN 'SUNDAY' THEN 7
    END;
-- Expected: Should return records with is_available = true or NULL

-- 3. Check existing time slots
SELECT id, provider_username, slot_date, start_time, end_time, is_booked
FROM time_slots
WHERE provider_username = 'YOUR_USERNAME_HERE'
ORDER BY slot_date, start_time
LIMIT 20;

-- ========================================
-- FIX SCRIPTS (if needed)
-- ========================================

-- Fix 1: Set provider status to ACTIVE
UPDATE providers
SET status = 'ACTIVE', active = true
WHERE username = 'YOUR_USERNAME_HERE';

-- Fix 2: Set is_available to true for all availability records
UPDATE provider_availability
SET is_available = true
WHERE provider_username = 'YOUR_USERNAME_HERE'
  AND (is_available IS NULL OR is_available = false);

-- Fix 3: Delete all existing slots to regenerate fresh
DELETE FROM time_slots
WHERE provider_username = 'YOUR_USERNAME_HERE';

-- ========================================
-- VERIFICATION QUERIES
-- ========================================

-- Verify provider is active
SELECT username, status, active, 
       CASE WHEN status = 'ACTIVE' THEN 'YES' ELSE 'NO' END as can_generate_slots
FROM providers
WHERE username = 'YOUR_USERNAME_HERE';

-- Verify availability records are active
SELECT day_of_week, start_time, end_time, 
       COALESCE(is_available, true) as effective_is_available,
       slot_duration_minutes
FROM provider_availability
WHERE provider_username = 'YOUR_USERNAME_HERE'
  AND (is_available IS NULL OR is_available = true)
ORDER BY 
    CASE day_of_week
        WHEN 'MONDAY' THEN 1
        WHEN 'TUESDAY' THEN 2
        WHEN 'WEDNESDAY' THEN 3
        WHEN 'THURSDAY' THEN 4
        WHEN 'FRIDAY' THEN 5
        WHEN 'SATURDAY' THEN 6
        WHEN 'SUNDAY' THEN 7
    END;

-- Count expected slots for next 7 days
-- This helps estimate how many slots should be generated
SELECT day_of_week, 
       COUNT(*) as availability_count,
       SUM(TIMESTAMPDIFF(MINUTE, start_time, end_time) / slot_duration_minutes) as expected_slots_per_day
FROM provider_availability
WHERE provider_username = 'YOUR_USERNAME_HERE'
  AND (is_available IS NULL OR is_available = true)
GROUP BY day_of_week;
