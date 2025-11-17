-- Fix 1: Add DELETE policy for attendance_records with admin restriction
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'attendance_records' 
    AND policyname = 'Admins can delete attendance records'
  ) THEN
    CREATE POLICY "Admins can delete attendance records"
    ON attendance_records
    FOR DELETE
    TO authenticated
    USING (has_role(auth.uid(), 'admin'::app_role));
  END IF;
END $$;

-- Fix 2: Create audit_logs table for tracking deletions and admin actions
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT NOT NULL,
  old_data JSONB,
  performed_by UUID REFERENCES auth.users(id),
  performed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reason TEXT
);

-- Enable RLS on audit_logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'audit_logs' 
    AND policyname = 'Admins can view audit logs'
  ) THEN
    CREATE POLICY "Admins can view audit logs"
    ON audit_logs
    FOR SELECT
    TO authenticated
    USING (has_role(auth.uid(), 'admin'::app_role));
  END IF;
END $$;

-- System can insert audit logs
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'audit_logs' 
    AND policyname = 'System can insert audit logs'
  ) THEN
    CREATE POLICY "System can insert audit logs"
    ON audit_logs
    FOR INSERT
    TO authenticated
    WITH CHECK (true);
  END IF;
END $$;

-- Fix 3: Create trigger function for audit logging
CREATE OR REPLACE FUNCTION log_attendance_deletion()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO audit_logs (table_name, record_id, action, old_data, performed_by)
  VALUES (
    'attendance_records',
    OLD.id,
    'DELETE',
    to_jsonb(OLD),
    auth.uid()
  );
  RETURN OLD;
END;
$$;

-- Attach trigger to attendance_records
DROP TRIGGER IF EXISTS audit_attendance_deletion ON attendance_records;
CREATE TRIGGER audit_attendance_deletion
BEFORE DELETE ON attendance_records
FOR EACH ROW
EXECUTE FUNCTION log_attendance_deletion();

-- Fix 4: Add CHECK constraints for input validation on profiles table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_email_format_check'
  ) THEN
    ALTER TABLE profiles
    ADD CONSTRAINT profiles_email_format_check 
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_name_length_check'
  ) THEN
    ALTER TABLE profiles
    ADD CONSTRAINT profiles_name_length_check 
    CHECK (length(name) >= 2 AND length(name) <= 100);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_email_unique'
  ) THEN
    ALTER TABLE profiles
    ADD CONSTRAINT profiles_email_unique UNIQUE (email);
  END IF;
END $$;

-- Add unique constraint on roll_number (only for non-null values)
DROP INDEX IF EXISTS profiles_roll_number_unique;
CREATE UNIQUE INDEX profiles_roll_number_unique 
ON profiles (roll_number) 
WHERE roll_number IS NOT NULL;

-- Fix 5: Add CHECK constraints for attendance_records
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'attendance_status_check'
  ) THEN
    ALTER TABLE attendance_records
    ADD CONSTRAINT attendance_status_check 
    CHECK (status IN ('present', 'absent', 'late'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'attendance_verification_method_check'
  ) THEN
    ALTER TABLE attendance_records
    ADD CONSTRAINT attendance_verification_method_check 
    CHECK (verification_method IN ('face_recognition', 'manual', 'biometric'));
  END IF;
END $$;

-- Fix 6: Add CHECK constraints for device_registrations
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'device_status_check'
  ) THEN
    ALTER TABLE device_registrations
    ADD CONSTRAINT device_status_check 
    CHECK (status IN ('active', 'inactive', 'pending'));
  END IF;
END $$;

-- Fix 7: Add CHECK constraints for device_switch_requests
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'switch_request_status_check'
  ) THEN
    ALTER TABLE device_switch_requests
    ADD CONSTRAINT switch_request_status_check 
    CHECK (status IN ('pending', 'approved', 'rejected'));
  END IF;
END $$;

-- Fix 8: Fix search_path on existing functions
CREATE OR REPLACE FUNCTION is_within_radius(user_lat double precision, user_lng double precision, class_lat double precision, class_lng double precision, radius_meters double precision)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    distance float8;
BEGIN
    distance := 6371000 * acos(
        cos(radians(user_lat)) *
        cos(radians(class_lat)) *
        cos(radians(class_lng) - radians(user_lng)) +
        sin(radians(user_lat)) *
        sin(radians(class_lat))
    );
    RETURN distance <= radius_meters;
END;
$$;

CREATE OR REPLACE FUNCTION is_within_attendance_window()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    now_time time := CURRENT_TIME;
BEGIN
    RETURN (
        (now_time >= TIME '09:45' AND now_time <= TIME '10:45') OR
        (now_time >= TIME '15:45' AND now_time <= TIME '17:30')
    );
END;
$$;