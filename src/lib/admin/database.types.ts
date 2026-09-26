export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      artworks: {
        Row: {
          age: number;
          consent_child: boolean;
          consent_date: string;
          consent_parent: boolean;
          first_name: string;
          id: string;
          media_id: string;
          region: NonNullable<Json>;
          sort_order: number;
          status: Database["public"]["Enums"]["content_status"];
          title: NonNullable<Json>;
        };
        Insert: {
          age: number;
          consent_child: boolean;
          consent_date: string;
          consent_parent: boolean;
          first_name: string;
          id?: string;
          media_id: string;
          region: NonNullable<Json>;
          sort_order?: number;
          status?: Database["public"]["Enums"]["content_status"];
          title: NonNullable<Json>;
        };
        Update: {
          age?: number;
          consent_child?: boolean;
          consent_date?: string;
          consent_parent?: boolean;
          first_name?: string;
          id?: string;
          media_id?: string;
          region?: NonNullable<Json>;
          sort_order?: number;
          status?: Database["public"]["Enums"]["content_status"];
          title?: NonNullable<Json>;
        };
        Relationships: [
          {
            foreignKeyName: "artworks_media_id_fkey";
            columns: ["media_id"];
            isOneToOne: false;
            referencedRelation: "media";
            referencedColumns: ["id"];
          },
        ];
      };
      media: {
        Row: {
          blur: string | null;
          bright: boolean;
          bytes: number | null;
          created_at: string;
          duration_s: number | null;
          height: number | null;
          id: string;
          kind: Database["public"]["Enums"]["media_kind"];
          origin: Database["public"]["Enums"]["media_origin"];
          poster_id: string | null;
          src: string;
          storage_prefix: string | null;
          variant_base: string | null;
          variant_widths: number[];
          width: number | null;
        };
        Insert: {
          blur?: string | null;
          bright?: boolean;
          bytes?: number | null;
          created_at?: string;
          duration_s?: number | null;
          height?: number | null;
          id?: string;
          kind: Database["public"]["Enums"]["media_kind"];
          origin: Database["public"]["Enums"]["media_origin"];
          poster_id?: string | null;
          src: string;
          storage_prefix?: string | null;
          variant_base?: string | null;
          variant_widths?: number[];
          width?: number | null;
        };
        Update: {
          blur?: string | null;
          bright?: boolean;
          bytes?: number | null;
          created_at?: string;
          duration_s?: number | null;
          height?: number | null;
          id?: string;
          kind?: Database["public"]["Enums"]["media_kind"];
          origin?: Database["public"]["Enums"]["media_origin"];
          poster_id?: string | null;
          src?: string;
          storage_prefix?: string | null;
          variant_base?: string | null;
          variant_widths?: number[];
          width?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "media_poster_id_fkey";
            columns: ["poster_id"];
            isOneToOne: false;
            referencedRelation: "media";
            referencedColumns: ["id"];
          },
        ];
      };
      milestones: {
        Row: {
          icon: string;
          id: string;
          key: string;
          sort_order: number;
          status: Database["public"]["Enums"]["content_status"];
          title: NonNullable<Json>;
          updated_at: string;
          year: number | null;
        };
        Insert: {
          icon?: string;
          id?: string;
          key?: string;
          sort_order?: number;
          status?: Database["public"]["Enums"]["content_status"];
          title: NonNullable<Json>;
          updated_at?: string;
          year?: number | null;
        };
        Update: {
          icon?: string;
          id?: string;
          key?: string;
          sort_order?: number;
          status?: Database["public"]["Enums"]["content_status"];
          title?: NonNullable<Json>;
          updated_at?: string;
          year?: number | null;
        };
        Relationships: [];
      };
      news: {
        Row: {
          body: NonNullable<Json>;
          cover_alt: NonNullable<Json>;
          cover_id: string | null;
          cover_status: Database["public"]["Enums"]["content_status"];
          created_at: string;
          id: string;
          lead: NonNullable<Json>;
          published_on: string;
          quote: Json | null;
          slug: string;
          status: Database["public"]["Enums"]["content_status"];
          story_primary: Database["public"]["Enums"]["art_slot"];
          story_secondary: Database["public"]["Enums"]["art_slot"];
          title: NonNullable<Json>;
          topic: NonNullable<Json>;
          updated_at: string;
        };
        Insert: {
          body: NonNullable<Json>;
          cover_alt: NonNullable<Json>;
          cover_id?: string | null;
          cover_status?: Database["public"]["Enums"]["content_status"];
          created_at?: string;
          id?: string;
          lead: NonNullable<Json>;
          published_on?: string;
          quote?: Json | null;
          slug: string;
          status?: Database["public"]["Enums"]["content_status"];
          story_primary?: Database["public"]["Enums"]["art_slot"];
          story_secondary?: Database["public"]["Enums"]["art_slot"];
          title: NonNullable<Json>;
          topic: NonNullable<Json>;
          updated_at?: string;
        };
        Update: {
          body?: NonNullable<Json>;
          cover_alt?: NonNullable<Json>;
          cover_id?: string | null;
          cover_status?: Database["public"]["Enums"]["content_status"];
          created_at?: string;
          id?: string;
          lead?: NonNullable<Json>;
          published_on?: string;
          quote?: Json | null;
          slug?: string;
          status?: Database["public"]["Enums"]["content_status"];
          story_primary?: Database["public"]["Enums"]["art_slot"];
          story_secondary?: Database["public"]["Enums"]["art_slot"];
          title?: NonNullable<Json>;
          topic?: NonNullable<Json>;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "news_cover_id_fkey";
            columns: ["cover_id"];
            isOneToOne: false;
            referencedRelation: "media";
            referencedColumns: ["id"];
          },
        ];
      };
      news_photos: {
        Row: {
          media_id: string;
          news_id: string;
          position: number;
        };
        Insert: {
          media_id: string;
          news_id: string;
          position: number;
        };
        Update: {
          media_id?: string;
          news_id?: string;
          position?: number;
        };
        Relationships: [
          {
            foreignKeyName: "news_photos_media_id_fkey";
            columns: ["media_id"];
            isOneToOne: false;
            referencedRelation: "media";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "news_photos_news_id_fkey";
            columns: ["news_id"];
            isOneToOne: false;
            referencedRelation: "news";
            referencedColumns: ["id"];
          },
        ];
      };
      news_slug_redirects: {
        Row: {
          news_id: string;
          old_slug: string;
        };
        Insert: {
          news_id: string;
          old_slug: string;
        };
        Update: {
          news_id?: string;
          old_slug?: string;
        };
        Relationships: [
          {
            foreignKeyName: "news_slug_redirects_news_id_fkey";
            columns: ["news_id"];
            isOneToOne: false;
            referencedRelation: "news";
            referencedColumns: ["id"];
          },
        ];
      };
      partners: {
        Row: {
          group: Database["public"]["Enums"]["partner_group"];
          href: string | null;
          id: string;
          key: string;
          logo_id: string | null;
          name: Json | null;
          sort_order: number;
          status: Database["public"]["Enums"]["content_status"];
          updated_at: string;
        };
        Insert: {
          group: Database["public"]["Enums"]["partner_group"];
          href?: string | null;
          id?: string;
          key?: string;
          logo_id?: string | null;
          name?: Json | null;
          sort_order?: number;
          status?: Database["public"]["Enums"]["content_status"];
          updated_at?: string;
        };
        Update: {
          group?: Database["public"]["Enums"]["partner_group"];
          href?: string | null;
          id?: string;
          key?: string;
          logo_id?: string | null;
          name?: Json | null;
          sort_order?: number;
          status?: Database["public"]["Enums"]["content_status"];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "partners_logo_id_fkey";
            columns: ["logo_id"];
            isOneToOne: false;
            referencedRelation: "media";
            referencedColumns: ["id"];
          },
        ];
      };
      people: {
        Row: {
          bio: Json | null;
          email: string | null;
          field: Json | null;
          id: string;
          key: string;
          kind: Database["public"]["Enums"]["person_kind"];
          name: Json | null;
          photo_id: string | null;
          role: NonNullable<Json>;
          sort_order: number;
          status: Database["public"]["Enums"]["content_status"];
          updated_at: string;
        };
        Insert: {
          bio?: Json | null;
          email?: string | null;
          field?: Json | null;
          id?: string;
          key?: string;
          kind: Database["public"]["Enums"]["person_kind"];
          name?: Json | null;
          photo_id?: string | null;
          role: NonNullable<Json>;
          sort_order?: number;
          status?: Database["public"]["Enums"]["content_status"];
          updated_at?: string;
        };
        Update: {
          bio?: Json | null;
          email?: string | null;
          field?: Json | null;
          id?: string;
          key?: string;
          kind?: Database["public"]["Enums"]["person_kind"];
          name?: Json | null;
          photo_id?: string | null;
          role?: NonNullable<Json>;
          sort_order?: number;
          status?: Database["public"]["Enums"]["content_status"];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "people_photo_id_fkey";
            columns: ["photo_id"];
            isOneToOne: false;
            referencedRelation: "media";
            referencedColumns: ["id"];
          },
        ];
      };
      project_facts: {
        Row: {
          fact: Database["public"]["Enums"]["project_fact"];
          project_key: string;
          status: Database["public"]["Enums"]["content_status"];
          value: Json | null;
        };
        Insert: {
          fact: Database["public"]["Enums"]["project_fact"];
          project_key: string;
          status: Database["public"]["Enums"]["content_status"];
          value?: Json | null;
        };
        Update: {
          fact?: Database["public"]["Enums"]["project_fact"];
          project_key?: string;
          status?: Database["public"]["Enums"]["content_status"];
          value?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: "project_facts_project_key_fkey";
            columns: ["project_key"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["key"];
          },
        ];
      };
      project_media: {
        Row: {
          alt: NonNullable<Json>;
          main_id: string;
          mobile_mp4_id: string | null;
          mobile_webm_id: string | null;
          poster_id: string | null;
          project_key: string;
          role: string;
          status: Database["public"]["Enums"]["content_status"] | null;
          webm_id: string | null;
        };
        Insert: {
          alt: NonNullable<Json>;
          main_id: string;
          mobile_mp4_id?: string | null;
          mobile_webm_id?: string | null;
          poster_id?: string | null;
          project_key: string;
          role: string;
          status?: Database["public"]["Enums"]["content_status"] | null;
          webm_id?: string | null;
        };
        Update: {
          alt?: NonNullable<Json>;
          main_id?: string;
          mobile_mp4_id?: string | null;
          mobile_webm_id?: string | null;
          poster_id?: string | null;
          project_key?: string;
          role?: string;
          status?: Database["public"]["Enums"]["content_status"] | null;
          webm_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "project_media_main_id_fkey";
            columns: ["main_id"];
            isOneToOne: false;
            referencedRelation: "media";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "project_media_mobile_mp4_id_fkey";
            columns: ["mobile_mp4_id"];
            isOneToOne: false;
            referencedRelation: "media";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "project_media_mobile_webm_id_fkey";
            columns: ["mobile_webm_id"];
            isOneToOne: false;
            referencedRelation: "media";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "project_media_poster_id_fkey";
            columns: ["poster_id"];
            isOneToOne: false;
            referencedRelation: "media";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "project_media_project_key_fkey";
            columns: ["project_key"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["key"];
          },
          {
            foreignKeyName: "project_media_webm_id_fkey";
            columns: ["webm_id"];
            isOneToOne: false;
            referencedRelation: "media";
            referencedColumns: ["id"];
          },
        ];
      };
      projects: {
        Row: {
          age_from: number;
          age_status: Database["public"]["Enums"]["content_status"];
          age_to: number;
          cost_free: boolean | null;
          cost_status: Database["public"]["Enums"]["content_status"];
          external_href: string;
          external_label: string;
          flagship: boolean;
          highlights: NonNullable<Json>;
          key: string;
          name: NonNullable<Json>;
          status: Database["public"]["Enums"]["content_status"];
          tagline: NonNullable<Json>;
          updated_at: string;
        };
        Insert: {
          age_from: number;
          age_status: Database["public"]["Enums"]["content_status"];
          age_to: number;
          cost_free?: boolean | null;
          cost_status: Database["public"]["Enums"]["content_status"];
          external_href: string;
          external_label: string;
          flagship?: boolean;
          highlights: NonNullable<Json>;
          key: string;
          name: NonNullable<Json>;
          status: Database["public"]["Enums"]["content_status"];
          tagline: NonNullable<Json>;
          updated_at?: string;
        };
        Update: {
          age_from?: number;
          age_status?: Database["public"]["Enums"]["content_status"];
          age_to?: number;
          cost_free?: boolean | null;
          cost_status?: Database["public"]["Enums"]["content_status"];
          external_href?: string;
          external_label?: string;
          flagship?: boolean;
          highlights?: NonNullable<Json>;
          key?: string;
          name?: NonNullable<Json>;
          status?: Database["public"]["Enums"]["content_status"];
          tagline?: NonNullable<Json>;
          updated_at?: string;
        };
        Relationships: [];
      };
      site_contacts: {
        Row: {
          address: Json | null;
          address_status: Database["public"]["Enums"]["content_status"];
          email: string | null;
          email_status: Database["public"]["Enums"]["content_status"];
          hours: Json | null;
          hours_status: Database["public"]["Enums"]["content_status"];
          id: number;
          locality: string | null;
          map_lat: number | null;
          map_lng: number | null;
          map_status: Database["public"]["Enums"]["content_status"];
          phones: string[];
          phones_status: Database["public"]["Enums"]["content_status"];
          postal_code: string | null;
          telegram: string | null;
          telegram_status: Database["public"]["Enums"]["content_status"];
          updated_at: string;
        };
        Insert: {
          address?: Json | null;
          address_status?: Database["public"]["Enums"]["content_status"];
          email?: string | null;
          email_status?: Database["public"]["Enums"]["content_status"];
          hours?: Json | null;
          hours_status?: Database["public"]["Enums"]["content_status"];
          id?: number;
          locality?: string | null;
          map_lat?: number | null;
          map_lng?: number | null;
          map_status?: Database["public"]["Enums"]["content_status"];
          phones?: string[];
          phones_status?: Database["public"]["Enums"]["content_status"];
          postal_code?: string | null;
          telegram?: string | null;
          telegram_status?: Database["public"]["Enums"]["content_status"];
          updated_at?: string;
        };
        Update: {
          address?: Json | null;
          address_status?: Database["public"]["Enums"]["content_status"];
          email?: string | null;
          email_status?: Database["public"]["Enums"]["content_status"];
          hours?: Json | null;
          hours_status?: Database["public"]["Enums"]["content_status"];
          id?: number;
          locality?: string | null;
          map_lat?: number | null;
          map_lng?: number | null;
          map_status?: Database["public"]["Enums"]["content_status"];
          phones?: string[];
          phones_status?: Database["public"]["Enums"]["content_status"];
          postal_code?: string | null;
          telegram?: string | null;
          telegram_status?: Database["public"]["Enums"]["content_status"];
          updated_at?: string;
        };
        Relationships: [];
      };
      site_texts: {
        Row: {
          key: string;
          updated_at: string;
          value: NonNullable<Json>;
        };
        Insert: {
          key: string;
          updated_at?: string;
          value: NonNullable<Json>;
        };
        Update: {
          key?: string;
          updated_at?: string;
          value?: NonNullable<Json>;
        };
        Relationships: [];
      };
      site_word_allowlist: {
        Row: {
          word: string;
        };
        Insert: {
          word: string;
        };
        Update: {
          word?: string;
        };
        Relationships: [];
      };
      social_links: {
        Row: {
          href: string;
          label: string;
          network: Database["public"]["Enums"]["social_network"];
          sort_order: number;
          status: Database["public"]["Enums"]["content_status"];
        };
        Insert: {
          href: string;
          label: string;
          network: Database["public"]["Enums"]["social_network"];
          sort_order?: number;
          status: Database["public"]["Enums"]["content_status"];
        };
        Update: {
          href?: string;
          label?: string;
          network?: Database["public"]["Enums"]["social_network"];
          sort_order?: number;
          status?: Database["public"]["Enums"]["content_status"];
        };
        Relationships: [];
      };
      upop_shots: {
        Row: {
          alt: Json | null;
          frame: Database["public"]["Enums"]["upop_frame"];
          kind: Database["public"]["Enums"]["media_kind"];
          media_id: string;
          motion: Database["public"]["Enums"]["upop_motion"];
          position: number;
          poster_id: string | null;
        };
        Insert: {
          alt?: Json | null;
          frame: Database["public"]["Enums"]["upop_frame"];
          kind: Database["public"]["Enums"]["media_kind"];
          media_id: string;
          motion: Database["public"]["Enums"]["upop_motion"];
          position: number;
          poster_id?: string | null;
        };
        Update: {
          alt?: Json | null;
          frame?: Database["public"]["Enums"]["upop_frame"];
          kind?: Database["public"]["Enums"]["media_kind"];
          media_id?: string;
          motion?: Database["public"]["Enums"]["upop_motion"];
          position?: number;
          poster_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "upop_shots_media_id_fkey";
            columns: ["media_id"];
            isOneToOne: false;
            referencedRelation: "media";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "upop_shots_poster_id_fkey";
            columns: ["poster_id"];
            isOneToOne: false;
            referencedRelation: "media";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      admin_allow_words: { Args: { words: string[] }; Returns: number };
      admin_content_log: {
        Args: { before_id?: number; max_rows?: number };
        Returns: {
          action: string;
          actor: string;
          after: Json;
          at: string;
          before: Json;
          entity: string;
          entity_key: string;
          id: number;
        }[];
      };
      admin_delete_media: { Args: { target: string }; Returns: string };
      admin_delete_milestone: { Args: { expected: string; target: string }; Returns: string };
      admin_delete_news: { Args: { expected: string; target: string }; Returns: string };
      admin_delete_partner: { Args: { expected: string; target: string }; Returns: string };
      admin_delete_person: { Args: { expected: string; target: string }; Returns: string };
      admin_delete_text: { Args: { text_key: string }; Returns: boolean };
      admin_get: { Args: { entity: string; entity_key?: string }; Returns: Json };
      admin_media_usage: {
        Args: Record<PropertyKey, never>;
        Returns: {
          media_id: string;
          uses: number;
        }[];
      };
      admin_register_media: {
        Args: { p: Json };
        Returns: {
          blur: string | null;
          bright: boolean;
          bytes: number | null;
          created_at: string;
          duration_s: number | null;
          height: number | null;
          id: string;
          kind: Database["public"]["Enums"]["media_kind"];
          origin: Database["public"]["Enums"]["media_origin"];
          poster_id: string | null;
          src: string;
          storage_prefix: string | null;
          variant_base: string | null;
          variant_widths: number[];
          width: number | null;
        };
        SetofOptions: {
          from: "*";
          to: "media";
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      admin_reorder: { Args: { entity: string; keys: string[] }; Returns: undefined };
      admin_save_contacts: { Args: { expected?: string; p: Json }; Returns: string };
      admin_save_milestone: {
        Args: { expected?: string; p: Json };
        Returns: {
          id: string;
          key: string;
          updated_at: string;
        }[];
      };
      admin_save_news: {
        Args: { expected?: string; p: Json };
        Returns: {
          id: string;
          old_slug: string;
          slug: string;
          updated_at: string;
        }[];
      };
      admin_save_partner: {
        Args: { expected?: string; p: Json };
        Returns: {
          id: string;
          key: string;
          updated_at: string;
        }[];
      };
      admin_save_person: {
        Args: { expected?: string; p: Json };
        Returns: {
          id: string;
          key: string;
          updated_at: string;
        }[];
      };
      admin_save_project: { Args: { expected?: string; p: Json }; Returns: string };
      admin_save_socials: { Args: { p: Json }; Returns: undefined };
      admin_save_text: {
        Args: { expected?: string; text_key: string; text_value: Json };
        Returns: string;
      };
      admin_save_upop_shots: { Args: { p: Json }; Returns: undefined };
      admin_slug_available: { Args: { candidate: string; own?: string }; Returns: boolean };
      content_snapshot: { Args: Record<PropertyKey, never>; Returns: Json };
    };
    Enums: {
      art_slot: "art-1" | "art-2" | "art-3" | "art-4" | "art-5" | "art-6" | "art-7";
      content_status: "confirmed" | "draft" | "pending";
      media_kind: "image" | "video";
      media_origin: "static" | "storage";
      partner_group: "state" | "international" | "creative" | "sponsors";
      person_kind: "leader" | "expert";
      project_fact: "format" | "place" | "schedule" | "teacher";
      social_network: "telegram" | "instagram" | "youtube" | "facebook";
      upop_frame: "stage" | "gold" | "glass" | "ticket" | "film" | "mat";
      upop_motion:
        "curtain" | "slide-end" | "wipe" | "rise" | "iris" | "tilt" | "slide-start" | "zoom";
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
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
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
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
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
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
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
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
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
  public: {
    Enums: {
      art_slot: ["art-1", "art-2", "art-3", "art-4", "art-5", "art-6", "art-7"],
      content_status: ["confirmed", "draft", "pending"],
      media_kind: ["image", "video"],
      media_origin: ["static", "storage"],
      partner_group: ["state", "international", "creative", "sponsors"],
      person_kind: ["leader", "expert"],
      project_fact: ["format", "place", "schedule", "teacher"],
      social_network: ["telegram", "instagram", "youtube", "facebook"],
      upop_frame: ["stage", "gold", "glass", "ticket", "film", "mat"],
      upop_motion: ["curtain", "slide-end", "wipe", "rise", "iris", "tilt", "slide-start", "zoom"],
    },
  },
} as const;
