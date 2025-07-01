export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      sperm_analysis_results: {
        Row: {
          analysis_duration: number
          analysis_notes: string | null
          concentration: number | null
          confidence_score: number
          created_at: string
          detected_objects: Json | null
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          head_defects_percentage: number | null
          id: string
          image_quality: string | null
          immotile_percentage: number | null
          leucocytes_count: number | null
          midpiece_defects_percentage: number | null
          morphology_percentage: number | null
          motility_percentage: number | null
          non_progressive_motility_percentage: number | null
          ph_level: number | null
          progressive_motility_percentage: number | null
          sperm_count: number
          tail_defects_percentage: number | null
          updated_at: string
          user_id: string
          vitality_percentage: number | null
          volume_ml: number | null
          who_classification: string | null
        }
        Insert: {
          analysis_duration: number
          analysis_notes?: string | null
          concentration?: number | null
          confidence_score: number
          created_at?: string
          detected_objects?: Json | null
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          head_defects_percentage?: number | null
          id?: string
          image_quality?: string | null
          immotile_percentage?: number | null
          leucocytes_count?: number | null
          midpiece_defects_percentage?: number | null
          morphology_percentage?: number | null
          motility_percentage?: number | null
          non_progressive_motility_percentage?: number | null
          ph_level?: number | null
          progressive_motility_percentage?: number | null
          sperm_count?: number
          tail_defects_percentage?: number | null
          updated_at?: string
          user_id: string
          vitality_percentage?: number | null
          volume_ml?: number | null
          who_classification?: string | null
        }
        Update: {
          analysis_duration?: number
          analysis_notes?: string | null
          concentration?: number | null
          confidence_score?: number
          created_at?: string
          detected_objects?: Json | null
          file_name?: string
          file_size?: number
          file_type?: string
          file_url?: string
          head_defects_percentage?: number | null
          id?: string
          image_quality?: string | null
          immotile_percentage?: number | null
          leucocytes_count?: number | null
          midpiece_defects_percentage?: number | null
          morphology_percentage?: number | null
          motility_percentage?: number | null
          non_progressive_motility_percentage?: number | null
          ph_level?: number | null
          progressive_motility_percentage?: number | null
          sperm_count?: number
          tail_defects_percentage?: number | null
          updated_at?: string
          user_id?: string
          vitality_percentage?: number | null
          volume_ml?: number | null
          who_classification?: string | null
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
