-- Fix public data exposure by restricting access to authenticated users only

-- Drop ALL existing policies for attendance_windows
DROP POLICY IF EXISTS "students_can_read_attendance_windows" ON public.attendance_windows;
DROP POLICY IF EXISTS "Admins can manage attendance windows" ON public.attendance_windows;
DROP POLICY IF EXISTS "admin_access_attendance_windows" ON public.attendance_windows;
DROP POLICY IF EXISTS "admin_full_access_attendance_windows" ON public.attendance_windows;

-- Drop ALL existing policies for locations
DROP POLICY IF EXISTS "students_can_read_locations" ON public.locations;
DROP POLICY IF EXISTS "Everyone can view locations" ON public.locations;
DROP POLICY IF EXISTS "Admins can manage locations" ON public.locations;
DROP POLICY IF EXISTS "admin_access_locations" ON public.locations;
DROP POLICY IF EXISTS "admin_full_access_locations" ON public.locations;

-- Create new restricted policies for attendance_windows
CREATE POLICY "auth_users_view_windows"
ON public.attendance_windows
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "admin_manage_windows"
ON public.attendance_windows
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Create new restricted policies for locations
CREATE POLICY "auth_users_view_locations"
ON public.locations
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "admin_manage_locations"
ON public.locations
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));