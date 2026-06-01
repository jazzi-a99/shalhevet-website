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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          capacity: number | null
          category_id: string
          created_at: string
          created_by: string | null
          currency: string
          day_of_week: number | null
          description_en: string | null
          description_he: string | null
          end_time: string | null
          event_date: string | null
          event_end_time: string | null
          event_start_time: string | null
          id: string
          image_url: string | null
          instructions_en: string | null
          instructions_he: string | null
          is_active: boolean
          is_cancelled: boolean
          kind: Database["public"]["Enums"]["activity_kind"]
          location_en: string | null
          location_he: string | null
          price_cents: number
          simple_category: string | null
          start_time: string | null
          sub_category: string | null
          teacher_en: string | null
          teacher_he: string | null
          title_en: string | null
          title_he: string
          updated_at: string
          visual_category: string | null
        }
        Insert: {
          capacity?: number | null
          category_id: string
          created_at?: string
          created_by?: string | null
          currency?: string
          day_of_week?: number | null
          description_en?: string | null
          description_he?: string | null
          end_time?: string | null
          event_date?: string | null
          event_end_time?: string | null
          event_start_time?: string | null
          id?: string
          image_url?: string | null
          instructions_en?: string | null
          instructions_he?: string | null
          is_active?: boolean
          is_cancelled?: boolean
          kind: Database["public"]["Enums"]["activity_kind"]
          location_en?: string | null
          location_he?: string | null
          price_cents?: number
          simple_category?: string | null
          start_time?: string | null
          sub_category?: string | null
          teacher_en?: string | null
          teacher_he?: string | null
          title_en?: string | null
          title_he: string
          updated_at?: string
          visual_category?: string | null
        }
        Update: {
          capacity?: number | null
          category_id?: string
          created_at?: string
          created_by?: string | null
          currency?: string
          day_of_week?: number | null
          description_en?: string | null
          description_he?: string | null
          end_time?: string | null
          event_date?: string | null
          event_end_time?: string | null
          event_start_time?: string | null
          id?: string
          image_url?: string | null
          instructions_en?: string | null
          instructions_he?: string | null
          is_active?: boolean
          is_cancelled?: boolean
          kind?: Database["public"]["Enums"]["activity_kind"]
          location_en?: string | null
          location_he?: string | null
          price_cents?: number
          simple_category?: string | null
          start_time?: string | null
          sub_category?: string | null
          teacher_en?: string | null
          teacher_he?: string | null
          title_en?: string | null
          title_he?: string
          updated_at?: string
          visual_category?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activities_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "activity_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_categories: {
        Row: {
          created_at: string
          description_en: string | null
          description_he: string | null
          display_order: number
          id: string
          name_en: string
          name_he: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description_en?: string | null
          description_he?: string | null
          display_order?: number
          id?: string
          name_en: string
          name_he: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description_en?: string | null
          description_he?: string | null
          display_order?: number
          id?: string
          name_en?: string
          name_he?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      activity_registrations: {
        Row: {
          activity_id: string
          attendance_status: Database["public"]["Enums"]["attendance_status"]
          created_at: string
          id: string
          notes: string | null
          occurrence_date: string | null
          payment_status: Database["public"]["Enums"]["payment_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          activity_id: string
          attendance_status?: Database["public"]["Enums"]["attendance_status"]
          created_at?: string
          id?: string
          notes?: string | null
          occurrence_date?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          activity_id?: string
          attendance_status?: Database["public"]["Enums"]["attendance_status"]
          created_at?: string
          id?: string
          notes?: string | null
          occurrence_date?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_registrations_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
        ]
      }
      announcements: {
        Row: {
          activity_id: string | null
          created_at: string
          created_by: string | null
          id: string
          message_en: string | null
          message_he: string
          title_en: string | null
          title_he: string
          updated_at: string
        }
        Insert: {
          activity_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          message_en?: string | null
          message_he: string
          title_en?: string | null
          title_he: string
          updated_at?: string
        }
        Update: {
          activity_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          message_en?: string | null
          message_he?: string
          title_en?: string | null
          title_he?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcements_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string | null
          id: string
          is_read: boolean
          message: string
          name: string
          phone: string | null
          wants_email_updates: boolean
          wants_to_volunteer: boolean
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          is_read?: boolean
          message: string
          name: string
          phone?: string | null
          wants_email_updates?: boolean
          wants_to_volunteer?: boolean
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          is_read?: boolean
          message?: string
          name?: string
          phone?: string | null
          wants_email_updates?: boolean
          wants_to_volunteer?: boolean
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      sparks_issues: {
        Row: {
          cover_image_url: string | null
          created_at: string
          created_by: string | null
          description_en: string | null
          description_he: string | null
          display_order: number
          id: string
          is_published: boolean
          issue_month: number
          issue_year: number
          pdf_url: string
          title_en: string | null
          title_he: string
          updated_at: string
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string
          created_by?: string | null
          description_en?: string | null
          description_he?: string | null
          display_order?: number
          id?: string
          is_published?: boolean
          issue_month: number
          issue_year: number
          pdf_url: string
          title_en?: string | null
          title_he: string
          updated_at?: string
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string
          created_by?: string | null
          description_en?: string | null
          description_he?: string | null
          display_order?: number
          id?: string
          is_published?: boolean
          issue_month?: number
          issue_year?: number
          pdf_url?: string
          title_en?: string | null
          title_he?: string
          updated_at?: string
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
      admin_list_registrations: {
        Args: never
        Returns: {
          activity_id: string
          attendance_status: Database["public"]["Enums"]["attendance_status"]
          created_at: string
          email: string
          full_name: string
          id: string
          notes: string
          occurrence_date: string
          payment_status: Database["public"]["Enums"]["payment_status"]
          user_id: string
        }[]
      }
      claim_first_admin: { Args: never; Returns: boolean }
      get_activity_registration_count: {
        Args: { _activity_id: string }
        Returns: number
      }
      get_announcements_for_activity: {
        Args: { _activity_id: string }
        Returns: {
          activity_id: string
          created_at: string
          id: string
          message_en: string
          message_he: string
          title_en: string
          title_he: string
        }[]
      }
      get_super_admin_id: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      list_admins: {
        Args: never
        Returns: {
          email: string
          full_name: string
          granted_at: string
          is_super: boolean
          user_id: string
        }[]
      }
      revoke_admin_by_email: { Args: { _email: string }; Returns: Json }
      revoke_user_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: undefined
      }
      set_admin_by_email: { Args: { _email: string }; Returns: Json }
      set_user_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      activity_kind: "recurring" | "one_time"
      app_role: "admin" | "verified_member" | "user"
      attendance_status: "registered" | "attended" | "no_show" | "cancelled"
      payment_status: "none" | "pending" | "paid" | "refunded"
      verification_status: "pending" | "approved" | "rejected"
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
      activity_kind: ["recurring", "one_time"],
      app_role: ["admin", "verified_member", "user"],
      attendance_status: ["registered", "attended", "no_show", "cancelled"],
      payment_status: ["none", "pending", "paid", "refunded"],
      verification_status: ["pending", "approved", "rejected"],
    },
  },
} as const
