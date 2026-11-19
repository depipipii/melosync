import { useState, useRef } from 'react';
import {
  UploadCloud, Music, Image as ImageIcon, Sparkles, Trash2, Play, Pause,
  Check, RefreshCw, FileAudio, AlertCircle, Plus, Search, Disc, Clock, Lock
} from 'lucide-react';
import { MOODS, GENRES } from '../data/musicData';
import type { Track, LyricLine } from '../data/musicData';

interface AdminUploadProps {
  tracks: Track[];
  onAddTrack: (track: Track) => void;
  onDeleteTrack: (trackId: number) => void;
  onPlayTrack: (track: Track) => void;
  currentTrackId?: number;
  isPlaying?: boolean;
  onLogoutAdmin?: () => void;
}

const GLOW_PRESETS = [
  { name: 'Violet Glow', primary: 'bg-violet-600/40', secondary: 'bg-fuchsia-600/30', color: 'from-violet-600 to-fuchsia-600' },
  { name: 'Cyan Pulse', primary: 'bg-cyan-500/40', secondary: 'bg-blue-600/30', color: 'from-cyan-500 to-blue-600' },
  { name: 'Emerald Beat', primary: 'bg-emerald-500/40', secondary: 'bg-teal-500/30', color: 'from-emerald-500 to-teal-500' },
  { name: 'Rose Dream', primary: 'bg-rose-600/40', secondary: 'bg-orange-600/30', color: 'from-rose-600 to-orange-500' },
  { name: 'Amber Sunset', primary: 'bg-amber-500/40', secondary: 'bg-rose-500/30', color: 'from-amber-500 to-rose-500' },
  { name: 'Indigo Night', primary: 'bg-blue-600/40', secondary: 'bg-indigo-600/30', color: 'from-blue-600 to-indigo-600' },
];

const RANDOM_COVERS = [
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1516280440502-61f00a98f5b4?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&w=600&q=80",
];

export default function AdminUpload({
  tracks,
  onAddTrack,
  onDeleteTrack,
  onPlayTrack,
  currentTrackId,
  isPlaying,
  onLogoutAdmin,
}: AdminUploadProps) {
  // Form State
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('');
  const [genre, setGenre] = useState('Pop');
  const [mood, setMood] = useState('Santai');
  const [durationStr, setDurationStr] = useState('180'); // in seconds or mm:ss
  const [coverUrl, setCoverUrl] = useState(RANDOM_COVERS[0]);
  const [audioUrl, setAudioUrl] = useState('');
  const [audioFileName, setAudioFileName] = useState('');
  const [lyricsText, setLyricsText] = useState('');
  const [glowPresetIdx, setGlowPresetIdx] = useState(0);

  // Status & Notification
  const [activeTab, setActiveTab] = useState<'upload' | 'catalog'>('upload');
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogFilter, setCatalogFilter] = useState<'all' | 'custom'>('all');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Audio Preview ref in form
  const [isPreviewAudioPlaying, setIsPreviewAudioPlaying] = useState(false);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Handle Audio File Upload
  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAudioFileName(file.name);
    // If user hasn't typed title, try using file name without extension
    if (!title) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
    }

    const objectUrl = URL.createObjectURL(file);
    setAudioUrl(objectUrl);

    // Auto-detect duration
    const tempAudio = new Audio(objectUrl);
    tempAudio.onloadedmetadata = () => {
      if (tempAudio.duration && !isNaN(tempAudio.duration) && tempAudio.duration !== Infinity) {
        setDurationStr(Math.round(tempAudio.duration).toString());
      }
    };
  };

  // Handle Cover Image Upload
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCoverUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Generate random cover
  const handleRandomizeCover = () => {
    const nextCover = RANDOM_COVERS[Math.floor(Math.random() * RANDOM_COVERS.length)];
    setCoverUrl(nextCover);
  };

  // Auto-generate timestamps from lyrics text
  const handleAutoLyricsTimestamp = () => {
    if (!lyricsText.trim()) return;
    const lines = lyricsText.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return;

    const totalSeconds = parseInt(durationStr, 10) || 180;
    const interval = Math.max(4, Math.floor(totalSeconds / (lines.length + 1)));

    const formattedLines = lines.map((text, idx) => {
      // Check if line already has timestamp like "[00:15]" or "15:"
      const match = text.match(/^\[?(\d{1,2}):(\d{2})\]?\s*(.*)$/);
      if (match) return text;
      const t = idx * interval;
      return `[${formatSeconds(t)}] ${text}`;
    });

    setLyricsText(formattedLines.join('\n'));
  };

  // Parse lyrics string into structured LyricLine[]
  const parseLyrics = (text: string, totalDur: number): LyricLine[] => {
    if (!text.trim()) {
      return [
        { time: 0, text: "(Intro Instrumental)" },
        { time: Math.min(20, Math.floor(totalDur * 0.15)), text: `${title} - ${artist}` },
        { time: Math.floor(totalDur * 0.5), text: "(Melody)" }
      ];
    }

    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const parsed: LyricLine[] = [];

    lines.forEach((line, idx) => {
      // Pattern: [01:23] lirik or 01:23 lirik
      const timestampMatch = line.match(/^\[?(\d{1,2}):(\d{2})\]?\s*(.*)$/);
      if (timestampMatch) {
        const minutes = parseInt(timestampMatch[1], 10);
        const seconds = parseInt(timestampMatch[2], 10);
        parsed.push({
          time: minutes * 60 + seconds,
          text: timestampMatch[3] || line,
        });
      } else {
        // Fallback: estimate time based on position
        const estTime = Math.floor((idx / lines.length) * totalDur);
        parsed.push({
          time: estTime,
          text: line,
        });
      }
    });

    return parsed.sort((a, b) => a.time - b.time);
  };

  // Handle Form Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!title.trim()) {
      setErrorMessage('Judul lagu wajib diisi.');
      return;
    }
    if (!artist.trim()) {
      setErrorMessage('Nama artis/penyanyi wajib diisi.');
      return;
    }

    let parsedDuration = 180;
    if (durationStr.includes(':')) {
      const parts = durationStr.split(':');
      parsedDuration = (parseInt(parts[0], 10) || 0) * 60 + (parseInt(parts[1], 10) || 0);
    } else {
      parsedDuration = parseInt(durationStr, 10) || 180;
    }

    if (parsedDuration <= 0) parsedDuration = 180;

    setIsSubmitting(true);

    try {
      const selectedGlow = GLOW_PRESETS[glowPresetIdx];
      const newTrack: Track = {
        id: Date.now(),
        title: title.trim(),
        artist: artist.trim(),
        album: album.trim() || 'Single',
        genre: genre.trim() || 'Pop',
        mood: mood.trim() || 'Santai',
        duration: parsedDuration,
        cover: coverUrl.trim() || RANDOM_COVERS[0],
        audioUrl: audioUrl || undefined,
        glowPrimary: selectedGlow.primary,
        glowSecondary: selectedGlow.secondary,
        lyrics: parseLyrics(lyricsText, parsedDuration),
        isCustom: true,
      };

      onAddTrack(newTrack);

      setSuccessMessage(`Lagu "${newTrack.title}" berhasil diunggah! Sekarang pengguna dapat mendengarkannya dan memasukkannya ke playlist.`);

      // Reset form fields
      setTitle('');
      setArtist('');
      setAlbum('');
      setAudioUrl('');
      setAudioFileName('');
      setLyricsText('');
      setDurationStr('180');
      handleRandomizeCover();

      if (fileInputRef.current) fileInputRef.current.value = '';
      if (imageInputRef.current) imageInputRef.current.value = '';

      // Auto switch to catalog view after a moment
      setTimeout(() => {
        setActiveTab('catalog');
        setSuccessMessage(null);
      }, 2500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal menyimpan lagu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCatalog = tracks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      t.artist.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      t.album.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      t.genre.toLowerCase().includes(catalogSearch.toLowerCase());

    if (catalogFilter === 'custom') {
      return matchesSearch && t.isCustom;
    }
    return matchesSearch;
  });

  const customTracksCount = tracks.filter(t => t.isCustom).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-indigo-600 to-fuchsia-600 p-6 md:p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> Studio Admin MeloSync
              </div>
              {onLogoutAdmin && (
                <button
                  type="button"
                  onClick={onLogoutAdmin}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/30 hover:bg-rose-500/80 text-white/90 hover:text-white backdrop-blur-md text-xs font-semibold transition-colors cursor-pointer"
                  title="Kunci Akses Admin dan Kembali ke Beranda"
                >
                  <Lock className="w-3 h-3" /> Kunci Sesi Admin
                </button>
              )}
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">Unggah & Kelola Lagu</h1>
            <p className="text-white/80 text-sm md:text-base max-w-xl mt-1">
              Tambahkan lagu baru ke katalog sistem. Setiap lagu yang Anda unggah akan langsung tersedia bagi seluruh pengguna untuk diputar dan ditambahkan ke playlist mereka.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center min-w-[110px]">
              <span className="text-2xl md:text-3xl font-black">{tracks.length}</span>
              <p className="text-xs text-white/70">Total Lagu</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center min-w-[110px]">
              <span className="text-2xl md:text-3xl font-black text-yellow-300">{customTracksCount}</span>
              <p className="text-xs text-white/70">Upload Admin</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Pill Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
          >
            <UploadCloud className="w-4 h-4" /> Form Unggah Lagu
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'catalog'
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
          >
            <Disc className="w-4 h-4" /> Katalog & Kelola Lagu ({tracks.length})
          </button>
        </div>
      </div>

      {/* Alerts */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center gap-3 animate-in slide-in-from-top-2">
          <Check className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{successMessage}</p>
        </div>
      )}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 flex items-center gap-3 animate-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{errorMessage}</p>
        </div>
      )}

      {/* TAB 1: FORM UNGGAH LAGU */}
      {activeTab === 'upload' && (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info Column (2 cols wide) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Music className="w-5 h-5 text-violet-500" /> Informasi Lagu
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Judul Lagu <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Senja di Jakarta"
                    className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Artis / Penyanyi <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                    placeholder="Contoh: Hindia / NIKI"
                    className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Album
                  </label>
                  <input
                    type="text"
                    value={album}
                    onChange={(e) => setAlbum(e.target.value)}
                    placeholder="Contoh: Menari Dengan Bayangan (Default: Single)"
                    className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Durasi (detik atau mm:ss)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={durationStr}
                      onChange={(e) => setDurationStr(e.target.value)}
                      placeholder="180 atau 03:00"
                      className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                    />
                    <Clock className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Genre
                  </label>
                  <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl py-3 px-4 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-violet-500 transition-all cursor-pointer"
                  >
                    {GENRES.map((g) => (
                      <option key={g.id} value={g.name} className="dark:bg-slate-900">
                        {g.name}
                      </option>
                    ))}
                    <option value="Instrumental" className="dark:bg-slate-900">Instrumental</option>
                    <option value="Lo-Fi" className="dark:bg-slate-900">Lo-Fi</option>
                    <option value="Acoustic" className="dark:bg-slate-900">Acoustic</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Kategori Mood
                  </label>
                  <select
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl py-3 px-4 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-violet-500 transition-all cursor-pointer"
                  >
                    {MOODS.filter(m => m !== 'All').map((m) => (
                      <option key={m} value={m} className="dark:bg-slate-900">
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Audio File Upload */}
              <div className="pt-2 border-t border-slate-200 dark:border-white/5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  File Audio Lagu (MP3, WAV, M4A, OGG)
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="audio/*,.mp3,.wav,.ogg,.m4a"
                    onChange={handleAudioFileChange}
                    className="hidden"
                    id="audio-file-input"
                  />
                  <label
                    htmlFor="audio-file-input"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border-2 border-dashed border-violet-500/40 hover:border-violet-500 bg-violet-500/5 hover:bg-violet-500/10 text-violet-600 dark:text-violet-400 text-sm font-semibold transition-all cursor-pointer"
                  >
                    <FileAudio className="w-5 h-5" />
                    {audioFileName ? 'Ganti File Audio' : 'Pilih File Audio'}
                  </label>

                  {audioFileName && (
                    <div className="flex-1 min-w-0 bg-slate-100 dark:bg-white/5 py-2 px-4 rounded-xl border border-slate-200 dark:border-white/10 flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                        {audioFileName}
                      </span>
                      {audioUrl && (
                        <audio
                          ref={previewAudioRef}
                          src={audioUrl}
                          className="hidden"
                          onEnded={() => setIsPreviewAudioPlaying(false)}
                        />
                      )}
                      {audioUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            if (!previewAudioRef.current) return;
                            if (isPreviewAudioPlaying) {
                              previewAudioRef.current.pause();
                              setIsPreviewAudioPlaying(false);
                            } else {
                              previewAudioRef.current.play();
                              setIsPreviewAudioPlaying(true);
                            }
                          }}
                          className="ml-2 text-xs flex items-center gap-1 font-semibold text-violet-600 dark:text-violet-400 hover:underline cursor-pointer"
                        >
                          {isPreviewAudioPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                          {isPreviewAudioPlaying ? 'Jeda' : 'Tes Suara'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5">
                  *Opsional. Jika tidak diunggah, pemutar musik MeloSync akan menjalankan mode simulasi audio dengan timer dan sinkronisasi lirik.
                </p>
              </div>

              {/* Lyrics Editor */}
              <div className="pt-2 border-t border-slate-200 dark:border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Lirik Lagu
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoLyricsTimestamp}
                    className="text-xs font-medium text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" /> Auto-Format Timestamp [mm:ss]
                  </button>
                </div>
                <textarea
                  rows={6}
                  value={lyricsText}
                  onChange={(e) => setLyricsText(e.target.value)}
                  placeholder={`Tempel lirik lagu di sini...\nContoh:\n[00:00] (Intro Instrumental)\n[00:15] Berjalan di antara lampu kota\n[00:30] Menemani malam yang sunyi`}
                  className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                />
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                  Format waktu `[mm:ss]` otomatis disinkronkan dengan pemutar lirik full-screen MeloSync.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Artwork & Player Glow & Submit */}
          <div className="space-y-6">
            {/* Artwork Card */}
            <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-violet-500" /> Cover Artwork
              </h2>

              <div className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-lg group bg-slate-100 dark:bg-slate-800">
                <img
                  src={coverUrl}
                  alt="Preview Cover"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <label
                    htmlFor="cover-file-input"
                    className="p-3 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-white/30 cursor-pointer transition-colors"
                    title="Ganti Gambar dari Perangkat"
                  >
                    <UploadCloud className="w-5 h-5" />
                  </label>
                  <button
                    type="button"
                    onClick={handleRandomizeCover}
                    className="p-3 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-white/30 cursor-pointer transition-colors"
                    title="Pilih Gambar Acak"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <input
                type="file"
                ref={imageInputRef}
                accept="image/*"
                onChange={handleImageFileChange}
                className="hidden"
                id="cover-file-input"
              />

              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  URL Gambar Cover
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={coverUrl}
                    onChange={(e) => setCoverUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-2 px-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
                  />
                  <button
                    type="button"
                    onClick={handleRandomizeCover}
                    className="p-2 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 transition-colors"
                    title="Foto Acak"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Ambient Player Glow Color */}
            <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-500" /> Warna Ambient Player
              </h2>
              <div className="grid grid-cols-3 gap-2">
                {GLOW_PRESETS.map((preset, idx) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => setGlowPresetIdx(idx)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                      glowPresetIdx === idx
                        ? 'border-violet-500 bg-violet-500/10'
                        : 'border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-tr ${preset.color} shadow-sm`} />
                    <span className="text-[10px] font-medium text-slate-700 dark:text-slate-300 text-center truncate w-full">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-violet-600 via-indigo-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-violet-900/30 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                <Plus className="w-5 h-5" />
                {isSubmitting ? 'Menyimpan Lagu...' : 'Unggah & Publikasikan Lagu'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setTitle('');
                  setArtist('');
                  setAlbum('');
                  setAudioUrl('');
                  setAudioFileName('');
                  setLyricsText('');
                  setDurationStr('180');
                  handleRandomizeCover();
                }}
                className="w-full py-3 rounded-2xl border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 text-xs font-semibold transition-all cursor-pointer"
              >
                Reset Formulir
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: KATALOG & KELOLA LAGU */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          {/* Search & Filter Bar */}
          <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-3xl p-4 md:p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                placeholder="Cari lagu, artis, atau genre..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-violet-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setCatalogFilter('all')}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  catalogFilter === 'all'
                    ? 'bg-violet-600 text-white'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                Semua ({tracks.length})
              </button>
              <button
                onClick={() => setCatalogFilter('custom')}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  catalogFilter === 'custom'
                    ? 'bg-violet-600 text-white'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                Upload Admin ({customTracksCount})
              </button>
            </div>
          </div>

          {/* Catalog Table */}
          <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/5 text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold bg-slate-50/50 dark:bg-white/[0.02]">
                    <th className="py-3.5 px-4 w-12 text-center">#</th>
                    <th className="py-3.5 px-4">Lagu & Artis</th>
                    <th className="py-3.5 px-4 hidden md:table-cell">Album</th>
                    <th className="py-3.5 px-4 hidden sm:table-cell">Genre / Mood</th>
                    <th className="py-3.5 px-4 text-right">Durasi</th>
                    <th className="py-3.5 px-4 text-center">Tipe</th>
                    <th className="py-3.5 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                  {filteredCatalog.map((track, idx) => {
                    const isCurrent = currentTrackId === track.id;
                    return (
                      <tr
                        key={track.id}
                        className={`hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors ${
                          isCurrent ? 'bg-violet-600/5 dark:bg-violet-600/10' : ''
                        }`}
                      >
                        <td className="py-3 px-4 text-center text-xs text-slate-400">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-slate-200 dark:border-white/10">
                              <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0">
                              <p className={`font-semibold text-sm truncate ${isCurrent ? 'text-violet-600 dark:text-violet-400' : 'text-slate-900 dark:text-white'}`}>
                                {track.title}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                {track.artist}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-400 hidden md:table-cell truncate max-w-[140px]">
                          {track.album}
                        </td>
                        <td className="py-3 px-4 hidden sm:table-cell">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
                              {track.genre}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400">
                              {track.mood}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right text-xs font-mono text-slate-500">
                          {formatSeconds(track.duration)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {track.isCustom ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                              Upload Admin
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-white/5 text-slate-500">
                              Bawaan
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => onPlayTrack(track)}
                              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                                isCurrent && isPlaying
                                  ? 'bg-violet-600 text-white'
                                  : 'hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300'
                              }`}
                              title={isCurrent && isPlaying ? 'Pause' : 'Putar'}
                            >
                              {isCurrent && isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                            </button>
                            {track.isCustom && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`Yakin ingin menghapus lagu "${track.title}" dari katalog?`)) {
                                    onDeleteTrack(track.id);
                                  }
                                }}
                                className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                title="Hapus Lagu"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredCatalog.length === 0 && (
              <div className="text-center py-16 text-slate-500 space-y-2">
                <Disc className="w-10 h-10 mx-auto text-slate-400" />
                <p className="font-semibold text-slate-700 dark:text-slate-300">Tidak ada lagu yang ditemukan</p>
                <p className="text-xs">Coba ubah kata kunci pencarian atau unggah lagu baru di tab Form Unggah.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
