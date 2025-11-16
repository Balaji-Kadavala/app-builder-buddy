-- Phase 6: Database Schema Implementation for SFRAS

-- Create app_role enum for role-based access control
CREATE TYPE public.app_role AS ENUM ('admin', 'student');

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (user_id, role)
);

-- Create profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  roll_number TEXT,
  profile_photo_url TEXT,
  attendance_percentage DECIMAL(5,2) DEFAULT 0.00,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create biometric_data table for face embeddings
CREATE TABLE public.biometric_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE NOT NULL,
  face_embedding_encrypted TEXT NOT NULL,
  version INTEGER DEFAULT 1 NOT NULL,
  active_status BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create attendance_records table
CREATE TABLE public.attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  session_type TEXT NOT NULL CHECK (session_type IN ('morning', 'evening')),
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  verification_method TEXT DEFAULT 'face_recognition' CHECK (verification_method IN ('face_recognition', 'manual', 'admin_override')),
  status TEXT DEFAULT 'present' CHECK (status IN ('present', 'absent', 'late')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create device_registrations table
CREATE TABLE public.device_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE NOT NULL,
  device_fingerprint TEXT NOT NULL,
  device_name TEXT,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  last_used TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending_approval')),
  switch_count INTEGER DEFAULT 0 NOT NULL,
  UNIQUE (student_id, device_fingerprint)
);

-- Create attendance_windows table
CREATE TABLE public.attendance_windows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_name TEXT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  days_active TEXT[] DEFAULT ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  location_required BOOLEAN DEFAULT true NOT NULL,
  active_status BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create locations table
CREATE TABLE public.locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  radius INTEGER DEFAULT 5 NOT NULL,
  classroom_id TEXT,
  active_status BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create device_switch_requests table
CREATE TABLE public.device_switch_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE NOT NULL,
  old_device_fingerprint TEXT NOT NULL,
  new_device_fingerprint TEXT NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biometric_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_windows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_switch_requests ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles"
  ON public.user_roles FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for biometric_data
CREATE POLICY "Students can view their own biometric data"
  ON public.biometric_data FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "Admins can view all biometric data"
  ON public.biometric_data FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Students can insert their own biometric data"
  ON public.biometric_data FOR INSERT
  WITH CHECK (student_id = auth.uid());

-- RLS Policies for attendance_records
CREATE POLICY "Students can view their own attendance"
  ON public.attendance_records FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "Admins can view all attendance records"
  ON public.attendance_records FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Students can insert their own attendance"
  ON public.attendance_records FOR INSERT
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Admins can insert attendance records"
  ON public.attendance_records FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for device_registrations
CREATE POLICY "Students can view their own devices"
  ON public.device_registrations FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "Admins can view all devices"
  ON public.device_registrations FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Students can insert their own device"
  ON public.device_registrations FOR INSERT
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Admins can update device status"
  ON public.device_registrations FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for attendance_windows
CREATE POLICY "Everyone can view attendance windows"
  ON public.attendance_windows FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage attendance windows"
  ON public.attendance_windows FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for locations
CREATE POLICY "Everyone can view locations"
  ON public.locations FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage locations"
  ON public.locations FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for device_switch_requests
CREATE POLICY "Students can view their own switch requests"
  ON public.device_switch_requests FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "Admins can view all switch requests"
  ON public.device_switch_requests FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Students can create switch requests"
  ON public.device_switch_requests FOR INSERT
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Admins can update switch requests"
  ON public.device_switch_requests FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for profiles table
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to calculate attendance percentage
CREATE OR REPLACE FUNCTION public.calculate_attendance_percentage(_student_id UUID)
RETURNS DECIMAL AS $$
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
$$ LANGUAGE plpgsql;

-- Insert default attendance windows
INSERT INTO public.attendance_windows (session_name, start_time, end_time)
VALUES
  ('Morning Session', '09:45:00', '10:45:00'),
  ('Evening Session', '15:45:00', '17:30:00');

-- Create indexes for performance
CREATE INDEX idx_attendance_records_student_id ON public.attendance_records(student_id);
CREATE INDEX idx_attendance_records_timestamp ON public.attendance_records(timestamp);
CREATE INDEX idx_device_registrations_student_id ON public.device_registrations(student_id);
CREATE INDEX idx_biometric_data_student_id ON public.biometric_data(student_id);
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);