/* ============================================================
   Migration: 001_add_missing_columns
   Description: Adds missing columns to profiles & playlists,
                installs handle_updated_at() trigger function,
                attaches triggers, and creates RLS policy for
                playlists ownership management.
   Compatible with: PostgreSQL < 15 (DO $$ policy guard)
   ============================================================ */

/* ------------------------------------------------------------
   1. profiles — add total_listening_seconds
   ------------------------------------------------------------ */
ALTER TABLE public.profiles
    ADD COLUMN IF NOT EXISTS total_listening_seconds INTEGER DEFAULT 0;

/* ------------------------------------------------------------
   2. playlists — add user_id, track_ids, owner_user_id
   ------------------------------------------------------------ */
ALTER TABLE public.playlists
    ADD COLUMN IF NOT EXISTS user_id       UUID REFERENCES auth.users (id) ON DELETE CASCADE,
    ADD COLUMN IF NOT EXISTS track_ids     INTEGER[],
    ADD COLUMN IF NOT EXISTS owner_user_id UUID REFERENCES auth.users (id) ON DELETE CASCADE;

/* ------------------------------------------------------------
   3. Trigger function — handle_updated_at()
      Sets updated_at to NOW() before every UPDATE.
   ------------------------------------------------------------ */
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

/* ------------------------------------------------------------
   4. Trigger on profiles
   ------------------------------------------------------------ */
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM   pg_trigger
        WHERE  tgname   = 'set_profiles_updated_at'
          AND  tgrelid  = 'public.profiles'::regclass
    ) THEN
        CREATE TRIGGER set_profiles_updated_at
            BEFORE UPDATE ON public.profiles
            FOR EACH ROW
            EXECUTE FUNCTION public.handle_updated_at();
    END IF;
END;
$$;

/* ------------------------------------------------------------
   5. Trigger on playlists
   ------------------------------------------------------------ */
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM   pg_trigger
        WHERE  tgname   = 'set_playlists_updated_at'
          AND  tgrelid  = 'public.playlists'::regclass
    ) THEN
        CREATE TRIGGER set_playlists_updated_at
            BEFORE UPDATE ON public.playlists
            FOR EACH ROW
            EXECUTE FUNCTION public.handle_updated_at();
    END IF;
END;
$$;

/* ------------------------------------------------------------
   6. RLS — enable on playlists (idempotent)
   ------------------------------------------------------------ */
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;

/* ------------------------------------------------------------
   7. RLS Policy — playlists_manage_own
      Allows a user to SELECT / INSERT / UPDATE / DELETE rows
      where user_id OR owner_user_id matches their auth.uid().
      Uses DO $$ guard for PG < 15 (no CREATE POLICY IF NOT EXISTS).
   ------------------------------------------------------------ */
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM   pg_policies
        WHERE  schemaname = 'public'
          AND  tablename  = 'playlists'
          AND  policyname = 'playlists_manage_own'
    ) THEN
        CREATE POLICY playlists_manage_own
            ON public.playlists
            FOR ALL
            USING (
                user_id       = auth.uid()
                OR owner_user_id = auth.uid()
            )
            WITH CHECK (
                user_id       = auth.uid()
                OR owner_user_id = auth.uid()
            );
    END IF;
END;
$$;
