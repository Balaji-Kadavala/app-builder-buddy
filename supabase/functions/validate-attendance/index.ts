import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.81.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AttendanceRequest {
  student_id: string;
  session_type: string;
  location_lat: number;
  location_lng: number;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body: AttendanceRequest = await req.json();

    // Validation 1: Check required fields
    if (!body.student_id || !body.session_type || body.location_lat === undefined || body.location_lng === undefined) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: student_id, session_type, location_lat, location_lng' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validation 2: Verify student_id matches authenticated user
    if (body.student_id !== user.id) {
      console.error(`Student ID mismatch: ${body.student_id} !== ${user.id}`);
      return new Response(
        JSON.stringify({ error: 'Student ID does not match authenticated user' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validation 3: Check if within attendance window using database function
    const { data: windowCheck, error: windowError } = await supabaseClient
      .rpc('is_within_attendance_window');

    if (windowError) {
      console.error('Error checking attendance window:', windowError);
      return new Response(
        JSON.stringify({ error: 'Failed to validate attendance window' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!windowCheck) {
      return new Response(
        JSON.stringify({ error: 'Not within attendance window. Valid times: 9:45-10:45 AM or 3:45-5:30 PM' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validation 4: Check for duplicate attendance today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { data: existingAttendance, error: duplicateError } = await supabaseClient
      .from('attendance_records')
      .select('id')
      .eq('student_id', body.student_id)
      .eq('session_type', body.session_type)
      .gte('timestamp', today.toISOString())
      .maybeSingle();

    if (duplicateError) {
      console.error('Error checking duplicate attendance:', duplicateError);
    }

    if (existingAttendance) {
      return new Response(
        JSON.stringify({ error: 'Attendance already marked for this session today' }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validation 5: Verify location within classroom radius
    const { data: locations, error: locationError } = await supabaseClient
      .from('locations')
      .select('latitude, longitude, radius')
      .eq('active_status', true);

    if (locationError) {
      console.error('Error fetching locations:', locationError);
      return new Response(
        JSON.stringify({ error: 'Failed to validate location' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let locationValid = false;
    if (locations && locations.length > 0) {
      for (const location of locations) {
        const { data: radiusCheck } = await supabaseClient
          .rpc('is_within_radius', {
            user_lat: body.location_lat,
            user_lng: body.location_lng,
            class_lat: location.latitude,
            class_lng: location.longitude,
            radius_meters: location.radius
          });

        if (radiusCheck) {
          locationValid = true;
          break;
        }
      }
    }

    if (!locationValid) {
      return new Response(
        JSON.stringify({ error: 'Location is not within any valid classroom radius' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // All validations passed - mark attendance
    const { data: attendanceRecord, error: insertError } = await supabaseClient
      .rpc('secure_insert_attendance', {
        p_student_id: body.student_id,
        p_status: 'present',
        p_session_type: body.session_type,
        p_verification_method: 'face_recognition'
      });

    if (insertError) {
      console.error('Error inserting attendance:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to mark attendance' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Attendance marked successfully for student ${body.student_id}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Attendance marked successfully',
        session_type: body.session_type
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
