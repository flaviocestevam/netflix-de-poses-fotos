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
      categories: {
        Row: {
          category_type: string
          cover_image: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          pose_count: number | null
          slug: string
          sort_order: number | null
          tag: string | null
        }
        Insert: {
          category_type?: string
          cover_image?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          pose_count?: number | null
          slug: string
          sort_order?: number | null
          tag?: string | null
        }
        Update: {
          category_type?: string
          cover_image?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          pose_count?: number | null
          slug?: string
          sort_order?: number | null
          tag?: string | null
        }
        Relationships: []
      }
      downloads: {
        Row: {
          access_level: string
          cover_image: string | null
          created_at: string
          description: string | null
          file_url: string | null
          id: string
          title: string
          total_items: number | null
          type: string
        }
        Insert: {
          access_level?: string
          cover_image?: string | null
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          title: string
          total_items?: number | null
          type?: string
        }
        Update: {
          access_level?: string
          cover_image?: string | null
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          title?: string
          total_items?: number | null
          type?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          list_name: string | null
          pose_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          list_name?: string | null
          pose_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          list_name?: string | null
          pose_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_pose_id_fkey"
            columns: ["pose_id"]
            isOneToOne: false
            referencedRelation: "poses"
            referencedColumns: ["id"]
          },
        ]
      }
      poses: {
        Row: {
          category_id: string | null
          common_mistake: string | null
          created_at: string
          description: string | null
          difficulty: string
          downloadable: boolean
          estimated_seconds: number
          framing: string | null
          how_to_do: string | null
          id: string
          image_url: string | null
          is_30s: boolean
          is_sos: boolean
          natural_tip: string | null
          scenario: string | null
          style: string | null
          tags: string[] | null
          title: string
          what_he_does: string | null
          what_she_does: string | null
          when_to_use: string | null
        }
        Insert: {
          category_id?: string | null
          common_mistake?: string | null
          created_at?: string
          description?: string | null
          difficulty?: string
          downloadable?: boolean
          estimated_seconds?: number
          framing?: string | null
          how_to_do?: string | null
          id?: string
          image_url?: string | null
          is_30s?: boolean
          is_sos?: boolean
          natural_tip?: string | null
          scenario?: string | null
          style?: string | null
          tags?: string[] | null
          title: string
          what_he_does?: string | null
          what_she_does?: string | null
          when_to_use?: string | null
        }
        Update: {
          category_id?: string | null
          common_mistake?: string | null
          created_at?: string
          description?: string | null
          difficulty?: string
          downloadable?: boolean
          estimated_seconds?: number
          framing?: string | null
          how_to_do?: string | null
          id?: string
          image_url?: string | null
          is_30s?: boolean
          is_sos?: boolean
          natural_tip?: string | null
          scenario?: string | null
          style?: string | null
          tags?: string[] | null
          title?: string
          what_he_does?: string | null
          what_she_does?: string | null
          when_to_use?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "poses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          access_status: string
          created_at: string
          device_count: number
          email: string | null
          id: string
          last_login: string | null
          name: string | null
        }
        Insert: {
          access_status?: string
          created_at?: string
          device_count?: number
          email?: string | null
          id: string
          last_login?: string | null
          name?: string | null
        }
        Update: {
          access_status?: string
          created_at?: string
          device_count?: number
          email?: string | null
          id?: string
          last_login?: string | null
          name?: string | null
        }
        Relationships: []
      }
      script_poses: {
        Row: {
          id: string
          order_number: number
          pose_id: string
          script_id: string
        }
        Insert: {
          id?: string
          order_number?: number
          pose_id: string
          script_id: string
        }
        Update: {
          id?: string
          order_number?: number
          pose_id?: string
          script_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "script_poses_pose_id_fkey"
            columns: ["pose_id"]
            isOneToOne: false
            referencedRelation: "poses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "script_poses_script_id_fkey"
            columns: ["script_id"]
            isOneToOne: false
            referencedRelation: "scripts"
            referencedColumns: ["id"]
          },
        ]
      }
      scripts: {
        Row: {
          cover_image: string | null
          created_at: string
          description: string | null
          id: string
          scenario: string | null
          title: string
          total_poses: number | null
        }
        Insert: {
          cover_image?: string | null
          created_at?: string
          description?: string | null
          id?: string
          scenario?: string | null
          title: string
          total_poses?: number | null
        }
        Update: {
          cover_image?: string | null
          created_at?: string
          description?: string | null
          id?: string
          scenario?: string | null
          title?: string
          total_poses?: number | null
        }
        Relationships: []
      }
      trip_poses: {
        Row: {
          created_at: string
          id: string
          order_number: number
          pose_id: string
          section_id: string | null
          status: string
          trip_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          order_number?: number
          pose_id: string
          section_id?: string | null
          status?: string
          trip_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          order_number?: number
          pose_id?: string
          section_id?: string | null
          status?: string
          trip_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_poses_pose_id_fkey"
            columns: ["pose_id"]
            isOneToOne: false
            referencedRelation: "poses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_poses_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "trip_sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_poses_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_sections: {
        Row: {
          created_at: string
          id: string
          order_number: number
          section_name: string
          trip_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          order_number?: number
          section_name: string
          trip_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          order_number?: number
          section_name?: string
          trip_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_sections_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trips: {
        Row: {
          cover_image: string | null
          created_at: string
          destination: string | null
          end_date: string | null
          id: string
          notes: string | null
          start_date: string | null
          trip_name: string
          trip_type: string | null
          user_id: string
        }
        Insert: {
          cover_image?: string | null
          created_at?: string
          destination?: string | null
          end_date?: string | null
          id?: string
          notes?: string | null
          start_date?: string | null
          trip_name: string
          trip_type?: string | null
          user_id: string
        }
        Update: {
          cover_image?: string | null
          created_at?: string
          destination?: string | null
          end_date?: string | null
          id?: string
          notes?: string | null
          start_date?: string | null
          trip_name?: string
          trip_type?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
