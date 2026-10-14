import { createClient } from '@supabase/supabase-js'

let supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

const isPlaceholder = (val: string) =>
  !val ||
  val.includes('your_supabase_project_url') ||
  val.includes('your_supabase_anon_key') ||
  val.includes('placeholder') ||
  val.includes('supabase.co') && val.length < 20

if (supabaseUrl && !isPlaceholder(supabaseUrl)) {
  supabaseUrl = supabaseUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '')
}

// ======== DEMO MODE CONFIG ========
// Untuk demo, gunakan mode mock jika Supabase belum diisi
const USE_DEMO_MODE = isPlaceholder(supabaseUrl) || isPlaceholder(supabaseAnonKey)

if (USE_DEMO_MODE) {
  console.warn(
    '⚠️ [MeloSync Demo Mode] Supabase credentials belum diisi di file .env. Aplikasi berjalan dalam mode demo (login & data disimpan di localStorage).'
  )
}

const finalUrl = USE_DEMO_MODE ? 'https://demo.supabase.co' : supabaseUrl
const finalKey = USE_DEMO_MODE ? 'demo-anon-key' : supabaseAnonKey

export const supabase = createClient(finalUrl, finalKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

// ======== MOCK AUTH SYSTEM (DEMO MODE) ========
// Menyediakan auth fallback menggunakan localStorage agar app tetap bisa dijalankan
// meskipun user belum mengisi env Supabase.
export type DemoUser = {
  id: string
  email: string
  created_at: string
}

const DEMO_USERS_KEY = 'melosync_demo_users'
const DEMO_SESSION_KEY = 'melosync_demo_session'

export type DemoSession = {
  access_token: string
  user: DemoUser
  expires_at?: number
} | null

const getStorage = () => {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

const getDemoUsers = (): DemoUser[] => {
  const storage = getStorage()
  if (!storage) return []
  const raw = storage.getItem(DEMO_USERS_KEY)
  return raw ? JSON.parse(raw) : []
}

const saveDemoUsers = (users: DemoUser[]) => {
  getStorage()?.setItem(DEMO_USERS_KEY, JSON.stringify(users))
}

export const getDemoSession = (): DemoSession => {
  const storage = getStorage()
  if (!storage) return null
  const raw = storage.getItem(DEMO_SESSION_KEY)
  return raw ? JSON.parse(raw) : null
}

export const setDemoSession = (session: DemoSession) => {
  const storage = getStorage()
  if (!storage) return
  if (session) storage.setItem(DEMO_SESSION_KEY, JSON.stringify(session))
  else storage.removeItem(DEMO_SESSION_KEY)
}

export const demoSignUp = async (email: string, password: string) => {
  await new Promise(r => setTimeout(r, 600)) // simulate network
  if (!email || !password) throw new Error('Email dan password tidak boleh kosong.')
  if (password.length < 6) throw new Error('Password minimal 6 karakter.')

  const users = getDemoUsers()
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('Email ini sudah terdaftar.')
  }

  const newUser: DemoUser = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
    email,
    created_at: new Date().toISOString(),
  }
  users.push(newUser)
  saveDemoUsers(users)

  const session: DemoSession = {
    access_token: 'demo-token-' + newUser.id,
    user: newUser,
  }
  setDemoSession(session)

  return { data: { user: newUser, session } }
}

export const demoSignIn = async (email: string, password: string) => {
  await new Promise(r => setTimeout(r, 500))
  if (!email || !password) throw new Error('Email dan password tidak boleh kosong.')
  if (password.length < 6) throw new Error('Password salah.')

  const users = getDemoUsers()
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())
  if (!user) {
    // Auto-register jika belum ada (friendly UX untuk demo)
    return demoSignUp(email, password)
  }

  const session: DemoSession = {
    access_token: 'demo-token-' + user.id,
    user,
  }
  setDemoSession(session)

  return { data: { user, session } }
}

export const demoSignOut = () => {
  setDemoSession(null)
}

export const USE_DEMO_AUTH = USE_DEMO_MODE

// ======== DATABASE PLAYLISTS (SUPABASE & FALLBACK) ========
export interface PlaylistRecord {
  id: string
  name: string
  description?: string
  cover_url?: string
  user_id?: string
  owner_user_id?: string
  track_ids?: number[]
  trackIds: number[]
  created_at?: string
  createdAt: string
}

export type Playlist = PlaylistRecord

const PLAYLISTS_STORAGE_KEY = 'melosync-playlists'

export const getLocalPlaylists = (): PlaylistRecord[] => {
  try {
    const raw = localStorage.getItem(PLAYLISTS_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed)
      ? parsed.map(item => ({
          ...item,
          id: String(item.id),
          trackIds: Array.isArray(item.trackIds)
            ? item.trackIds
            : Array.isArray(item.track_ids)
            ? item.track_ids
            : [],
          createdAt: item.createdAt || item.created_at || new Date().toISOString(),
        }))
      : []
  } catch {
    return []
  }
}

export const saveLocalPlaylists = (playlists: PlaylistRecord[]) => {
  try {
    localStorage.setItem(PLAYLISTS_STORAGE_KEY, JSON.stringify(playlists))
  } catch (err) {
    console.error('Failed to save playlists to localStorage:', err)
  }
}

/**
 * Fetch all playlists for the user.
 * Tries Supabase PostgreSQL 'playlists' table first when not in demo mode.
 * Falls back to localStorage if table doesn't exist or on demo mode.
 */
export const fetchUserPlaylists = async (userId?: string): Promise<PlaylistRecord[]> => {
  if (USE_DEMO_AUTH || !userId) {
    return getLocalPlaylists()
  }

  try {
    // 1. Coba query berdasarkan user_id
    let { data, error } = await supabase
      .from('playlists')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    // 2. Jika kolom user_id tidak ada, coba owner_user_id (sesuai docs/database.md)
    if (error && (error.code === '42703' || error.message?.includes('user_id'))) {
      const retry = await supabase
        .from('playlists')
        .select('*')
        .eq('owner_user_id', userId)
        .order('created_at', { ascending: false })
      data = retry.data
      error = retry.error
    }

    if (error) {
      console.warn('⚠️ [Supabase Playlists Fetch Notice]:', error.message)
      return getLocalPlaylists()
    }

    if (data) {
      const playlists: PlaylistRecord[] = []
      for (const row of data) {
        let trackIds: number[] = []
        if (Array.isArray(row.track_ids)) {
          trackIds = row.track_ids
        } else {
          // Periksa jika ada relasi di junction table playlist_songs
          try {
            const { data: songsData } = await supabase
              .from('playlist_songs')
              .select('song_id')
              .eq('playlist_id', row.id)
            if (songsData && songsData.length > 0) {
              trackIds = songsData
                .map(s => Number(s.song_id))
                .filter(id => !isNaN(id))
            }
          } catch {
            // Abaikan jika tabel playlist_songs belum ada
          }
        }

        playlists.push({
          id: String(row.id),
          name: row.name || 'Untitled Playlist',
          description: row.description || '',
          cover_url: row.cover_url || '',
          user_id: row.user_id || row.owner_user_id || userId,
          owner_user_id: row.owner_user_id || row.user_id || userId,
          track_ids: trackIds,
          trackIds: trackIds,
          created_at: row.created_at || new Date().toISOString(),
          createdAt: row.created_at || new Date().toISOString(),
        })
      }

      saveLocalPlaylists(playlists)
      return playlists
    }

    return getLocalPlaylists()
  } catch (err) {
    console.error('Error in fetchUserPlaylists:', err)
    return getLocalPlaylists()
  }
}

/**
 * Create a new playlist in Supabase.
 * Falls back to localStorage when in demo mode or if Supabase write fails.
 */
export const createUserPlaylist = async (
  name: string,
  userId?: string,
  description?: string
): Promise<PlaylistRecord> => {
  const localId =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : String(Date.now())
  const now = new Date().toISOString()

  const newLocalItem: PlaylistRecord = {
    id: localId,
    name: name.trim(),
    description: description || '',
    user_id: userId,
    owner_user_id: userId,
    track_ids: [],
    trackIds: [],
    created_at: now,
    createdAt: now,
  }

  if (USE_DEMO_AUTH || !userId) {
    const list = getLocalPlaylists()
    const updated = [newLocalItem, ...list]
    saveLocalPlaylists(updated)
    return newLocalItem
  }

  try {
    // 1. Coba insert dengan user_id & track_ids
    let { data, error } = await supabase
      .from('playlists')
      .insert([
        {
          name: name.trim(),
          description: description || '',
          user_id: userId,
          track_ids: [],
        },
      ])
      .select()
      .single()

    // 2. Jika kolom user_id atau track_ids tidak ada, coba dengan owner_user_id
    if (
      error &&
      (error.code === '42703' ||
        error.message?.includes('user_id') ||
        error.message?.includes('track_ids'))
    ) {
      const retry = await supabase
        .from('playlists')
        .insert([
          {
            name: name.trim(),
            description: description || '',
            owner_user_id: userId,
          },
        ])
        .select()
        .single()
      data = retry.data
      error = retry.error
    }

    if (error) {
      console.warn('⚠️ [Supabase Playlist Insert Notice]:', error.message)
      const list = getLocalPlaylists()
      saveLocalPlaylists([newLocalItem, ...list])
      return newLocalItem
    }

    const created: PlaylistRecord = {
      id: String(data.id),
      name: data.name,
      description: data.description || '',
      cover_url: data.cover_url || '',
      user_id: data.user_id || data.owner_user_id || userId,
      owner_user_id: data.owner_user_id || data.user_id || userId,
      track_ids: Array.isArray(data.track_ids) ? data.track_ids : [],
      trackIds: Array.isArray(data.track_ids) ? data.track_ids : [],
      created_at: data.created_at || now,
      createdAt: data.created_at || now,
    }

    const currentList = getLocalPlaylists()
    saveLocalPlaylists([created, ...currentList.filter(p => p.id !== created.id)])
    return created
  } catch (err) {
    console.error('Error creating playlist in Supabase:', err)
    const list = getLocalPlaylists()
    saveLocalPlaylists([newLocalItem, ...list])
    return newLocalItem
  }
}

/**
 * Delete a playlist from Supabase and localStorage.
 */
export const deleteUserPlaylist = async (
  playlistId: string | number,
  userId?: string
): Promise<boolean> => {
  const pIdStr = String(playlistId)

  // Hapus dari localStorage
  const current = getLocalPlaylists()
  saveLocalPlaylists(current.filter(p => String(p.id) !== pIdStr))

  if (USE_DEMO_AUTH || !userId) {
    return true
  }

  try {
    const { error } = await supabase.from('playlists').delete().eq('id', pIdStr)

    if (error) {
      console.warn('⚠️ [Supabase Playlist Delete Notice]:', error.message)
      return false
    }

    // Bersihkan juga dari playlist_songs jika ada
    try {
      await supabase.from('playlist_songs').delete().eq('playlist_id', pIdStr)
    } catch {
      // Abaikan jika tabel tidak ada
    }

    return true
  } catch (err) {
    console.error('Error deleting playlist from Supabase:', err)
    return false
  }
}

/**
 * Add a track to a user's playlist (persists to Supabase & localStorage).
 */
export const addTrackToUserPlaylist = async (
  playlistId: string | number,
  trackId: number,
  userId?: string
): Promise<PlaylistRecord | null> => {
  const pIdStr = String(playlistId)
  const current = getLocalPlaylists()
  const playlist = current.find(p => String(p.id) === pIdStr)
  if (!playlist) return null

  const prevIds = playlist.trackIds || playlist.track_ids || []
  if (!prevIds.includes(trackId)) {
    playlist.trackIds = [...prevIds, trackId]
    playlist.track_ids = playlist.trackIds
    saveLocalPlaylists(current)
  }

  if (!USE_DEMO_AUTH && userId) {
    try {
      const { error } = await supabase
        .from('playlists')
        .update({
          track_ids: playlist.trackIds,
          updated_at: new Date().toISOString(),
        })
        .eq('id', pIdStr)

      if (error) {
        // Coba insert ke playlist_songs jika track_ids bukan kolom
        await supabase.from('playlist_songs').insert([
          {
            playlist_id: pIdStr,
            song_id: trackId.toString(),
            added_at: new Date().toISOString(),
          },
        ])
      }
    } catch (err) {
      console.warn('Notice syncing track to Supabase:', err)
    }
  }

  return playlist
}

/**
 * Remove a track from a user's playlist (persists to Supabase & localStorage).
 */
export const removeTrackFromUserPlaylist = async (
  playlistId: string | number,
  trackId: number,
  userId?: string
): Promise<PlaylistRecord | null> => {
  const pIdStr = String(playlistId)
  const current = getLocalPlaylists()
  const playlist = current.find(p => String(p.id) === pIdStr)
  if (!playlist) return null

  playlist.trackIds = (playlist.trackIds || playlist.track_ids || []).filter(
    id => id !== trackId
  )
  playlist.track_ids = playlist.trackIds
  saveLocalPlaylists(current)

  if (!USE_DEMO_AUTH && userId) {
    try {
      await supabase
        .from('playlists')
        .update({
          track_ids: playlist.trackIds,
          updated_at: new Date().toISOString(),
        })
        .eq('id', pIdStr)

      try {
        await supabase
          .from('playlist_songs')
          .delete()
          .eq('playlist_id', pIdStr)
          .eq('song_id', trackId.toString())
      } catch {
        // Abaikan
      }
    } catch (err) {
      console.warn('Notice removing track from Supabase:', err)
    }
  }

  return playlist
}

