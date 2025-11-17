export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      attendance_records: {
        Row: {
          created_at: string
          id: string
          location_lat: number | null
          location_lng: number | null
          session_type: string
          status: string | null
          student_id: string
          timestamp: string
          verification_method: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          location_lat?: number | null
          location_lng?: number | null
          session_type: string
          status?: string | null
          student_id: string
          timestamp?: string
          verification_method?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          location_lat?: number | null
          location_lng?: number | null
          session_type?: string
          status?: string | null
          student_id?: string
          timestamp?: string
          verification_method?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_records_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      attendance_windows: {
        Row: {
          active_status: boolean
          created_at: string
          days_active: string[] | null
          end_time: string
          id: string
          location_required: boolean
          session_name: string
          start_time: string
        }
        Insert: {
          active_status?: boolean
          created_at?: string
          days_active?: string[] | null
          end_time: string
          id?: string
          location_required?: boolean
          session_name: string
          start_time: string
        }
        Update: {
          active_status?: boolean
          created_at?: string
          days_active?: string[] | null
          end_time?: string
          id?: string
          location_required?: boolean
          session_name?: string
          start_time?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          id: string
          old_data: Json | null
          performed_at: string
          performed_by: string | null
          reason: string | null
          record_id: string
          table_name: string
        }
        Insert: {
          action: string
          id?: string
          old_data?: Json | null
          performed_at?: string
          performed_by?: string | null
          reason?: string | null
          record_id: string
          table_name: string
        }
        Update: {
          action?: string
          id?: string
          old_data?: Json | null
          performed_at?: string
          performed_by?: string | null
          reason?: string | null
          record_id?: string
          table_name?: string
        }
        Relationships: []
      }
      biometric_data: {
        Row: {
          active_status: boolean
          created_at: string
          face_embedding_encrypted: string
          id: string
          student_id: string
          version: number
        }
        Insert: {
          active_status?: boolean
          created_at?: string
          face_embedding_encrypted: string
          id?: string
          student_id: string
          version?: number
        }
        Update: {
          active_status?: boolean
          created_at?: string
          face_embedding_encrypted?: string
          id?: string
          student_id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "biometric_data_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      device_registrations: {
        Row: {
          device_fingerprint: string
          device_name: string | null
          id: string
          last_used: string
          registered_at: string
          status: string | null
          student_id: string
          switch_count: number
        }
        Insert: {
          device_fingerprint: string
          device_name?: string | null
          id?: string
          last_used?: string
          registered_at?: string
          status?: string | null
          student_id: string
          switch_count?: number
        }
        Update: {
          device_fingerprint?: string
          device_name?: string | null
          id?: string
          last_used?: string
          registered_at?: string
          status?: string | null
          student_id?: string
          switch_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "device_registrations_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      device_switch_requests: {
        Row: {
          id: string
          new_device_fingerprint: string
          old_device_fingerprint: string
          reason: string | null
          requested_at: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          student_id: string
        }
        Insert: {
          id?: string
          new_device_fingerprint: string
          old_device_fingerprint: string
          reason?: string | null
          requested_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          student_id: string
        }
        Update: {
          id?: string
          new_device_fingerprint?: string
          old_device_fingerprint?: string
          reason?: string | null
          requested_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "device_switch_requests_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      locations: {
        Row: {
          active_status: boolean
          classroom_id: string | null
          created_at: string
          id: string
          latitude: number
          longitude: number
          name: string
          radius: number
        }
        Insert: {
          active_status?: boolean
          classroom_id?: string | null
          created_at?: string
          id?: string
          latitude: number
          longitude: number
          name: string
          radius?: number
        }
        Update: {
          active_status?: boolean
          classroom_id?: string | null
          created_at?: string
          id?: string
          latitude?: number
          longitude?: number
          name?: string
          radius?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          attendance_percentage: number | null
          created_at: string
          email: string
          id: string
          name: string
          profile_photo_url: string | null
          roll_number: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          attendance_percentage?: number | null
          created_at?: string
          email: string
          id?: string
          name: string
          profile_photo_url?: string | null
          roll_number?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          attendance_percentage?: number | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          profile_photo_url?: string | null
          roll_number?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_attendance_percentage: {
        Args: { _student_id: string }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_within_attendance_window: { Args: never; Returns: boolean }
      is_within_radius: {
        Args: {
          class_lat: number
          class_lng: number
          radius_meters: number
          user_lat: number
          user_lng: number
        }
        Returns: boolean
      }
      secure_insert_attendance: {
        Args: {
          p_session_type: string
          p_status: string
          p_student_id: string
          p_verification_method: string
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "student"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "student"],
    },
  },
} as const
