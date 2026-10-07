export const MOODS = ['All', 'Focus', 'Chill', 'Upbeat', 'Late Night'];

export const TRACKS = [
  {
    id: 1,
    title: "Luminous",
    artist: "Elegy",
    album: "Echoes",
    duration: 180,
    mood: "Focus",
    glowPrimary: "bg-violet-600/40",
    glowSecondary: "bg-fuchsia-600/30",
    cover: "https://images.unsplash.com/photo-1493225457224-eda0e6fd1463?auto=format&fit=crop&w=300&q=80",
    lyrics: [
      { time: 0, text: "(Instrumental Intro)" },
      { time: 10, text: "Walking through the city streets," },
      { time: 15, text: "Neon lights and silent beats." },
      { time: 20, text: "Every shadow holds a face," },
      { time: 25, text: "Lost within this empty space." },
      { time: 30, text: "Oh, we are luminous," },
      { time: 38, text: "Glowing in the dark, just the two of us." },
      { time: 45, text: "Fading into the midnight sun," },
      { time: 55, text: "Before the morning has begun." }
    ]
  },
  {
    id: 2,
    title: "Velvet Night",
    artist: "The Ethereal",
    album: "Midnight",
    duration: 210,
    mood: "Chill",
    glowPrimary: "bg-blue-600/40",
    glowSecondary: "bg-indigo-600/30",
    cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=300&q=80",
    lyrics: [
      { time: 0, text: "The velvet night wraps around..." },
      { time: 12, text: "Silencing the city's sound." },
      { time: 24, text: "Breathe in deep, let it go," },
      { time: 36, text: "Watch the cosmic river flow." },
      { time: 48, text: "Stars aligning in your eyes," },
      { time: 60, text: "Underneath the painted skies." }
    ]
  },
  {
    id: 3,
    title: "Neon Pulse",
    artist: "CyberSynth",
    album: "Grid",
    duration: 195,
    mood: "Upbeat",
    glowPrimary: "bg-emerald-500/40",
    glowSecondary: "bg-teal-500/30",
    cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=300&q=80",
    lyrics: [
      { time: 0, text: "(Upbeat Synth Intro)" },
      { time: 15, text: "Running faster through the wire" },
      { time: 22, text: "Hearts are burning, catching fire" },
      { time: 30, text: "Feel the pulse, don't let it drop" },
      { time: 38, text: "We're never gonna stop!" }
    ]
  },
  {
    id: 4,
    title: "Midnight Drive",
    artist: "Aura",
    album: "Horizons",
    duration: 240,
    mood: "Late Night",
    glowPrimary: "bg-rose-600/40",
    glowSecondary: "bg-orange-600/30",
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=300&q=80",
    lyrics: [
      { time: 0, text: "Engine humming down the lane," },
      { time: 18, text: "Washing away all the pain." },
      { time: 35, text: "Just the road and empty thoughts," },
      { time: 50, text: "In the tangled web we caught." }
    ]
  }
];

export const GENRES = [
  { id: 1, name: "Lo-Fi Beats", gradient: "from-amber-500 to-orange-600" },
  { id: 2, name: "Cyberpunk", gradient: "from-fuchsia-600 to-purple-800" },
  { id: 3, name: "Deep Focus", gradient: "from-blue-500 to-cyan-600" },
  { id: 4, name: "Midnight Jazz", gradient: "from-slate-700 to-slate-900" },
  { id: 5, name: "Indie Pop", gradient: "from-rose-400 to-pink-600" },
  { id: 6, name: "Acoustic Chill", gradient: "from-emerald-500 to-teal-700" }
];

export const LIBRARY_ALBUMS = [
  { id: 1, title: "Echoes", artist: "Elegy", cover: "https://images.unsplash.com/photo-1493225457224-eda0e6fd1463?auto=format&fit=crop&w=300&q=80" },
  { id: 2, title: "Midnight", artist: "The Ethereal", cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=300&q=80" },
  { id: 3, title: "Grid", artist: "CyberSynth", cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=300&q=80" },
  { id: 4, title: "Horizons", artist: "Aura", cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=300&q=80" },
  { id: 5, title: "Abstract", artist: "Melo", cover: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&w=300&q=80" },
  { id: 6, title: "Voyage", artist: "Stellar", cover: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=300&q=80" },
];
