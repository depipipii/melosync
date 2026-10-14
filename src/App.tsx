import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Heart, MoreHorizontal, Clock, Search, Maximize2, Minimize2, LogOut, Lock, Moon, Sun, Plus, X, Music2, ChevronLeft, Trash2, Check } from 'lucide-react';

import { MOODS, MOOD_GENRES, TRACKS, GENRES, LIBRARY_ARTISTS } from './data/musicData';
import Sidebar from './components/Sidebar';
import PlayerBar from './components/PlayerBar';
import Profile from './components/Profile';
import MobileNav from './components/MobileNav';
import Auth from './components/Auth';
import {
  supabase,
  getDemoSession,
  demoSignOut,
  USE_DEMO_AUTH,
  fetchUserPlaylists,
  createUserPlaylist,
  deleteUserPlaylist,
  addTrackToUserPlaylist,
  removeTrackFromUserPlaylist,
} from './lib/supabase';
import type { PlaylistRecord, DemoSession } from './lib/supabase';

// Unified session type yang kompatibel dengan Supabase Session dan DemoSession
type AppSession = DemoSession | {
  access_token: string;
  user: { id: string; email?: string | null };
} | null

export default function App() {
  const [session, setSession] = useState<AppSession>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const initSession = async () => {
      try {
        if (USE_DEMO_AUTH) {
          // ===== DEMO MODE =====
          const demoSess = getDemoSession()
          if (isMounted) setSession(demoSess)
        } else {
          // ===== REAL SUPABASE =====
          const { data } = await supabase.auth.getSession()
          if (isMounted) setSession(data.session as AppSession)

          const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
            if (isMounted) setSession(newSession as AppSession)
          })
          return () => subscription.unsubscribe()
        }
      } catch (err) {
        console.error('Session init error:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    initSession()

    return () => { isMounted = false }
  }, [])

  const handleLogout = async () => {
    try {
      if (USE_DEMO_AUTH) {
        demoSignOut()
        setSession(null)
      } else {
        await supabase.auth.signOut()
      }
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  const [activeTab, setActiveTab] = useState('Home');
  const [showLyrics, setShowLyrics] = useState(false);

  const [currentTrack, setCurrentTrack] = useState(TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(75);
  const [activeMood, setActiveMood] = useState('All');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);
  const [libraryTab, setLibraryTab] = useState<'Favorites' | 'Playlists' | 'Albums' | 'Artists'>('Favorites');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleTabChange = useCallback((tab: string) => {
    if (tab === 'Favorites') {
      setActiveTab('Library');
      setLibraryTab('Favorites');
    } else {
      setActiveTab(tab);
    }
    setShowLyrics(false);
  }, []);

  // User-created playlists (persisted to Supabase / localStorage)
  const [userPlaylists, setUserPlaylists] = useState<PlaylistRecord[]>(() => {
    try {
      const raw = localStorage.getItem('melosync-playlists');
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed)
        ? parsed.map(item => ({
            ...item,
            id: String(item.id),
            trackIds: Array.isArray(item.trackIds) ? item.trackIds : Array.isArray(item.track_ids) ? item.track_ids : [],
            createdAt: item.createdAt || item.created_at || new Date().toISOString()
          }))
        : [];
    } catch {
      return [];
    }
  });
  const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistRecord | null>(null);
  const [showAddToPlaylistModal, setShowAddToPlaylistModal] = useState<number | null>(null);
  const [playlistToast, setPlaylistToast] = useState<string | null>(null);
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('melosync-theme');
    if (saved !== null) return saved === 'dark';
    return true; // default dark
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalReason, setAuthModalReason] = useState('');
  const listeningTimeRef = useRef(0);
  const lastSyncTimeRef = useRef(Date.now());

  // Handle Theme Switching
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('melosync-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const userId = session?.user?.id;

  // Sync & fetch playlists from Supabase (or localStorage in demo mode)
  useEffect(() => {
    let isMounted = true;
    const loadPlaylists = async () => {
      try {
        const data = await fetchUserPlaylists(session?.user?.id);
        if (isMounted) {
          setUserPlaylists(data);
          if (selectedPlaylist) {
            const updated = data.find(p => String(p.id) === String(selectedPlaylist.id));
            if (updated) setSelectedPlaylist(updated);
          }
        }
      } catch (err) {
        console.error('Error fetching playlists from Supabase:', err);
      }
    };

    loadPlaylists();
    return () => { isMounted = false; };
  }, [session?.user?.id]);

  const requireAuth = (reason: string = 'Masuk ke akun MeloSync kamu.') => {
    setAuthModalReason(reason);
    setIsAuthModalOpen(true);
    return false;
  };

  // Record recently played track
  const recordPlay = useCallback(async (trackId: number) => {
    if (!userId || USE_DEMO_AUTH) return;

    try {
      await supabase
        .from('recently_played')
        .insert([{
          user_id: userId,
          song_id: trackId.toString(),
          played_at: new Date().toISOString()
        }]);
    } catch {
      // Silent fail - demo mode / RLS not set
    }
  }, [userId]);

  // Sync listening time to database
  const syncListeningTime = useCallback(async () => {
    if (!userId || listeningTimeRef.current === 0 || USE_DEMO_AUTH) return;

    const timeToSync = listeningTimeRef.current;
    listeningTimeRef.current = 0;

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('total_listening_seconds')
        .eq('id', userId)
        .single();

      const currentTotal = profile?.total_listening_seconds || 0;

      await supabase
        .from('profiles')
        .update({
          total_listening_seconds: currentTotal + timeToSync,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
    } catch {
      listeningTimeRef.current += timeToSync;
    }
  }, [userId]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => { });
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => { });
      }
    }
  };

  const toggleFavorite = (id: number) => {
    if (!session) {
      requireAuth('Login untuk menyimpan lagu ke favorit kamu.');
      return;
    }
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };

  const lyricsContainerRef = useRef<HTMLDivElement>(null);

  const handlePlayPause = useCallback(() => setIsPlaying(prev => !prev), []);

  const handleNext = useCallback(() => {
    if (repeatMode === 'one') {
      setProgress(0);
      setIsPlaying(true);
      return;
    }

    const currentIndex = TRACKS.findIndex(t => t.id === currentTrack.id);
    let nextIndex;

    if (isShuffle) {
      // Pick a random track that isn't the current one
      let newIndex = Math.floor(Math.random() * TRACKS.length);
      while (TRACKS.length > 1 && newIndex === currentIndex) {
        newIndex = Math.floor(Math.random() * TRACKS.length);
      }
      nextIndex = newIndex;
    } else {
      nextIndex = (currentIndex + 1) % TRACKS.length;
      
      // If repeatMode is 'none' and we've reached the end, stop playing
      if (repeatMode === 'none' && currentIndex === TRACKS.length - 1) {
        setIsPlaying(false);
        setProgress(0);
        return;
      }
    }

    const nextTrack = TRACKS[nextIndex];
    setCurrentTrack(nextTrack);
    setProgress(0);
    setIsPlaying(true);
    recordPlay(nextTrack.id);
  }, [currentTrack, recordPlay, isShuffle, repeatMode]);

  const handlePrev = useCallback(() => {
    if (progress > 5) {
      setProgress(0);
    } else {
      const currentIndex = TRACKS.findIndex(t => t.id === currentTrack.id);
      let prevIndex;

      if (isShuffle) {
        let newIndex = Math.floor(Math.random() * TRACKS.length);
        while (TRACKS.length > 1 && newIndex === currentIndex) {
          newIndex = Math.floor(Math.random() * TRACKS.length);
        }
        prevIndex = newIndex;
      } else {
        prevIndex = (currentIndex - 1 + TRACKS.length) % TRACKS.length;
      }

      const prevTrack = TRACKS[prevIndex];
      setCurrentTrack(prevTrack);
      setProgress(0);
      setIsPlaying(true);
      recordPlay(prevTrack.id);
    }
  }, [currentTrack, progress, recordPlay, isShuffle]);

  // Playback simulation & Listening Time Tracking
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (isPlaying) {
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= currentTrack.duration) {
            handleNext();
            return 0;
          }
          listeningTimeRef.current += 1;
          if (Date.now() - lastSyncTimeRef.current > 30000) {
            syncListeningTime();
            lastSyncTimeRef.current = Date.now();
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
      if (listeningTimeRef.current > 5) {
        syncListeningTime();
      }
    };
  }, [isPlaying, currentTrack, handleNext, syncListeningTime]);

  const handleTrackSelect = (track: typeof TRACKS[0]) => {
    setHasStartedPlaying(true);
    if (currentTrack.id === track.id) {
      handlePlayPause();
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
      setProgress(0);
      recordPlay(track.id);
    }
  };

  const getActiveLyricIndex = () => {
    if (!currentTrack.lyrics) return -1;
    let activeIdx = -1;
    for (let i = 0; i < currentTrack.lyrics.length; i++) {
      if (progress >= currentTrack.lyrics[i].time) activeIdx = i;
      else break;
    }
    return activeIdx;
  };

  const activeLyricIndex = getActiveLyricIndex();

  // Cinematic Lyrics Auto-Scroll
  useEffect(() => {
    if (showLyrics && lyricsContainerRef.current) {
      const activeEl = document.getElementById(`lyric-${activeLyricIndex}`);
      if (activeEl) activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeLyricIndex, showLyrics]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const filteredTracks = TRACKS.filter(t => {
    const associatedGenres = MOOD_GENRES[activeMood] ?? [];
    const matchesMood = activeMood === 'All'
      || t.mood === activeMood
      || associatedGenres.includes(t.genre ?? '');
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.artist.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMood && matchesSearch;
  });

  // Library: user-created playlists (Supabase backend with fallback)
  const showToast = (msg: string) => {
    setPlaylistToast(msg);
    setTimeout(() => setPlaylistToast(null), 3000);
  };

  const handleCreatePlaylist = async () => {
    const name = newPlaylistName.trim();
    if (!name || isCreatingPlaylist) return;

    if (!session) {
      setShowCreatePlaylist(false);
      requireAuth('Login untuk membuat playlist kamu.');
      return;
    }

    try {
      setIsCreatingPlaylist(true);
      const newPl = await createUserPlaylist(name, session.user.id);
      setUserPlaylists(prev => [newPl, ...prev.filter(p => String(p.id) !== String(newPl.id))]);
      setNewPlaylistName('');
      setShowCreatePlaylist(false);
      showToast(`Playlist "${newPl.name}" berhasil dibuat!`);
    } catch (err) {
      console.error('Error creating playlist:', err);
    } finally {
      setIsCreatingPlaylist(false);
    }
  };

  const handleDeletePlaylist = async (id: string | number) => {
    try {
      await deleteUserPlaylist(id, session?.user?.id);
      setUserPlaylists(prev => prev.filter(p => String(p.id) !== String(id)));
      if (selectedPlaylist && String(selectedPlaylist.id) === String(id)) {
        setSelectedPlaylist(null);
      }
      showToast('Playlist berhasil dihapus');
    } catch (err) {
      console.error('Error deleting playlist:', err);
    }
  };

  const handleToggleTrackInPlaylist = async (playlistId: string | number, trackId: number) => {
    if (!session) {
      setShowAddToPlaylistModal(null);
      requireAuth('Login untuk mengelola playlist kamu.');
      return;
    }

    const playlist = userPlaylists.find(p => String(p.id) === String(playlistId));
    if (!playlist) return;

    const currentTrackIds = playlist.trackIds || playlist.track_ids || [];
    const isAlreadyIn = currentTrackIds.includes(trackId);

    try {
      let updated: PlaylistRecord | null = null;
      if (isAlreadyIn) {
        updated = await removeTrackFromUserPlaylist(playlistId, trackId, session.user.id);
        showToast(`Lagu dihapus dari ${playlist.name}`);
      } else {
        updated = await addTrackToUserPlaylist(playlistId, trackId, session.user.id);
        showToast(`Lagu ditambahkan ke ${playlist.name}!`);
      }

      if (updated) {
        setUserPlaylists(prev => prev.map(p => String(p.id) === String(playlistId) ? updated! : p));
        if (selectedPlaylist && String(selectedPlaylist.id) === String(playlistId)) {
          setSelectedPlaylist(updated);
        }
      }
    } catch (err) {
      console.error('Error updating playlist track:', err);
    }
  };

  // Library: liked albums (unique albums from favorited tracks)
  const likedAlbums = Array.from(
    new Map(
      TRACKS.filter(t => favorites.includes(t.id)).map(t => [t.album, t])
    ).values()
  );

  // Library: liked artists (unique artists from favorited tracks)
  const likedArtists = Array.from(
    new Map(
      TRACKS.filter(t => favorites.includes(t.id)).map(t => [t.artist, t])
    ).values()
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm font-medium">Loading your rhythm...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 font-sans flex overflow-hidden selection:bg-violet-500/30 transition-colors duration-500">
      {/* Dynamic Ambient Glow Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className={`absolute -top-1/4 -left-1/4 w-[70vw] h-[70vw] rounded-full blur-[120px] mix-blend-screen opacity-50 dark:opacity-50 opacity-20 transition-colors duration-1000 ease-in-out ${currentTrack.glowPrimary}`} />
        <div className={`absolute -bottom-1/4 -right-1/4 w-[60vw] h-[60vw] rounded-full blur-[150px] mix-blend-screen opacity-40 dark:opacity-40 opacity-15 transition-colors duration-1000 ease-in-out ${currentTrack.glowSecondary}`} />
      </div>

      {/* Sidebar Component */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        showLyrics={showLyrics}
        setShowLyrics={setShowLyrics}
        session={session}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto z-10 pb-44 md:pb-40 scrollbar-hide relative">
        <div className="w-full p-4 sm:p-6 md:p-8 lg:p-10 min-h-full flex flex-col">
          <header className="flex justify-between items-center mb-6 md:mb-8 shrink-0 gap-3">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-light text-slate-900 dark:text-white tracking-tight drop-shadow-md truncate">
              {showLyrics ? 'Lyrics View' : activeTab}
            </h1>
            <div className="flex gap-2.5 sm:gap-3 items-center shrink-0">
              {/* Theme Toggle Button */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 sm:p-2.5 rounded-full bg-slate-200/50 dark:bg-white/5 border border-slate-300 dark:border-white/10 hover:bg-slate-300 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all shadow-lg cursor-pointer flex items-center justify-center"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              <div className="flex items-center bg-slate-200/50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 hover:bg-slate-300 dark:hover:bg-white/10 transition-colors backdrop-blur-md focus-within:bg-slate-300 dark:focus-within:bg-white/10 focus-within:border-slate-400 dark:focus-within:border-white/30">
                <Search className="w-4 h-4 text-slate-500 dark:text-slate-300 mr-1.5 sm:mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-500 w-24 sm:w-36 md:w-48 transition-all"
                />
              </div>

              {/* Fullscreen Toggle Button */}
              <button
                onClick={toggleFullscreen}
                className="p-2 sm:p-2.5 rounded-full bg-slate-200/50 dark:bg-white/5 border border-slate-300 dark:border-white/10 hover:bg-slate-300 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all shadow-lg cursor-pointer hidden sm:flex items-center justify-center"
                title={isFullscreen ? "Exit Fullscreen (Esc)" : "Enter Fullscreen Mode"}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4 text-violet-400" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              {session ? (
                <>
                  <div
                    onClick={() => { setActiveTab('Profile'); setShowLyrics(false); }}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-200 dark:bg-white/10 border border-slate-300 dark:border-white/20 overflow-hidden cursor-pointer hover:border-violet-400 hover:ring-2 hover:ring-violet-500/30 transition-all shadow-lg group relative shrink-0"
                    title="View Profile"
                  >
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" alt="Profile" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>

                  <button
                    onClick={handleLogout}
                    className="p-2 sm:p-2.5 rounded-full bg-slate-200/50 dark:bg-white/5 border border-slate-300 dark:border-white/10 hover:bg-rose-500/20 hover:border-rose-500/30 text-slate-600 dark:text-slate-300 hover:text-rose-500 dark:hover:text-rose-400 transition-all shadow-lg cursor-pointer flex items-center justify-center"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => requireAuth('Masuk ke akun MeloSync kamu.')}
                  className="px-5 py-2 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold transition-all shadow-lg shadow-violet-900/20 active:scale-95"
                >
                  Sign In
                </button>
              )}
            </div>
          </header>

          {/* View Controller */}
          {showLyrics ? (
            <div
              ref={lyricsContainerRef}
              className="flex-1 flex flex-col items-center py-10 px-4 h-[60vh] overflow-y-auto scrollbar-hide"
            >
              <div className="max-w-3xl space-y-10 pb-60 w-full flex flex-col items-center">
                {currentTrack.lyrics?.map((line, idx) => {
                  const isActive = idx === activeLyricIndex;
                  const isPassed = idx < activeLyricIndex;
                  return (
                    <p
                      key={idx}
                      id={`lyric-${idx}`}
                      onClick={() => setProgress(line.time)}
                      className={`text-center font-bold tracking-tight transition-all duration-700 ease-out cursor-pointer leading-tight
                        ${isActive
                          ? 'text-4xl md:text-5xl text-violet-700 dark:text-white drop-shadow-[0_0_20px_rgba(124,58,237,0.4)] dark:drop-shadow-[0_0_20px_rgba(255,255,255,0.6)] scale-110 py-4'
                          : isPassed
                            ? 'text-2xl md:text-3xl text-slate-300 dark:text-slate-400/50 blur-[0.5px] hover:text-slate-500 dark:hover:text-slate-300'
                            : 'text-2xl md:text-3xl text-slate-500 dark:text-slate-600 hover:text-slate-700 dark:hover:text-slate-400'
                        }`}
                    >
                      {line.text}
                    </p>
                  );
                })}
              </div>
            </div>
          ) : activeTab === 'Home' ? (
            <div className="animate-in fade-in duration-700">
              <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-2 scrollbar-hide">
                {MOODS.map(mood => (
                  <button
                    key={mood}
                    onClick={() => setActiveMood(mood)}
                    className={`px-6 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 backdrop-blur-md ${activeMood === mood
                      ? 'bg-violet-600 dark:bg-white/20 text-white shadow-[0_0_15px_rgba(124,58,237,0.3)] dark:shadow-[0_0_15px_rgba(255,255,255,0.2)] border border-violet-400 dark:border-white/30'
                      : 'bg-slate-200/50 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-transparent'
                      }`}
                  >
                    {mood}
                  </button>
                ))}
              </div>

              <section className="bg-white/40 dark:bg-slate-900/30 border border-slate-200 dark:border-white/5 rounded-2xl sm:rounded-[2rem] p-3 sm:p-4 md:p-6 backdrop-blur-xl shadow-2xl transition-colors duration-500">
                <div className="grid grid-cols-[auto_1fr_auto] sm:grid-cols-[auto_1fr_1fr_auto] gap-3 sm:gap-4 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-slate-200 dark:border-white/5 text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 font-bold mb-2">
                  <div className="w-7 sm:w-8 text-center">#</div>
                  <div>Title</div>
                  <div className="hidden sm:block">Album</div>
                  <div className="pr-2 sm:pr-4"><Clock className="w-4 h-4" /></div>
                </div>

                <div className="space-y-1">
                  {filteredTracks.map((track, idx) => {
                    const isCurrent = currentTrack.id === track.id;
                    return (
                      <div
                        key={track.id}
                        onClick={() => handleTrackSelect(track)}
                        className={`grid grid-cols-[auto_1fr_auto] sm:grid-cols-[auto_1fr_1fr_auto] gap-3 sm:gap-4 items-center px-3 sm:px-4 py-2 sm:py-3 rounded-2xl transition-all duration-300 cursor-pointer group ${isCurrent ? 'bg-violet-600/10 dark:bg-white/10 shadow-[0_4px_15px_rgba(124,58,237,0.1)] dark:shadow-[0_4px_15px_rgba(0,0,0,0.2)] border border-violet-200 dark:border-white/5' : 'hover:bg-slate-200/50 dark:hover:bg-white/5'
                          }`}
                      >
                        <div className="w-8 flex justify-center items-center">
                          {isCurrent && isPlaying ? (
                            <div className="flex items-end justify-center gap-[3px] h-4 w-4">
                              <div className="w-1 bg-violet-600 dark:bg-violet-400 rounded-full animate-eq-1"></div>
                              <div className="w-1 bg-slate-900 dark:bg-white rounded-full animate-eq-2"></div>
                              <div className="w-1 bg-rose-500 dark:bg-rose-400 rounded-full animate-eq-3"></div>
                            </div>
                          ) : (
                            <span className={`text-sm font-medium ${isCurrent ? 'text-violet-600 dark:text-violet-300' : 'text-slate-400 dark:text-slate-600 group-hover:text-slate-900 dark:group-hover:text-slate-400'}`}>
                              {String(idx + 1).padStart(2, '0')}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-md border border-slate-200 dark:border-transparent">
                            <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
                            <div
                              onClick={(e) => { e.stopPropagation(); handleTrackSelect(track); }}
                              className={`absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px] ${isCurrent && isPlaying ? 'opacity-0' : ''}`}
                            >
                              <Play className="w-5 h-5 text-white fill-current ml-0.5" />
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <span className={`text-base font-medium transition-colors ${isCurrent ? 'text-violet-600 dark:text-white' : 'text-slate-900 dark:text-slate-300'}`}>
                              {track.title}
                            </span>
                            <span className="text-sm text-slate-500 dark:text-slate-500">{track.artist}</span>
                          </div>
                        </div>

                        <div className="text-sm text-slate-500 dark:text-slate-400 hidden sm:block truncate pr-4">
                          {track.album}
                        </div>

                        <div className="flex items-center gap-4 sm:gap-6">
                          <Heart
                            className={`w-4 h-4 cursor-pointer transition-all ${favorites.includes(track.id) ? 'text-rose-500 fill-current opacity-100' : 'text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 hover:text-rose-500'}`}
                            onClick={(e) => { e.stopPropagation(); toggleFavorite(track.id); }}
                          />
                          <span className="text-sm text-slate-500 dark:text-slate-500 w-10 sm:w-12 text-right font-medium">{formatTime(track.duration)}</span>
                          <MoreHorizontal
                            className="w-5 h-5 text-slate-400 dark:text-slate-600 opacity-0 group-hover:opacity-100 hover:text-slate-900 dark:hover:text-white transition-all hidden sm:block cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!session) {
                                requireAuth('Login untuk menambahkan lagu ke playlist.');
                                return;
                              }
                              setShowAddToPlaylistModal(track.id);
                            }}
                            aria-label="Tambahkan ke Playlist"
                          />
                        </div>
                      </div>
                    );
                  })}
                  {filteredTracks.length === 0 && (
                    <div className="text-center py-20 text-slate-500">No tracks found.</div>
                  )}
                </div>
              </section>
            </div>
          ) : activeTab === 'Discover' ? (
            <div className="animate-in fade-in duration-700 space-y-12">
              <div onClick={() => handleTrackSelect(TRACKS[0])} className="w-full h-64 md:h-80 rounded-[2rem] overflow-hidden relative shadow-2xl group cursor-pointer border border-slate-200 dark:border-white/10">
                <img src="https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80" alt="Global Top 50" className="w-full h-full object-cover group-hover:scale-105 group-hover:blur-[2px] transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent dark:from-slate-950 dark:via-slate-950/40 dark:to-transparent flex flex-col justify-end p-8">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-75 group-hover:scale-100 border border-white/30 shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                    <Play className="w-6 h-6 text-white fill-current ml-1" />
                  </div>
                  <p className="text-violet-500 dark:text-violet-400 text-sm font-bold tracking-widest uppercase mb-2 drop-shadow-md">Featured Chart</p>
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">Global Top 50</h2>
                  <p className="text-slate-200 dark:text-slate-300 max-w-md line-clamp-2 drop-shadow-md">The most played tracks right now. Updated daily with the freshest hits from around the world.</p>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-6">
                  <h3 className="text-2xl font-light text-slate-900 dark:text-white tracking-tight">Browse Genres</h3>
                  <button className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">See all</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {GENRES.map(genre => (
                    <div key={genre.id} onClick={() => handleTrackSelect(TRACKS[(genre.id - 1) % TRACKS.length])} className={`h-32 md:h-40 rounded-3xl bg-gradient-to-br ${genre.gradient} p-4 md:p-6 relative overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer group border border-white/10`}>
                      <h4 className="text-lg md:text-xl font-bold text-white drop-shadow-md relative z-10 w-2/3 leading-tight">{genre.name}</h4>
                      <img src={genre.image} alt={genre.name} className="absolute -bottom-2 -right-4 w-24 h-24 md:w-32 md:h-32 object-cover rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.5)] rotate-[25deg] group-hover:rotate-[15deg] group-hover:scale-110 transition-all duration-500" />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-light text-slate-900 dark:text-white tracking-tight mb-6">Trending Artists</h3>
                <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x">
                  {[
                    { id: 1, name: "Elegy", image: "https://images.unsplash.com/photo-1516280440502-61f00a98f5b4?auto=format&fit=crop&w=300&q=80" },
                    { id: 2, name: "The Ethereal", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80" },
                    { id: 3, name: "CyberSynth", image: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=300&q=80" },
                    { id: 4, name: "Aura", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" },
                    { id: 5, name: "Melo", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80" },
                    { id: 6, name: "Stellar", image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=300&q=80" }
                  ].map((artist) => (
                    <div key={artist.id} onClick={() => handleTrackSelect(TRACKS[(artist.id - 1) % TRACKS.length])} className="flex flex-col items-center gap-3 snap-start group cursor-pointer">
                      <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden relative shadow-lg border-2 border-transparent group-hover:border-violet-600 dark:group-hover:border-violet-500 transition-colors p-1">
                        <img src={artist.image} alt={artist.name} className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-1 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                          <Play className="w-8 h-8 text-white fill-current ml-1" />
                        </div>
                      </div>
                      <span className="text-slate-900 dark:text-white font-medium group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors">{artist.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : activeTab === 'Profile' ? (
            session ? (
              <Profile
                favorites={favorites}
                handleTrackSelect={handleTrackSelect}
                toggleFavorite={toggleFavorite}
                setActiveTab={handleTabChange}
                formatTime={formatTime}
                session={session as any}
                userPlaylists={userPlaylists}
                onOpenFavoritesInLibrary={() => {
                  setActiveTab('Library');
                  setLibraryTab('Favorites');
                  setShowLyrics(false);
                }}
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-20 animate-in fade-in duration-700">
                <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center mb-6 shadow-xl">
                  <Lock className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Login to View Profile</h2>
                <p className="text-slate-500 dark:text-slate-400 text-center max-w-xs mb-8">
                  Create an account or sign in to track your listening time, see your top artists, and manage your settings.
                </p>
                <button
                  onClick={() => requireAuth('Masuk untuk melihat profil dan statistik mendengarkan kamu.')}
                  className="px-8 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold transition-all shadow-xl shadow-violet-900/20 active:scale-95 cursor-pointer"
                >
                  Sign In to MeloSync
                </button>
              </div>
            )
          ) : (
            <div className="animate-in fade-in duration-700">
              {/* Tab header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-6 border-b border-slate-200 dark:border-white/10 pb-4 overflow-x-auto scrollbar-hide whitespace-nowrap flex-1">
                  {(['Favorites', 'Playlists', 'Albums', 'Artists'] as const).map((tab) => {
                    const isActive = libraryTab === tab;
                    return (
                      <button
                        key={tab}
                        onClick={() => {
                          setLibraryTab(tab);
                          setSelectedPlaylist(null);
                        }}
                        className={`font-medium pb-4 -mb-[18px] transition-all cursor-pointer ${
                          isActive
                            ? 'text-violet-600 dark:text-white border-b-2 border-violet-600 dark:border-violet-500 font-semibold'
                            : 'text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white border-b-2 border-transparent'
                        }`}
                      >
                        {tab}
                        <span className="ml-1.5 text-[10px] bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded-full">
                          {tab === 'Favorites'
                            ? favorites.length
                            : tab === 'Playlists'
                            ? userPlaylists.length
                            : tab === 'Albums'
                            ? likedAlbums.length
                            : likedArtists.length}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {libraryTab === 'Playlists' && !selectedPlaylist && (
                  <button
                    onClick={() => {
                      if (!session) {
                        requireAuth('Login untuk membuat playlist kamu.');
                        return;
                      }
                      setShowCreatePlaylist(true);
                    }}
                    className="ml-4 mb-4 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all active:scale-95 shadow-lg shadow-violet-900/20 cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4" /> Buat Playlist
                  </button>
                )}
              </div>

              {/* === FAVORITES === */}
              {libraryTab === 'Favorites' && (
                <div className="animate-in fade-in duration-300">
                  {favorites.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                      <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center shadow-xl">
                        <Heart className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-white text-lg">Belum ada lagu disukai</p>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Sukai lagu untuk melihatnya di sini.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {(() => {
                        const favTracks = TRACKS.filter(t => favorites.includes(t.id) && (
                          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.artist.toLowerCase().includes(searchQuery.toLowerCase())
                        ));

                        if (favTracks.length === 0) {
                          return (
                            <div className="text-center py-16 text-slate-500 text-sm">
                              Tidak ada lagu yang cocok dengan pencarian "{searchQuery}".
                            </div>
                          );
                        }

                        return favTracks.map((track, idx) => {
                          const isCurrent = currentTrack.id === track.id;
                          return (
                            <div
                              key={track.id}
                              onClick={() => handleTrackSelect(track)}
                              className={`grid grid-cols-[auto_1fr_auto] sm:grid-cols-[auto_1fr_1fr_auto] gap-3 sm:gap-4 items-center px-3 sm:px-4 py-2 sm:py-3 rounded-2xl transition-all duration-300 cursor-pointer group ${
                                isCurrent ? 'bg-violet-600/10 dark:bg-white/10 border border-violet-200 dark:border-white/5' : 'hover:bg-slate-200/50 dark:hover:bg-white/5'
                              }`}
                            >
                              <div className="w-8 flex justify-center items-center">
                                {isCurrent && isPlaying ? (
                                  <div className="flex items-end justify-center gap-[3px] h-4 w-4">
                                    <div className="w-1 bg-violet-600 dark:bg-violet-400 rounded-full animate-eq-1"></div>
                                    <div className="w-1 bg-slate-900 dark:bg-white rounded-full animate-eq-2"></div>
                                    <div className="w-1 bg-rose-500 dark:bg-rose-400 rounded-full animate-eq-3"></div>
                                  </div>
                                ) : (
                                  <span className={`text-sm font-medium ${isCurrent ? 'text-violet-600 dark:text-violet-300' : 'text-slate-400 dark:text-slate-600 group-hover:text-slate-900 dark:group-hover:text-slate-400'}`}>
                                    {String(idx + 1).padStart(2, '0')}
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-4 min-w-0">
                                <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-md">
                                  <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                  <span className={`text-base font-medium truncate transition-colors ${isCurrent ? 'text-violet-600 dark:text-white' : 'text-slate-900 dark:text-slate-300'}`}>
                                    {track.title}
                                  </span>
                                  <span className="text-sm text-slate-500 truncate">{track.artist}</span>
                                </div>
                              </div>

                              <div className="text-sm text-slate-500 dark:text-slate-400 hidden sm:block truncate pr-4">
                                {track.album}
                              </div>

                              <div className="flex items-center gap-4 sm:gap-6">
                                <Heart
                                  className="w-4 h-4 cursor-pointer text-rose-500 fill-current hover:scale-110 transition-transform"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFavorite(track.id);
                                  }}
                                />
                                <span className="text-sm text-slate-500 w-10 sm:w-12 text-right font-medium">{formatTime(track.duration)}</span>
                                <MoreHorizontal
                                  className="w-5 h-5 text-slate-400 dark:text-slate-600 opacity-0 group-hover:opacity-100 hover:text-slate-900 dark:hover:text-white transition-all hidden sm:block cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (!session) {
                                      requireAuth('Login untuk menambahkan lagu ke playlist.');
                                      return;
                                    }
                                    setShowAddToPlaylistModal(track.id);
                                  }}
                                  aria-label="Tambahkan ke Playlist"
                                />
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  )}
                </div>
              )}

              {/* === PLAYLISTS === */}
              {libraryTab === 'Playlists' && (
                <div>
                  {selectedPlaylist ? (
                    /* Playlist Detail View */
                    <div className="space-y-6 animate-in fade-in duration-300">
                      <button
                        onClick={() => setSelectedPlaylist(null)}
                        className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-white transition-colors cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" /> Kembali ke Semua Playlist
                      </button>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 rounded-3xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                        <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-xl shrink-0">
                          <Music2 className="w-14 h-14 text-white" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">Playlist MeloSync</span>
                          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{selectedPlaylist.name}</h2>
                          <p className="text-slate-500 dark:text-slate-400 text-sm">
                            {(selectedPlaylist.trackIds || selectedPlaylist.track_ids || []).length} lagu · Dibuat {new Date(selectedPlaylist.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                          <div className="flex items-center gap-3 pt-2">
                            {(selectedPlaylist.trackIds || selectedPlaylist.track_ids || []).length > 0 && (
                              <button
                                onClick={() => {
                                  const currentIds = selectedPlaylist.trackIds || selectedPlaylist.track_ids || [];
                                  const first = TRACKS.find(t => currentIds.includes(t.id));
                                  if (first) handleTrackSelect(first);
                                }}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all active:scale-95 shadow-lg shadow-violet-900/20 cursor-pointer"
                              >
                                <Play className="w-4 h-4 fill-current" /> Putar Semua
                              </button>
                            )}
                            <button
                              onClick={() => handleDeletePlaylist(selectedPlaylist!.id)}
                              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-sm font-medium transition-all active:scale-95 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" /> Hapus Playlist
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Song list in playlist */}
                      <div className="space-y-1">
                        {(() => {
                          const currentIds = selectedPlaylist.trackIds || selectedPlaylist.track_ids || [];
                          const pTracks = TRACKS.filter(t => currentIds.includes(t.id));
                          if (pTracks.length === 0) {
                            return (
                              <div className="text-center py-16 text-slate-500 dark:text-slate-400 space-y-2">
                                <p className="font-semibold text-slate-700 dark:text-slate-300">Playlist ini masih kosong</p>
                                <p className="text-sm">Klik ikon opsi (⋯) pada lagu di Beranda atau Favorit untuk menambahkan lagu ke playlist ini.</p>
                              </div>
                            );
                          }
                          return pTracks.map((track, idx) => {
                            const isCurrent = currentTrack.id === track.id;
                            return (
                              <div
                                key={track.id}
                                onClick={() => handleTrackSelect(track)}
                                className={`grid grid-cols-[auto_1fr_auto] sm:grid-cols-[auto_1fr_1fr_auto] gap-3 sm:gap-4 items-center px-3 sm:px-4 py-2 sm:py-3 rounded-2xl transition-all duration-300 cursor-pointer group ${
                                  isCurrent ? 'bg-violet-600/10 dark:bg-white/10 border border-violet-200 dark:border-white/5' : 'hover:bg-slate-200/50 dark:hover:bg-white/5'
                                }`}
                              >
                                <div className="w-8 flex justify-center items-center">
                                  {isCurrent && isPlaying ? (
                                    <div className="flex items-end justify-center gap-[3px] h-4 w-4">
                                      <div className="w-1 bg-violet-600 dark:bg-violet-400 rounded-full animate-eq-1"></div>
                                      <div className="w-1 bg-slate-900 dark:bg-white rounded-full animate-eq-2"></div>
                                      <div className="w-1 bg-rose-500 dark:bg-rose-400 rounded-full animate-eq-3"></div>
                                    </div>
                                  ) : (
                                    <span className={`text-sm font-medium ${isCurrent ? 'text-violet-600 dark:text-violet-300' : 'text-slate-400 dark:text-slate-600 group-hover:text-slate-900 dark:group-hover:text-slate-400'}`}>
                                      {String(idx + 1).padStart(2, '0')}
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-4">
                                  <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-md">
                                    <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
                                  </div>
                                  <div className="flex flex-col">
                                    <span className={`text-base font-medium ${isCurrent ? 'text-violet-600 dark:text-white' : 'text-slate-900 dark:text-slate-300'}`}>
                                      {track.title}
                                    </span>
                                    <span className="text-sm text-slate-500">{track.artist}</span>
                                  </div>
                                </div>

                                <div className="text-sm text-slate-500 dark:text-slate-400 hidden sm:block truncate pr-4">
                                  {track.album}
                                </div>

                                <div className="flex items-center gap-4 sm:gap-6">
                                  <Heart
                                    className={`w-4 h-4 cursor-pointer transition-all ${favorites.includes(track.id) ? 'text-rose-500 fill-current opacity-100' : 'text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 hover:text-rose-500'}`}
                                    onClick={(e) => { e.stopPropagation(); toggleFavorite(track.id); }}
                                  />
                                  <span className="text-sm text-slate-500 w-10 sm:w-12 text-right font-medium">{formatTime(track.duration)}</span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleToggleTrackInPlaylist(selectedPlaylist!.id, track.id);
                                    }}
                                    title="Hapus dari playlist"
                                    className="p-1 rounded-full text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  ) : userPlaylists.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                      <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center shadow-xl">
                        <Music2 className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-white text-lg">Belum ada playlist</p>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Buat playlist pertama kamu!</p>
                      </div>
                      <button
                        onClick={() => {
                          if (!session) {
                            requireAuth('Login untuk membuat playlist kamu.');
                            return;
                          }
                          setShowCreatePlaylist(true);
                        }}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all active:scale-95 shadow-lg cursor-pointer"
                      >
                        <Plus className="w-4 h-4" /> Buat Playlist
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                      {userPlaylists
                        .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map((playlist) => {
                          const trackCount = (playlist.trackIds || playlist.track_ids || []).length;
                          return (
                            <div
                              key={playlist.id}
                              onClick={() => setSelectedPlaylist(playlist)}
                              className="group cursor-pointer flex flex-col gap-3 p-3 rounded-2xl hover:bg-slate-200/50 dark:hover:bg-white/5 transition-all"
                            >
                              <div className="w-full aspect-square rounded-2xl overflow-hidden relative shadow-lg bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-slate-200 dark:border-white/5 flex items-center justify-center">
                                <Music2 className="w-12 h-12 text-violet-400 dark:text-violet-500" />
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-lg">
                                    <Play className="w-5 h-5 text-white fill-current ml-0.5" />
                                  </div>
                                </div>
                                {/* Delete button */}
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleDeletePlaylist(playlist.id); }}
                                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-rose-500 transition-all z-10 cursor-pointer"
                                  title="Hapus playlist"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <div>
                                <p className="text-slate-900 dark:text-white font-medium text-sm truncate">{playlist.name}</p>
                                <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                                  {trackCount} lagu · {new Date(playlist.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              )}

              {/* === ALBUMS DISUKAI === */}
              {libraryTab === 'Albums' && (
                <div>
                  {likedAlbums.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                      <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center shadow-xl">
                        <Heart className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-white text-lg">Belum ada album disukai</p>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Sukai lagu untuk menambahkan albumnya di sini.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                      {likedAlbums.map((track) => (
                        <div
                          key={track.album}
                          onClick={() => handleTrackSelect(track)}
                          className="group cursor-pointer flex flex-col gap-3 p-3 rounded-2xl hover:bg-slate-200/50 dark:hover:bg-white/5 transition-all"
                        >
                          <div className="w-full aspect-square rounded-2xl overflow-hidden relative shadow-lg bg-slate-200 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                            <img src={track.cover} alt={track.album} className="w-full h-full object-cover group-hover:scale-110 group-hover:blur-[2px] transition-all duration-500" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-110 transition-transform">
                                <Play className="w-5 h-5 text-white fill-current ml-1" />
                              </div>
                            </div>
                          </div>
                          <div>
                            <p className="text-slate-900 dark:text-white font-medium text-sm truncate">{track.album}</p>
                            <p className="text-slate-500 dark:text-slate-400 text-xs truncate mt-0.5">{track.artist}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* === ARTISTS DISUKAI === */}
              {libraryTab === 'Artists' && (
                <div>
                  {likedArtists.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                      <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center shadow-xl">
                        <Heart className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-white text-lg">Belum ada artist disukai</p>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Sukai lagu untuk menambahkan artistnya di sini.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                      {likedArtists.map((track) => {
                        const artistData = LIBRARY_ARTISTS.find(a => a.name.toLowerCase() === track.artist.toLowerCase());
                        return (
                          <div
                            key={track.artist}
                            onClick={() => handleTrackSelect(track)}
                            className="group cursor-pointer flex flex-col items-center text-center gap-3 p-4 rounded-2xl hover:bg-slate-200/50 dark:hover:bg-white/5 transition-all"
                          >
                            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden relative shadow-xl bg-slate-200 dark:bg-white/5 border border-slate-200 dark:border-white/10 mx-auto">
                              <img
                                src={artistData?.image || track.cover}
                                alt={track.artist}
                                className="w-full h-full object-cover group-hover:scale-110 group-hover:blur-[2px] transition-all duration-500"
                              />
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30">
                                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-110 transition-transform">
                                  <Play className="w-5 h-5 text-white fill-current ml-1" />
                                </div>
                              </div>
                            </div>
                            <div className="w-full">
                              <p className="text-slate-900 dark:text-white font-medium text-sm truncate">{track.artist}</p>
                              {artistData && (
                                <p className="text-slate-500 dark:text-slate-400 text-xs truncate mt-0.5">{artistData.genre}</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* === MODAL BUAT PLAYLIST === */}
          {showCreatePlaylist && (
            <div
              className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
              onClick={() => setShowCreatePlaylist(false)}
            >
              <div
                className="w-full max-w-sm bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-3xl p-7 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-2 duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Buat Playlist Baru</h3>
                  <button onClick={() => setShowCreatePlaylist(false)} className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <input
                  type="text"
                  autoFocus
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreatePlaylist()}
                  placeholder="Nama playlist..."
                  className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all mb-4"
                />
                <button
                  onClick={handleCreatePlaylist}
                  disabled={!newPlaylistName.trim() || isCreatingPlaylist}
                  className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed shadow-xl shadow-violet-900/20 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> {isCreatingPlaylist ? 'Menyimpan...' : 'Buat Playlist'}
                </button>
              </div>
            </div>
          )}

          {/* === MODAL TAMBAHKAN KE PLAYLIST === */}
          {showAddToPlaylistModal !== null && (
            <div
              className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
              onClick={() => setShowAddToPlaylistModal(null)}
            >
              <div
                className="w-full max-w-sm bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Tambahkan ke Playlist</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Pilih playlist untuk menyimpan lagu
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddToPlaylistModal(null)}
                    className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="max-h-60 overflow-y-auto space-y-2 mb-4 pr-1">
                  {userPlaylists.length === 0 ? (
                    <p className="text-sm text-slate-500 dark:text-slate-400 py-4 text-center">
                      Kamu belum memiliki playlist.
                    </p>
                  ) : (
                    userPlaylists.map(pl => {
                      const currentIds = pl.trackIds || pl.track_ids || [];
                      const isAdded = currentIds.includes(showAddToPlaylistModal!);
                      return (
                        <button
                          key={pl.id}
                          onClick={() => handleToggleTrackInPlaylist(pl.id, showAddToPlaylistModal!)}
                          className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                            isAdded
                              ? 'bg-violet-600/10 border-violet-500/40 text-violet-700 dark:text-violet-300'
                              : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:bg-slate-200/50 dark:hover:bg-white/10 text-slate-900 dark:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-violet-500/20 flex items-center justify-center">
                              <Music2 className="w-4 h-4 text-violet-500" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold truncate">{pl.name}</p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                {currentIds.length} lagu
                              </p>
                            </div>
                          </div>
                          {isAdded && (
                            <Check className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                          )}
                        </button>
                      );
                    })
                  )}
                </div>

                <button
                  onClick={() => {
                    setShowAddToPlaylistModal(null);
                    setShowCreatePlaylist(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-violet-500/40 text-violet-600 dark:text-violet-400 hover:bg-violet-500/10 text-xs font-semibold transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Buat Playlist Baru
                </button>
              </div>
            </div>
          )}

          {/* Toast Notification */}
          {playlistToast && (
            <div className="fixed bottom-24 sm:bottom-28 left-1/2 -translate-x-1/2 z-[250] bg-slate-900/90 dark:bg-slate-800/95 text-white backdrop-blur-md px-5 py-2.5 rounded-2xl shadow-2xl border border-white/10 text-sm font-medium animate-in fade-in slide-in-from-bottom-3 duration-200 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{playlistToast}</span>
            </div>
          )}
        </div>
      </main>

      {/* Persistent Floating Bottom Player */}
      {hasStartedPlaying && (
        <PlayerBar
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          progress={progress}
          volume={volume}
          isShuffle={isShuffle}
          repeatMode={repeatMode}
          showLyrics={showLyrics}
          handlePlayPause={handlePlayPause}
          handleNext={handleNext}
          handlePrev={handlePrev}
          setProgress={setProgress}
          setShowLyrics={setShowLyrics}
          setVolume={setVolume}
          toggleShuffle={() => setIsShuffle(!isShuffle)}
          toggleRepeat={() => {
            const modes: ('none' | 'one' | 'all')[] = ['none', 'all', 'one'];
            const nextMode = modes[(modes.indexOf(repeatMode) + 1) % modes.length];
            setRepeatMode(nextMode);
          }}
          formatTime={formatTime}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          isFullscreen={isFullscreen}
          toggleFullscreen={toggleFullscreen}
        />
      )}

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        showLyrics={showLyrics}
        setShowLyrics={setShowLyrics}
        session={session}
      />

      {/* Auth Modal */}
      <Auth
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        reasonText={authModalReason}
      />

      <style dangerouslySetInnerHTML={{
        __html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

        @keyframes bounce-eq {
          0%, 100% { height: 4px; }
          50% { height: 14px; }
        }
        .animate-eq-1 { animation: bounce-eq 0.8s infinite ease-in-out; }
        .animate-eq-2 { animation: bounce-eq 1.1s infinite ease-in-out 0.2s; }
        .animate-eq-3 { animation: bounce-eq 0.9s infinite ease-in-out 0.4s; }
      `}} />
    </div>
  );
}
