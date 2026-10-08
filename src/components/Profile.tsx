import { useState } from 'react';
import { 
  Settings, 
  Heart, 
  Music, 
  Play, 
  Sliders, 
  Check, 
  Share2, 
  Sparkles, 
  Headphones, 
  Edit3, 
  X,
  Disc3,
  Flame,
  Award
} from 'lucide-react';
import { TRACKS, LIBRARY_PLAYLISTS, LIBRARY_ARTISTS } from '../data/musicData';

interface ProfileProps {
  favorites: number[];
  handleTrackSelect: (track: typeof TRACKS[0]) => void;
  toggleFavorite: (id: number) => void;
  setActiveTab: (tab: string) => void;
  formatTime: (seconds: number) => string;
}

export default function Profile({
  favorites,
  handleTrackSelect,
  toggleFavorite,
  setActiveTab,
  formatTime,
}: ProfileProps) {
  const [profileTab, setProfileTab] = useState<'Overview' | 'Saved Music' | 'Audio & Settings'>('Overview');
  
  // Profile user state
  const [user, setUser] = useState({
    name: 'Alex Rivera',
    username: '@alexrivera',
    bio: 'Synthwave junkie, late-night coder & ambient sound explorer 🎧✨',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    tier: 'Pro Hi-Fi Member',
    joinedDate: 'Joined March 2024',
    location: 'Jakarta, ID'
  });

  // Settings state
  const [audioQuality, setAudioQuality] = useState('Hi-Res Lossless (24-bit/96kHz)');
  const [equalizer, setEqualizer] = useState('Electronic Boost');
  const [crossfade, setCrossfade] = useState(4);
  const [normalizeAudio, setNormalizeAudio] = useState(true);
  const [autoPlaySimilar, setAutoPlaySimilar] = useState(true);

  // Edit modal state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editBio, setEditBio] = useState(user.bio);
  const [editAvatar, setEditAvatar] = useState(user.avatar);
  const [savedMessage, setSavedMessage] = useState(false);

  const avatarOptions = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUser(prev => ({
      ...prev,
      name: editName,
      bio: editBio,
      avatar: editAvatar
    }));
    setIsEditing(false);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  const favoriteTracks = TRACKS.filter(t => favorites.includes(t.id));

  return (
    <div className="animate-in fade-in duration-700 space-y-8 pb-10">
      {/* Toast Notification */}
      {savedMessage && (
        <div className="fixed top-8 right-8 z-50 bg-emerald-500/90 text-white px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 animate-in fade-in slide-in-from-top duration-300 border border-emerald-400/30">
          <Check className="w-5 h-5" />
          <span className="text-sm font-medium">Profile successfully updated!</span>
        </div>
      )}

      {/* Profile Header Banner Card */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-2xl">
        {/* Banner Glow Background */}
        <div className="h-44 md:h-52 w-full bg-gradient-to-r from-violet-600 via-indigo-600 to-fuchsia-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/25 via-transparent to-black/40" />
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-black/40 backdrop-blur-md text-amber-300 border border-amber-400/30 shadow-lg">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              {user.tier}
            </span>
          </div>
        </div>

        {/* Profile Details Bar */}
        <div className="px-4 sm:px-6 md:px-10 pb-6 sm:pb-8 pt-0 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-14 sm:-mt-16 md:-mt-20">
            {/* Avatar & User info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 sm:gap-6 text-center sm:text-left">
              <div className="relative group">
                <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-slate-950 shadow-2xl bg-slate-800 ring-2 ring-white/10">
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                </div>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="absolute bottom-1 right-1 p-2 rounded-full bg-violet-600 hover:bg-violet-500 text-white shadow-lg transition-transform hover:scale-110 border border-white/20"
                  title="Edit Avatar"
                >
                  <Edit3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight">{user.name}</h2>
                  <span className="text-[11px] sm:text-xs bg-white/10 border border-white/10 text-slate-300 px-2.5 py-0.5 rounded-full">
                    {user.username}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 max-w-lg px-2 sm:px-0">{user.bio}</p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4 text-[11px] sm:text-xs text-slate-400 pt-1">
                  <span>📍 {user.location}</span>
                  <span>•</span>
                  <span>{user.joinedDate}</span>
                </div>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs sm:text-sm transition-all border border-white/10 shadow-lg cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Edit Profile
              </button>
              <button 
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  alert('Profile link copied to clipboard!');
                }}
                className="p-2 sm:p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all border border-white/10 shadow-lg cursor-pointer"
                title="Share Profile"
              >
                <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-white/10">
            <div className="bg-white/5 border border-white/5 rounded-2xl p-3 sm:p-4 text-center">
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{favorites.length}</p>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-1 flex items-center justify-center gap-1">
                <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-rose-500 fill-current" />
                Favorite Tracks
              </p>
            </div>
            <div className="bg-white/5 border border-white/5 rounded-2xl p-3 sm:p-4 text-center">
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{LIBRARY_PLAYLISTS.length}</p>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-1 flex items-center justify-center gap-1">
                <Music className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-violet-400" />
                Playlists
              </p>
            </div>
            <div className="bg-white/5 border border-white/5 rounded-2xl p-3 sm:p-4 text-center">
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white">142h</p>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-1 flex items-center justify-center gap-1">
                <Headphones className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" />
                Listening Time
              </p>
            </div>
            <div className="bg-white/5 border border-white/5 rounded-2xl p-3 sm:p-4 text-center">
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Top 1%</p>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-1 flex items-center justify-center gap-1">
                <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
                Listener Rank
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-6 sm:gap-8 border-b border-white/10 pb-4 overflow-x-auto scrollbar-hide whitespace-nowrap">
        {(['Overview', 'Saved Music', 'Audio & Settings'] as const).map((tab) => {
          const isActive = profileTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setProfileTab(tab)}
              className={`font-medium pb-4 -mb-[18px] transition-all cursor-pointer whitespace-nowrap text-sm sm:text-base ${
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

      {/* TAB 1: OVERVIEW */}
      {profileTab === 'Overview' && (
        <div className="space-y-10 animate-in fade-in duration-500">
          {/* Recent / Favorite Tracks Highlight */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500" />
                Top Favorites
              </h3>
              <button 
                onClick={() => setActiveTab('Favorites')}
                className="text-xs text-violet-400 hover:text-violet-300 font-medium transition-colors"
              >
                View all ({favorites.length})
              </button>
            </div>

            {favoriteTracks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {favoriteTracks.slice(0, 4).map((track) => (
                  <div
                    key={track.id}
                    onClick={() => handleTrackSelect(track)}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-12 h-12 rounded-xl overflow-hidden relative shrink-0">
                        <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="w-4 h-4 text-white fill-current" />
                        </div>
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-medium text-sm truncate group-hover:text-violet-300 transition-colors">
                          {track.title}
                        </p>
                        <p className="text-slate-400 text-xs truncate mt-0.5">{track.artist}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-3">
                      <span className="text-xs text-slate-500">{formatTime(track.duration)}</span>
                      <Heart 
                        className="w-4 h-4 text-rose-500 fill-current cursor-pointer hover:scale-110 transition-transform" 
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(track.id); }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-white/5 rounded-2xl border border-white/5">
                <p className="text-slate-400 text-sm">No favorites added yet.</p>
                <button 
                  onClick={() => setActiveTab('Home')}
                  className="mt-3 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium transition-all"
                >
                  Explore Songs
                </button>
              </div>
            )}
          </section>

          {/* User's Favorite Artists */}
          <section>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Most Listened Artists
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {LIBRARY_ARTISTS.map((artist) => {
                const artistTrack = TRACKS.find(t => t.artist.toLowerCase() === artist.name.toLowerCase()) || TRACKS[(artist.id - 1) % TRACKS.length];
                return (
                  <div
                    key={artist.id}
                    onClick={() => handleTrackSelect(artistTrack)}
                    className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 text-center cursor-pointer group transition-all"
                  >
                    <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-3 border border-white/10 shadow-lg relative">
                      <img src={artist.image} alt={artist.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-4 h-4 text-white fill-current" />
                      </div>
                    </div>
                    <p className="text-white text-sm font-medium truncate">{artist.name}</p>
                    <p className="text-slate-400 text-[11px] truncate mt-0.5">{artist.genre}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* User Playlists */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <Disc3 className="w-5 h-5 text-violet-400" />
                Created Playlists
              </h3>
              <button 
                onClick={() => setActiveTab('Library')}
                className="text-xs text-violet-400 hover:text-violet-300 font-medium transition-colors"
              >
                Go to Library
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
              {LIBRARY_PLAYLISTS.slice(0, 4).map((pl) => (
                <div
                  key={pl.id}
                  onClick={() => handleTrackSelect(TRACKS[(pl.id - 1) % TRACKS.length])}
                  className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all cursor-pointer group"
                >
                  <div className="w-full aspect-square rounded-xl overflow-hidden relative mb-3">
                    <img src={pl.cover} alt={pl.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                        <Play className="w-4 h-4 text-white fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <p className="text-white text-sm font-medium truncate">{pl.title}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{pl.trackCount} tracks</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* TAB 2: SAVED MUSIC */}
      {profileTab === 'Saved Music' && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">All Favorited Tracks</h3>
            <span className="text-sm text-slate-400">{favoriteTracks.length} tracks</span>
          </div>

          {favoriteTracks.length > 0 ? (
            <div className="space-y-2">
              {favoriteTracks.map((track, idx) => (
                <div
                  key={track.id}
                  onClick={() => handleTrackSelect(track)}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-slate-500 w-5 text-center">{idx + 1}</span>
                    <div className="w-12 h-12 rounded-xl overflow-hidden relative">
                      <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-4 h-4 text-white fill-current" />
                      </div>
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm group-hover:text-violet-300 transition-colors">{track.title}</p>
                      <p className="text-slate-400 text-xs mt-0.5">{track.artist} • {track.album}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <span className="text-xs bg-white/10 text-slate-300 px-2.5 py-1 rounded-full hidden sm:inline-block">
                      {track.mood}
                    </span>
                    <span className="text-sm text-slate-400">{formatTime(track.duration)}</span>
                    <Heart 
                      className="w-4 h-4 text-rose-500 fill-current cursor-pointer hover:scale-120 transition-transform" 
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(track.id); }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-16 text-center bg-white/5 rounded-3xl border border-white/10">
              <Heart className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-white font-semibold text-lg">No saved tracks yet</p>
              <p className="text-slate-400 text-sm mt-1 mb-6">Like tracks from Discover or Home to save them here.</p>
              <button 
                onClick={() => setActiveTab('Home')}
                className="px-6 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-medium text-sm transition-all"
              >
                Browse Tracks
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: AUDIO & SETTINGS */}
      {profileTab === 'Audio & Settings' && (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl">
          {/* Audio Quality Settings */}
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-5">
            <div>
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Headphones className="w-5 h-5 text-violet-400" />
                Streaming Audio Quality
              </h3>
              <p className="text-sm text-slate-400 mt-1">Select your preferred audio streaming format and bitrate.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: 'Hi-Res Lossless', desc: '24-bit/96kHz FLAC Studio', id: 'Hi-Res Lossless (24-bit/96kHz)' },
                { label: 'Lossless', desc: '16-bit/44.1kHz CD Quality', id: 'Lossless (16-bit/44.1kHz)' },
                { label: 'High Quality', desc: '320kbps AAC Compressed', id: 'High (320kbps AAC)' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setAudioQuality(opt.id)}
                  className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                    audioQuality === opt.id
                      ? 'bg-violet-600/20 border-violet-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.2)]'
                      : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/20 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm text-white">{opt.label}</span>
                    {audioQuality === opt.id && <Check className="w-4 h-4 text-violet-400" />}
                  </div>
                  <span className="text-xs text-slate-400">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Equalizer Profile */}
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-5">
            <div>
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-400" />
                Hardware Equalizer Preset
              </h3>
              <p className="text-sm text-slate-400 mt-1">Fine-tune the acoustic balance for your headphones or speakers.</p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {[
                'Electronic Boost',
                'Deep Bass',
                'Acoustic Warmth',
                'Vocal Clarity',
                'Lo-Fi Vintage',
                'Flat Reference'
              ].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setEqualizer(preset)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                    equalizer === preset
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                      : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Playback Preferences */}
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-fuchsia-400" />
              Playback Preferences
            </h3>

            {/* Crossfade slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-300">Crossfade Between Songs</span>
                <span className="text-violet-400 font-medium">{crossfade} seconds</span>
              </div>
              <input
                type="range"
                min="0"
                max="12"
                value={crossfade}
                onChange={(e) => setCrossfade(Number(e.target.value))}
                className="w-full accent-violet-500 cursor-pointer h-1.5 bg-white/10 rounded-lg appearance-none"
              />
            </div>

            {/* Audio normalization toggle */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div>
                <p className="text-sm text-slate-300 font-medium">Loudness Normalization</p>
                <p className="text-xs text-slate-500">Keep standard volume level across all tracks</p>
              </div>
              <button
                onClick={() => setNormalizeAudio(!normalizeAudio)}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer ${
                  normalizeAudio ? 'bg-violet-600' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-in-out ${
                    normalizeAudio ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Autoplay toggle */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div>
                <p className="text-sm text-slate-300 font-medium">Autoplay Similar Music</p>
                <p className="text-xs text-slate-500">Keep the music going when an album or playlist ends</p>
              </div>
              <button
                onClick={() => setAutoPlaySimilar(!autoPlaySimilar)}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer ${
                  autoPlaySimilar ? 'bg-violet-600' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-in-out ${
                    autoPlaySimilar ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsEditing(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-6">Edit Profile</h3>

            <form onSubmit={handleSaveProfile} className="space-y-5">
              {/* Avatar Picker */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Select Avatar</label>
                <div className="flex items-center gap-3">
                  {avatarOptions.map((opt, i) => (
                    <div
                      key={i}
                      onClick={() => setEditAvatar(opt)}
                      className={`w-14 h-14 rounded-full overflow-hidden border-2 cursor-pointer transition-all ${
                        editAvatar === opt ? 'border-violet-500 ring-2 ring-violet-500/50 scale-105' : 'border-white/10 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={opt} alt="avatar option" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Display Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500"
                  required
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Bio</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium text-sm transition-all shadow-lg cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
