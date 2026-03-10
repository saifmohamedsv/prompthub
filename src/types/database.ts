export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          name_ar: string;
          slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          name_ar: string;
          slug: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          name_ar?: string;
          slug?: string;
          created_at?: string;
        };
      };
      prompts: {
        Row: {
          id: string;
          title: string;
          description: string;
          prompt_text: string | null;
          link: string | null;
          image_url: string | null;
          likes_count: number;
          views_count: number;
          category_id: string | null;
          user_id: string;
          fts: unknown | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          prompt_text?: string | null;
          link?: string | null;
          image_url?: string | null;
          likes_count?: number;
          views_count?: number;
          category_id?: string | null;
          user_id: string;
          fts?: unknown | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          prompt_text?: string | null;
          link?: string | null;
          image_url?: string | null;
          likes_count?: number;
          views_count?: number;
          category_id?: string | null;
          user_id?: string;
          fts?: unknown | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      tags: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          created_at?: string;
        };
      };
      prompt_tags: {
        Row: {
          prompt_id: string;
          tag_id: string;
        };
        Insert: {
          prompt_id: string;
          tag_id: string;
        };
        Update: {
          prompt_id?: string;
          tag_id?: string;
        };
      };
      likes: {
        Row: {
          user_id: string;
          prompt_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          prompt_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          prompt_id?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      increment_views: {
        Args: { p_prompt_id: string };
        Returns: void;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
