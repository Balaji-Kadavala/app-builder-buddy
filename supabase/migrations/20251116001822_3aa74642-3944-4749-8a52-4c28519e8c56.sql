-- Fix security warnings for function search paths

-- Drop and recreate update_updated_at_column with proper search_path
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Drop and recreate calculate_attendance_percentage with proper search_path
DROP FUNCTION IF EXISTS public.calculate_attendance_percentage(UUID);

CREATE OR REPLACE FUNCTION public.calculate_attendance_percentage(_student_id UUID)
RETURNS DECIMAL
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  total_days INTEGER;
  present_days INTEGER;
BEGIN
  SELECT COUNT(DISTINCT DATE(timestamp))
  INTO total_days
  FROM public.attendance_records
  WHERE timestamp >= CURRENT_DATE - INTERVAL '30 days';

  SELECT COUNT(DISTINCT DATE(timestamp))
  INTO present_days
  FROM public.attendance_records
  WHERE student_id = _student_id
    AND status = 'present'
    AND timestamp >= CURRENT_DATE - INTERVAL '30 days';

  IF total_days = 0 THEN
    RETURN 0;
  END IF;

  RETURN ROUND((present_days::DECIMAL / total_days::DECIMAL) * 100, 2);
END;
$$;

-- Recreate trigger for profiles table
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();