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
          followers_count: number;
          following_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          followers_count?: number;
          following_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          followers_count?: number;
          following_count?: number;
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
          title_ar: string | null;
          description: string;
          description_ar: string | null;
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
          title_ar?: string | null;
          description: string;
          description_ar?: string | null;
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
          title_ar?: string | null;
          description?: string;
          description_ar?: string | null;
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
      follows: {
        Row: {
          follower_id: string;
          following_id: string;
          created_at: string;
        };
        Insert: {
          follower_id: string;
          following_id: string;
          created_at?: string;
        };
        Update: {
          follower_id?: string;
          following_id?: string;
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
      toggle_follow: {
        Args: { p_following_id: string };
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
