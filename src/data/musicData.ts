export interface LyricLine {
  time: number;
  text: string;
}

export interface Track {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: number;
  mood: string;
  genre: string;
  glowPrimary?: string;
  glowSecondary?: string;
  cover: string;
  audioUrl?: string;
  lyrics?: LyricLine[];
  isCustom?: boolean;
}

export const MOODS = ['All', 'Belajar', 'Santai', 'Olahraga', 'Tidur', 'Semangat', 'Fokus'];

// Pemetaan mood → genre yang terasosiasi
export const MOOD_GENRES: Record<string, string[]> = {
  'All':        [],
  'Belajar':    ['Indie', 'Jazz', 'Instrumental'],
  'Santai':     ['R&B', 'Jazz', 'Indie', 'Pop'],
  'Olahraga':   ['Hip-Hop / Rap', 'Rock', 'EDM'],
  'Tidur':      ['Jazz', 'Instrumental', 'Indie'],
  'Semangat':   ['Hip-Hop / Rap', 'EDM', 'Pop', 'K-Pop', 'Latin'],
  'Fokus':      ['Indie', 'Jazz', 'Instrumental', 'Rock'],
};

export const TRACKS = [
  {
    id: 1,
    title: "Luminous",
    artist: "Elegy",
    album: "Echoes",
    duration: 180,
    mood: "Fokus",
    genre: "Indie",
    glowPrimary: "bg-violet-600/40",
    glowSecondary: "bg-fuchsia-600/30",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80",
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
    mood: "Santai",
    genre: "R&B",
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
    mood: "Semangat",
    genre: "EDM",
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
    mood: "Tidur",
    genre: "Jazz",
    glowPrimary: "bg-rose-600/40",
    glowSecondary: "bg-orange-600/30",
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=300&q=80",
    lyrics: [
      { time: 0, text: "Engine humming down the lane," },
      { time: 18, text: "Washing away all the pain." },
      { time: 35, text: "Just the road and empty thoughts," },
      { time: 50, text: "In the tangled web we caught." }
    ]
  },
  {
    id: 5,
    title: "Disenchanted",
    artist: "My Chemical Romance",
    album: "The Black Parade",
    duration: 295,
    mood: "Semangat",
    genre: "Rock",
    glowPrimary: "bg-amber-600/40",
    glowSecondary: "bg-rose-700/30",
    cover: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=600&q=80",
    lyrics: [
      { time: 0, text: "(Acoustic Guitar Intro)" },
      { time: 20, text: "Well, I was there on the day they sold the cause for the queen" },
      { time: 25, text: "And when the lights all went out, we watched our lives on the screen" },
      { time: 31, text: "I hate the ending myself, but it started with an alright scene" },
      { time: 42, text: "It was the roar of the crowd that gave me heartache to sing" },
      { time: 48, text: "It was a lie when they smiled and said, 'You won't feel a thing'" },
      { time: 53, text: "And as we ran from the cops, we laughed so hard it would sting" },
      { time: 61, text: "Yeah, yeah, oh" },
      { time: 66, text: "If I'm so wrong (so wrong, so wrong)" },
      { time: 70, text: "How can you listen all night long? (night long, night long)" },
      { time: 77, text: "Now will it matter after I'm gone?" },
      { time: 81, text: "Because you never learn a goddamn thing" },
      { time: 87, text: "You're just a sad song with nothing to say" },
      { time: 92, text: "About a lifelong wait for a hospital stay" },
      { time: 97, text: "And if you think that I'm wrong" },
      { time: 101, text: "This never meant nothing to ya" },
      { time: 109, text: "I spent my high school career spit on and shoved to agree" },
      { time: 114, text: "So I could watch all my heroes sell a car on TV" },
      { time: 119, text: "Bring out the old guillotine, we'll show 'em what we all mean" },
      { time: 127, text: "Yeah, yeah, oh" },
      { time: 132, text: "If I'm so wrong (so wrong, so wrong)" },
      { time: 137, text: "How can you listen all night long? (night long, night long)" },
      { time: 143, text: "Now will it matter long after I'm gone?" },
      { time: 147, text: "Because you never learn a goddamn thing" },
      { time: 153, text: "You're just a sad song with nothing to say" },
      { time: 158, text: "About a lifelong wait for a hospital stay" },
      { time: 164, text: "And if you think that I'm wrong" },
      { time: 167, text: "This never meant nothing to ya" },
      { time: 174, text: "So go, go away, just go, run away" },
      { time: 185, text: "But where did you run to? And where did you hide?" },
      { time: 193, text: "Go find another way, price you pay" },
      { time: 202, text: "Whoa, whoa, whoa, whoa..." },
      { time: 221, text: "You're just a sad song with nothing to say" },
      { time: 226, text: "About a lifelong wait for a hospital stay" },
      { time: 232, text: "And if you think that I'm wrong" },
      { time: 236, text: "This never meant nothing to ya" },
      { time: 242, text: "You're just a sad song with nothing to say" },
      { time: 248, text: "About a lifelong wait for a hospital stay" },
      { time: 253, text: "And if you think that I'm wrong" },
      { time: 257, text: "This never meant nothing to ya" },
      { time: 263, text: "At all..." },
      { time: 269, text: "At all..." },
      { time: 274, text: "At all..." },
      { time: 280, text: "At all..." },
      { time: 288, text: "(Outro - Acoustic Guitar fades)" }
    ]
  }
];

export const GENRES = [
  { id: 1,  name: "Pop",         gradient: "from-pink-500 to-rose-600",     image: "https://images.unsplash.com/photo-1493225457224-eda0e6fd1463?auto=format&fit=crop&w=150&q=80" },
  { id: 2,  name: "Hip-Hop / Rap", gradient: "from-orange-500 to-amber-700", image: "https://images.unsplash.com/photo-1547355253-ff0740f859b4?auto=format&fit=crop&w=150&q=80" },
  { id: 3,  name: "R&B",         gradient: "from-purple-600 to-violet-800", image: "https://images.unsplash.com/photo-1516280440502-61f00a98f5b4?auto=format&fit=crop&w=150&q=80" },
  { id: 4,  name: "Rock",        gradient: "from-red-600 to-stone-800",     image: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=150&q=80" },
  { id: 5,  name: "EDM",         gradient: "from-cyan-400 to-blue-600",     image: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=150&q=80" },
  { id: 6,  name: "Indie",       gradient: "from-emerald-400 to-teal-600",  image: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&w=150&q=80" },
  { id: 7,  name: "K-Pop",       gradient: "from-fuchsia-500 to-pink-700",  image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" },
  { id: 8,  name: "Latin",       gradient: "from-yellow-500 to-orange-600", image: "https://images.unsplash.com/photo-1504898770365-14faca6a7320?auto=format&fit=crop&w=150&q=80" },
  { id: 9,  name: "Jazz",        gradient: "from-slate-600 to-zinc-800",    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=150&q=80" },
  { id: 10, name: "Country",     gradient: "from-amber-600 to-yellow-800",  image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=150&q=80" },
];

export const LIBRARY_ALBUMS = [
  { id: 1, title: "Echoes", artist: "Elegy", cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80" },
  { id: 2, title: "Midnight", artist: "The Ethereal", cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=300&q=80" },
  { id: 3, title: "Grid", artist: "CyberSynth", cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=300&q=80" },
  { id: 4, title: "Horizons", artist: "Aura", cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=300&q=80" },
  { id: 5, title: "Abstract", artist: "Melo", cover: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&w=300&q=80" },
  { id: 6, title: "Voyage", artist: "Stellar", cover: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=300&q=80" },
];

export const LIBRARY_PLAYLISTS = [
  { id: 1, title: "Synthwave Essentials", description: "Curated retro synth beats", trackCount: 16, cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=300&q=80" },
  { id: 2, title: "Deep Midnight Chill", description: "Smooth downtempo & ambient", trackCount: 24, cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=300&q=80" },
  { id: 3, title: "Coding & Concentration", description: "Low frequency flow state audio", trackCount: 30, cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80" },
  { id: 4, title: "Night Expressway", description: "Atmospheric electronic journeys", trackCount: 12, cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=300&q=80" },
  { id: 5, title: "Euphoric Dreams", description: "Warm pads and gentle bass", trackCount: 22, cover: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&w=300&q=80" },
  { id: 6, title: "Acoustic Serenity", description: "Melodic guitars & peaceful moods", trackCount: 18, cover: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=300&q=80" },
];

export const LIBRARY_ARTISTS = [
  { id: 1, name: "Elegy", genre: "Ambient & Electronic", monthlyListeners: "1.2M listeners", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" },
  { id: 2, name: "The Ethereal", genre: "Dream Pop & Ambient", monthlyListeners: "890K listeners", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80" },
  { id: 3, name: "CyberSynth", genre: "Synthwave & Darksynth", monthlyListeners: "2.4M listeners", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80" },
  { id: 4, name: "Aura", genre: "Lo-Fi & Downtempo", monthlyListeners: "940K listeners", image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80" },
  { id: 5, name: "Melo", genre: "Chillhop & Beats", monthlyListeners: "620K listeners", image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80" },
  { id: 6, name: "Stellar", genre: "Neo-Classical Ambient", monthlyListeners: "1.8M listeners", image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80" },
];

export const CUSTOM_TRACKS_STORAGE_KEY = 'melosync_custom_tracks';

export const getCustomTracks = (): Track[] => {
  try {
    const raw = localStorage.getItem(CUSTOM_TRACKS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveCustomTracks = (tracks: Track[]) => {
  try {
    localStorage.setItem(CUSTOM_TRACKS_STORAGE_KEY, JSON.stringify(tracks));
  } catch (e) {
    console.error('Failed to save custom tracks to localStorage:', e);
  }
};

