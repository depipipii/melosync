import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '⚠️  Missing Supabase credentials! Periksa file .env kamu: VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY harus diisi.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          username: string | null
          display_name: string | null
          bio: string | null
          avatar_url: string | null
          location: string | null
          membership_tier: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          username?: string | null
          display_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          location?: string | null
          membership_tier?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          username?: string | null
          display_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          location?: string | null
          membership_tier?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      songs: {
        Row: {
          id: string
          artist_id: string
          album_id: string | null
          title: string
          duration_seconds: number | null
          mood: string | null
          activity: string | null
          audio_url: string | null
          cover_url: string | null
          lyrics: unknown
          glow_primary: string | null
          glow_secondary: string | null
          source_type: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
      }
      playlists: {
        Row: {
          id: string
          owner_user_id: string | null
          name: string
          description: string | null
          cover_url: string | null
          is_public: boolean
          is_system: boolean
          created_at: string
          updated_at: string
        }
      }
      artists: {
        Row: {
          id: string
          name: string
          genre: string | null
          monthly_listeners: number | null
          image_url: string | null
          description: string | null
          created_at: string
          updated_at: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          song_id: string
          created_at: string
        }
      }
      recently_played: {
        Row: {
          id: string
          user_id: string
          song_id: string
          played_at: string
        }
      }
    }
  }
}