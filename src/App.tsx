import { useState, useEffect, useRef } from 'react';
import { Play, Heart, MoreHorizontal, Clock, Search, Maximize2, Minimize2 } from 'lucide-react';

import { MOODS, TRACKS, GENRES, LIBRARY_ALBUMS, LIBRARY_PLAYLISTS, LIBRARY_ARTISTS } from './data/musicData';
import Sidebar from './components/Sidebar';
import PlayerBar from './components/PlayerBar';
import Profile from './components/Profile';
import MobileNav from './components/MobileNav';

export default function App() {
  const [activeTab, setActiveTab] = useState('Home');
  const [showLyrics, setShowLyrics] = useState(false);

  const [currentTrack, setCurrentTrack] = useState(TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(75);
  const [activeMood, setActiveMood] = useState('All');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);
  const [libraryTab, setLibraryTab] = useState<'Playlists' | 'Albums' | 'Artists'>('Playlists');
  const [isFullscreen, setIsFullscreen] = useState(false);

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
        document.documentElement.requestFullscreen().catch((err) => {
          console.error('Error enabling fullscreen:', err);
        });
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch((err) => {
          console.error('Error exiting fullscreen:', err);
        });
      }
    }
  };

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };

  const lyricsContainerRef = useRef<HTMLDivElement>(null);

  // Playback simulation
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isPlaying) {
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= currentTrack.duration) {
            handleNext();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentTrack]);

  const handlePlayPause = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    const currentIndex = TRACKS.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % TRACKS.length;
    setCurrentTrack(TRACKS[nextIndex]);
    setProgress(0);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    if (progress > 5) {
      setProgress(0);
    } else {
      const currentIndex = TRACKS.findIndex(t => t.id === currentTrack.id);
      const prevIndex = (currentIndex - 1 + TRACKS.length) % TRACKS.length;
      setCurrentTrack(TRACKS[prevIndex]);
      setProgress(0);
      setIsPlaying(true);
    }
  };

  const handleTrackSelect = (track: typeof TRACKS[0]) => {
    setHasStartedPlaying(true);
    if (currentTrack.id === track.id) {
      handlePlayPause();
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
      setProgress(0);
    }
  };

  const getActiveLyricIndex = () => {
    if (!currentTrack.lyrics) return -1;
    let activeIdx = -1;
    for (let i = 0; i < currentTrack.lyrics.length; i++) {
      if (progress >= currentTrack.lyrics[i].time) {
        activeIdx = i;
      } else {
        break;
      }
    }
    return activeIdx;
  };

  const activeLyricIndex = getActiveLyricIndex();

  // Cinematic Lyrics Auto-Scroll
  useEffect(() => {
    if (showLyrics && lyricsContainerRef.current) {
      const activeEl = document.getElementById(`lyric-${activeLyricIndex}`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [activeLyricIndex, showLyrics]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const filteredTracks = TRACKS.filter(t => {
    const matchesMood = activeMood === 'All' || t.mood === activeMood;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.artist.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMood && matchesSearch;
  });

  const filteredPlaylists = LIBRARY_PLAYLISTS.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAlbums = LIBRARY_ALBUMS.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredArtists = LIBRARY_ARTISTS.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-200 font-sans flex overflow-hidden selection:bg-white/30">
      {/* Dynamic Ambient Glow Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className={`absolute -top-1/4 -left-1/4 w-[70vw] h-[70vw] rounded-full blur-[120px] mix-blend-screen opacity-50 transition-colors duration-1000 ease-in-out ${currentTrack.glowPrimary}`} />
        <div className={`absolute -bottom-1/4 -right-1/4 w-[60vw] h-[60vw] rounded-full blur-[150px] mix-blend-screen opacity-40 transition-colors duration-1000 ease-in-out ${currentTrack.glowSecondary}`} />
      </div>

      {/* Sidebar Component */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        showLyrics={showLyrics} 
        setShowLyrics={setShowLyrics} 
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto z-10 pb-44 md:pb-40 scrollbar-hide relative">
        <div className="w-full p-4 sm:p-6 md:p-8 lg:p-10 min-h-full flex flex-col">
          <header className="flex justify-between items-center mb-6 md:mb-8 shrink-0 gap-3">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-light text-white tracking-tight drop-shadow-md truncate">
              {showLyrics ? 'Lyrics View' : activeTab}
            </h1>
            <div className="flex gap-2.5 sm:gap-3 items-center shrink-0">
              <div className="flex items-center bg-white/5 border border-white/10 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 hover:bg-white/10 transition-colors backdrop-blur-md focus-within:bg-white/10 focus-within:border-white/30">
                <Search className="w-4 h-4 text-slate-300 mr-1.5 sm:mr-2 shrink-0" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs sm:text-sm text-white placeholder:text-slate-500 w-24 sm:w-36 md:w-48 transition-all"
                />
              </div>

              {/* Fullscreen Toggle Button (Laptop / Desktop) */}
              <button
                onClick={toggleFullscreen}
                className="p-2 sm:p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 text-slate-300 hover:text-white transition-all shadow-lg cursor-pointer hidden sm:flex items-center justify-center"
                title={isFullscreen ? "Exit Fullscreen (Esc)" : "Enter Fullscreen Mode"}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4 text-violet-400" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <div 
                onClick={() => { setActiveTab('Profile'); setShowLyrics(false); }}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 border border-white/20 overflow-hidden cursor-pointer hover:border-violet-400 hover:ring-2 hover:ring-violet-500/30 transition-all shadow-lg group relative shrink-0"
                title="View Profile"
              >
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" alt="Profile" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
            </div>
          </header>

          {/* View Controller */}
          {showLyrics ? (
            // LYRICS VIEW
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
                          ? 'text-4xl md:text-5xl text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.6)] scale-110 py-4'
                          : isPassed
                            ? 'text-2xl md:text-3xl text-slate-400/50 blur-[0.5px] hover:text-slate-300'
                            : 'text-2xl md:text-3xl text-slate-600 hover:text-slate-400'
                        }`}
                    >
                      {line.text}
                    </p>
                  );
                })}
              </div>
            </div>
          ) : activeTab === 'Home' ? (
            // HOME VIEW
            <div className="animate-in fade-in duration-700">
              <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-2 scrollbar-hide">
                {MOODS.map(mood => (
                  <button
                    key={mood}
                    onClick={() => setActiveMood(mood)}
                    className={`px-6 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 backdrop-blur-md ${activeMood === mood
                        ? 'bg-white/20 text-white shadow-[0_0_15px_rgba(255,255,255,0.2)] border border-white/30'
                        : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-transparent'
                      }`}
                  >
                    {mood}
                  </button>
                ))}
              </div>

              <section className="bg-slate-900/30 border border-white/5 rounded-2xl sm:rounded-[2rem] p-3 sm:p-4 md:p-6 backdrop-blur-xl shadow-2xl">
                <div className="grid grid-cols-[auto_1fr_auto] sm:grid-cols-[auto_1fr_1fr_auto] gap-3 sm:gap-4 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-white/5 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-2">
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
                        className={`grid grid-cols-[auto_1fr_auto] sm:grid-cols-[auto_1fr_1fr_auto] gap-3 sm:gap-4 items-center px-3 sm:px-4 py-2 sm:py-3 rounded-2xl transition-all duration-300 cursor-pointer group ${isCurrent ? 'bg-white/10 shadow-[0_4px_15px_rgba(0,0,0,0.2)] border border-white/5' : 'hover:bg-white/5'
                          }`}
                      >
                        <div className="w-8 flex justify-center items-center">
                          {isCurrent && isPlaying ? (
                            <div className="flex items-end justify-center gap-[3px] h-4 w-4">
                              <div className="w-1 bg-violet-400 rounded-full animate-eq-1"></div>
                              <div className="w-1 bg-white rounded-full animate-eq-2"></div>
                              <div className="w-1 bg-rose-400 rounded-full animate-eq-3"></div>
                            </div>
                          ) : (
                            <span className={`text-sm font-medium ${isCurrent ? 'text-violet-300' : 'text-slate-600 group-hover:text-slate-400'}`}>
                              {String(idx + 1).padStart(2, '0')}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-md">
                            <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
                            <div
                              onClick={(e) => { e.stopPropagation(); handleTrackSelect(track); }}
                              className={`absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px] ${isCurrent && isPlaying ? 'opacity-0' : ''}`}
                            >
                              <Play className="w-5 h-5 text-white fill-current ml-0.5" />
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <span className={`text-base font-medium transition-colors ${isCurrent ? 'text-white' : 'text-slate-300'}`}>
                              {track.title}
                            </span>
                            <span className="text-sm text-slate-500">{track.artist}</span>
                          </div>
                        </div>

                        <div className="text-sm text-slate-400 hidden sm:block truncate pr-4">
                          {track.album}
                        </div>

                        <div className="flex items-center gap-4 sm:gap-6">
                          <Heart 
                            className={`w-4 h-4 cursor-pointer transition-all ${favorites.includes(track.id) ? 'text-rose-500 fill-current opacity-100' : 'text-slate-600 opacity-0 group-hover:opacity-100 hover:text-rose-500'}`}
                            onClick={(e) => { e.stopPropagation(); toggleFavorite(track.id); }}
                          />
                          <span className="text-sm text-slate-500 w-10 sm:w-12 text-right font-medium">{formatTime(track.duration)}</span>
                          <MoreHorizontal className="w-5 h-5 text-slate-600 opacity-0 group-hover:opacity-100 hover:text-white transition-all hidden sm:block" />
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
            // DISCOVER VIEW
            <div className="animate-in fade-in duration-700 space-y-12">
              <div onClick={() => handleTrackSelect(TRACKS[0])} className="w-full h-64 md:h-80 rounded-[2rem] overflow-hidden relative shadow-2xl group cursor-pointer border border-white/10">
                <img src="https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80" alt="Global Top 50" className="w-full h-full object-cover group-hover:scale-105 group-hover:blur-[2px] transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-8">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-75 group-hover:scale-100 border border-white/30 shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                    <Play className="w-6 h-6 text-white fill-current ml-1" />
                  </div>
                  <p className="text-violet-400 text-sm font-bold tracking-widest uppercase mb-2 drop-shadow-md">Featured Chart</p>
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">Global Top 50</h2>
                  <p className="text-slate-300 max-w-md line-clamp-2 drop-shadow-md">The most played tracks right now. Updated daily with the freshest hits from around the world.</p>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-6">
                  <h3 className="text-2xl font-light text-white tracking-tight">Browse Genres</h3>
                  <button className="text-sm text-slate-400 hover:text-white transition-colors">See all</button>
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
                <h3 className="text-2xl font-light text-white tracking-tight mb-6">Trending Artists</h3>
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
                      <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden relative shadow-lg border-2 border-transparent group-hover:border-violet-500 transition-colors p-1">
                        <img src={artist.image} alt={artist.name} className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-1 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                          <Play className="w-8 h-8 text-white fill-current ml-1" />
                        </div>
                      </div>
                      <span className="text-white font-medium group-hover:text-violet-300 transition-colors">{artist.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : activeTab === 'Favorites' ? (
            // FAVORITES VIEW
            <div className="animate-in fade-in duration-700">
              <h2 className="text-xl sm:text-2xl font-light text-white mb-6">Your Favorite Tracks</h2>
              <section className="bg-slate-900/30 border border-white/5 rounded-2xl sm:rounded-[2rem] p-3 sm:p-4 md:p-6 backdrop-blur-xl shadow-2xl">
                <div className="grid grid-cols-[auto_1fr_auto] sm:grid-cols-[auto_1fr_1fr_auto] gap-3 sm:gap-4 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-white/5 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-2">
                  <div className="w-7 sm:w-8 text-center">#</div>
                  <div>Title</div>
                  <div className="hidden sm:block">Album</div>
                  <div className="pr-2 sm:pr-4"><Clock className="w-4 h-4" /></div>
                </div>

                <div className="space-y-1">
                  {TRACKS.filter(t => favorites.includes(t.id) && (
                    t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    t.artist.toLowerCase().includes(searchQuery.toLowerCase())
                  )).map((track, idx) => {
                    const isCurrent = currentTrack.id === track.id;
                    return (
                      <div
                        key={track.id}
                        onClick={() => handleTrackSelect(track)}
                        className={`grid grid-cols-[auto_1fr_auto] sm:grid-cols-[auto_1fr_1fr_auto] gap-3 sm:gap-4 items-center px-3 sm:px-4 py-2 sm:py-3 rounded-2xl transition-all duration-300 cursor-pointer group ${isCurrent ? 'bg-white/10 shadow-[0_4px_15px_rgba(0,0,0,0.2)] border border-white/5' : 'hover:bg-white/5'
                          }`}
                      >
                        <div className="w-8 flex justify-center items-center">
                          {isCurrent && isPlaying ? (
                            <div className="flex items-end justify-center gap-[3px] h-4 w-4">
                              <div className="w-1 bg-violet-400 rounded-full animate-eq-1"></div>
                              <div className="w-1 bg-white rounded-full animate-eq-2"></div>
                              <div className="w-1 bg-rose-400 rounded-full animate-eq-3"></div>
                            </div>
                          ) : (
                            <span className={`text-sm font-medium ${isCurrent ? 'text-violet-300' : 'text-slate-600 group-hover:text-slate-400'}`}>
                              {String(idx + 1).padStart(2, '0')}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-md">
                            <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
                            <div
                              onClick={(e) => { e.stopPropagation(); handleTrackSelect(track); }}
                              className={`absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px] ${isCurrent && isPlaying ? 'opacity-0' : ''}`}
                            >
                              <Play className="w-5 h-5 text-white fill-current ml-0.5" />
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <span className={`text-base font-medium transition-colors ${isCurrent ? 'text-white' : 'text-slate-300'}`}>
                              {track.title}
                            </span>
                            <span className="text-sm text-slate-500">{track.artist}</span>
                          </div>
                        </div>

                        <div className="text-sm text-slate-400 hidden sm:block truncate pr-4">
                          {track.album}
                        </div>

                        <div className="flex items-center gap-4 sm:gap-6">
                          <Heart 
                            className={`w-4 h-4 cursor-pointer transition-all ${favorites.includes(track.id) ? 'text-rose-500 fill-current opacity-100' : 'text-slate-600 opacity-0 group-hover:opacity-100 hover:text-rose-500'}`}
                            onClick={(e) => { e.stopPropagation(); toggleFavorite(track.id); }}
                          />
                          <span className="text-sm text-slate-500 w-10 sm:w-12 text-right font-medium">{formatTime(track.duration)}</span>
                          <MoreHorizontal className="w-5 h-5 text-slate-600 opacity-0 group-hover:opacity-100 hover:text-white transition-all hidden sm:block" />
                        </div>
                      </div>
                    );
                  })}
                  {favorites.length === 0 && (
                    <div className="text-center py-20 text-slate-500">No favorite tracks yet.</div>
                  )}
                </div>
              </section>
            </div>
          ) : activeTab === 'Profile' ? (
            // PROFILE VIEW
            <Profile 
              favorites={favorites}
              handleTrackSelect={handleTrackSelect}
              toggleFavorite={toggleFavorite}
              setActiveTab={setActiveTab}
              formatTime={formatTime}
            />
          ) : (
            // LIBRARY VIEW
            <div className="animate-in fade-in duration-700">
              <div className="flex items-center gap-6 mb-8 border-b border-white/10 pb-4 overflow-x-auto scrollbar-hide whitespace-nowrap">
                {(['Playlists', 'Albums', 'Artists'] as const).map((tab) => {
                  const isActive = libraryTab === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => setLibraryTab(tab)}
                      className={`font-medium pb-4 -mb-[18px] transition-all cursor-pointer ${
                        isActive
                          ? 'text-white border-b-2 border-violet-500 font-semibold'
                          : 'text-slate-500 hover:text-white border-b-2 border-transparent'
                      }`}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>

              {/* Playlists Tab Content */}
              {libraryTab === 'Playlists' && (
                <div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {filteredPlaylists.map((playlist) => (
                      <div
                        key={playlist.id}
                        onClick={() => handleTrackSelect(TRACKS[(playlist.id - 1) % TRACKS.length])}
                        className="group cursor-pointer flex flex-col gap-3 p-3 rounded-2xl hover:bg-white/5 transition-all"
                      >
                        <div className="w-full aspect-square rounded-2xl overflow-hidden relative shadow-lg bg-white/5 border border-white/5">
                          <img
                            src={playlist.cover}
                            alt={playlist.title}
                            className="w-full h-full object-cover group-hover:scale-110 group-hover:blur-[2px] transition-all duration-500"
                          />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-110 transition-transform">
                              <Play className="w-5 h-5 text-white fill-current ml-1" />
                            </div>
                          </div>
                          <span className="absolute bottom-2 right-2 text-[10px] bg-black/60 backdrop-blur-md text-white/90 px-2 py-0.5 rounded-full font-medium border border-white/10">
                            {playlist.trackCount} tracks
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm truncate">{playlist.title}</p>
                          <p className="text-slate-400 text-xs truncate mt-0.5">{playlist.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {filteredPlaylists.length === 0 && (
                    <div className="text-center py-20 text-slate-500">No playlists found.</div>
                  )}
                </div>
              )}

              {/* Albums Tab Content */}
              {libraryTab === 'Albums' && (
                <div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {filteredAlbums.map((album) => (
                      <div
                        key={album.id}
                        onClick={() => handleTrackSelect(TRACKS[(album.id - 1) % TRACKS.length])}
                        className="group cursor-pointer flex flex-col gap-3 p-3 rounded-2xl hover:bg-white/5 transition-all"
                      >
                        <div className="w-full aspect-square rounded-2xl overflow-hidden relative shadow-lg bg-white/5 border border-white/5">
                          <img
                            src={album.cover}
                            alt={album.title}
                            className="w-full h-full object-cover group-hover:scale-110 group-hover:blur-[2px] transition-all duration-500"
                          />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-110 transition-transform">
                              <Play className="w-5 h-5 text-white fill-current ml-1" />
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm truncate">{album.title}</p>
                          <p className="text-slate-500 text-xs truncate mt-0.5">{album.artist}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {filteredAlbums.length === 0 && (
                    <div className="text-center py-20 text-slate-500">No albums found.</div>
                  )}
                </div>
              )}

              {/* Artists Tab Content */}
              {libraryTab === 'Artists' && (
                <div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {filteredArtists.map((artist) => {
                      const artistTrack = TRACKS.find(t => t.artist.toLowerCase() === artist.name.toLowerCase()) || TRACKS[(artist.id - 1) % TRACKS.length];
                      return (
                        <div
                          key={artist.id}
                          onClick={() => handleTrackSelect(artistTrack)}
                          className="group cursor-pointer flex flex-col items-center text-center gap-3 p-4 rounded-2xl hover:bg-white/5 transition-all"
                        >
                          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden relative shadow-xl bg-white/5 border border-white/10 mx-auto">
                            <img
                              src={artist.image}
                              alt={artist.name}
                              className="w-full h-full object-cover group-hover:scale-110 group-hover:blur-[2px] transition-all duration-500"
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30">
                              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-110 transition-transform">
                                <Play className="w-5 h-5 text-white fill-current ml-1" />
                              </div>
                            </div>
                          </div>
                          <div className="w-full">
                            <p className="text-white font-medium text-sm truncate">{artist.name}</p>
                            <p className="text-slate-400 text-xs truncate mt-0.5">{artist.genre}</p>
                            <span className="inline-block mt-2 text-[10px] bg-white/5 border border-white/10 text-violet-300 px-2.5 py-0.5 rounded-full">
                              {artist.monthlyListeners}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {filteredArtists.length === 0 && (
                    <div className="text-center py-20 text-slate-500">No artists found.</div>
                  )}
                </div>
              )}
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
          showLyrics={showLyrics}
          handlePlayPause={handlePlayPause}
          handleNext={handleNext}
          handlePrev={handlePrev}
          setProgress={setProgress}
          setShowLyrics={setShowLyrics}
          setVolume={setVolume}
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
        setActiveTab={setActiveTab}
        showLyrics={showLyrics}
        setShowLyrics={setShowLyrics}
        favoritesCount={favorites.length}
      />

      {/* Global Styles injected via style tag */}
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
