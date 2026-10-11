export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: { extensions?: Json; operationName?: string; query?: string; variables?: Json };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string;
          user_id: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      content_items: {
        Row: {
          created_at: string;
          data: NonNullable<Json>;
          id: string;
          section: string;
          sort: number;
          updated_at: string;
          visible: boolean;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          data?: NonNullable<Json>;
          id?: string;
          section: string;
          sort?: number;
          updated_at?: string;
          visible?: boolean;
        };
        Update: {
          created_at?: string;
          data?: NonNullable<Json>;
          id?: string;
          section?: string;
          sort?: number;
          updated_at?: string;
          visible?: boolean;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          admin_note: string | null;
          amount: number;
          buyer_email: string;
          buyer_name: string;
          buyer_whatsapp: string | null;
          code: string;
          created_at: string;
          id: string;
          note: string | null;
          product_id: string | null;
          product_title: string;
          proof_path: string | null;
          status: string;
          updated_at: string;
        };
        ComputedFields: never;
        Insert: {
          admin_note?: string | null;
          amount: number;
          buyer_email: string;
          buyer_name: string;
          buyer_whatsapp?: string | null;
          code?: string;
          created_at?: string;
          id?: string;
          note?: string | null;
          product_id?: string | null;
          product_title: string;
          proof_path?: string | null;
          status?: string;
          updated_at?: string;
        };
        Update: {
          admin_note?: string | null;
          amount?: number;
          buyer_email?: string;
          buyer_name?: string;
          buyer_whatsapp?: string | null;
          code?: string;
          created_at?: string;
          id?: string;
          note?: string | null;
          product_id?: string | null;
          product_title?: string;
          proof_path?: string | null;
          status?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "orders_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      product_secrets: {
        Row: {
          delivery_note: string | null;
          delivery_url: string | null;
          product_id: string;
        };
        ComputedFields: never;
        Insert: {
          delivery_note?: string | null;
          delivery_url?: string | null;
          product_id: string;
        };
        Update: {
          delivery_note?: string | null;
          delivery_url?: string | null;
          product_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_secrets_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: true;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      products: {
        Row: {
          badge: string | null;
          category: string | null;
          compare_at_price: number | null;
          cover_url: string | null;
          created_at: string;
          description: string | null;
          gallery: NonNullable<Json>;
          id: string;
          price: number;
          published: boolean;
          slug: string;
          sort: number;
          subtitle: string | null;
          title: string;
          updated_at: string;
        };
        ComputedFields: never;
        Insert: {
          badge?: string | null;
          category?: string | null;
          compare_at_price?: number | null;
          cover_url?: string | null;
          created_at?: string;
          description?: string | null;
          gallery?: NonNullable<Json>;
          id?: string;
          price?: number;
          published?: boolean;
          slug: string;
          sort?: number;
          subtitle?: string | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          badge?: string | null;
          category?: string | null;
          compare_at_price?: number | null;
          cover_url?: string | null;
          created_at?: string;
          description?: string | null;
          gallery?: NonNullable<Json>;
          id?: string;
          price?: number;
          published?: boolean;
          slug?: string;
          sort?: number;
          subtitle?: string | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          key: string;
          updated_at: string;
          value: NonNullable<Json>;
        };
        ComputedFields: never;
        Insert: {
          key: string;
          updated_at?: string;
          value?: NonNullable<Json>;
        };
        Update: {
          key?: string;
          updated_at?: string;
          value?: NonNullable<Json>;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      create_order: {
        Args: {
          p_email: string;
          p_name: string;
          p_note?: string;
          p_product_id: string;
          p_proof_path?: string;
          p_whatsapp?: string;
        };
        Returns: {
          code: string;
          id: string;
          status: string;
        }[];
      };
      get_order: {
        Args: { p_id: string };
        Returns: {
          admin_note: string;
          amount: number;
          buyer_name: string;
          code: string;
          created_at: string;
          delivery_note: string;
          delivery_url: string;
          product_slug: string;
          product_title: string;
          status: string;
        }[];
      };
      is_admin: { Args: Record<PropertyKey, never>; Returns: boolean };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const;
