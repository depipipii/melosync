import { 
  Play, Pause, SkipBack, SkipForward, Volume2, 
  Heart, Shuffle, Repeat, Mic2, VolumeX 
} from 'lucide-react';
import { TRACKS } from '../data/musicData';

interface PlayerBarProps {
  currentTrack: typeof TRACKS[0];
  isPlaying: boolean;
  progress: number;
  volume: number;
  showLyrics: boolean;
  handlePlayPause: () => void;
  handleNext: () => void;
  handlePrev: () => void;
  setProgress: (progress: number | ((prev: number) => number)) => void;
  setShowLyrics: (show: boolean) => void;
  setVolume: (volume: number) => void;
  formatTime: (seconds: number) => string;
}

export default function PlayerBar({
  currentTrack,
  isPlaying,
  progress,
  volume,
  showLyrics,
  handlePlayPause,
  handleNext,
  handlePrev,
  setProgress,
  setShowLyrics,
  setVolume,
  formatTime
}: PlayerBarProps) {
  return (
    <div className="fixed bottom-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[95%] max-w-6xl h-24 bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-[2rem] flex items-center px-4 md:px-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 transition-all duration-500">
      {/* Track Info (Left) */}
      <div className="flex items-center gap-4 w-1/3 min-w-[160px]">
        <div className="relative group overflow-hidden rounded-2xl shadow-xl w-14 h-14 shrink-0 border border-white/10">
          <img src={currentTrack.cover} alt="Cover" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        </div>
        <div className="flex flex-col justify-center overflow-hidden">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white truncate hover:underline cursor-pointer">{currentTrack.title}</span>
          </div>
          <span className="text-xs text-slate-400 truncate hover:underline cursor-pointer mt-0.5">{currentTrack.artist}</span>
        </div>
        <Heart className="w-4 h-4 text-slate-500 hover:text-rose-500 cursor-pointer hidden lg:block ml-2 transition-colors" />
      </div>

      {/* Core Controls & Progress (Center) */}
      <div className="flex flex-col items-center justify-center flex-1 max-w-2xl px-2 md:px-4">
        <div className="flex items-center gap-4 md:gap-8 mb-2">
          <Shuffle className="w-4 h-4 text-slate-500 hover:text-white cursor-pointer transition-colors hidden sm:block" />
          <SkipBack className="w-5 h-5 text-slate-300 hover:text-white cursor-pointer transition-colors" onClick={handlePrev} />

          <button
            onClick={handlePlayPause}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-950 hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
          </button>

          <SkipForward className="w-5 h-5 text-slate-300 hover:text-white cursor-pointer transition-colors" onClick={handleNext} />
          <Repeat className="w-4 h-4 text-slate-500 hover:text-white cursor-pointer transition-colors hidden sm:block" />
        </div>

        <div className="flex items-center gap-3 w-full">
          <span className="text-[10px] font-medium tracking-wider text-slate-400 min-w-[32px] text-right">{formatTime(progress)}</span>

          {/* Interactive Progress Bar */}
          <div
            className="relative flex-1 h-1.5 bg-white/10 rounded-full group cursor-pointer"
            onClick={(e) => {
              const bounds = e.currentTarget.getBoundingClientRect();
              const percent = (e.clientX - bounds.left) / bounds.width;
              setProgress(currentTrack.duration * percent);
            }}
          >
            <div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-violet-400 to-rose-400 rounded-full transition-all duration-200 ease-linear"
              style={{ width: `${(progress / currentTrack.duration) * 100}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_10px_rgba(255,255,255,1)] transform translate-x-1/2" />
            </div>
          </div>

          <span className="text-[10px] font-medium tracking-wider text-slate-400 min-w-[32px]">{formatTime(currentTrack.duration)}</span>
        </div>
      </div>

      {/* Right Controls: Lyrics & Volume */}
      <div className="flex justify-end items-center gap-4 w-1/3 min-w-[120px] hidden md:flex">
        <button
          onClick={() => setShowLyrics(!showLyrics)}
          className={`p-2 rounded-full transition-all duration-300 ${showLyrics ? 'bg-white/20 text-violet-300 shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
          title="Toggle Lyrics"
        >
          <Mic2 className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 group">
          <button onClick={() => setVolume(volume === 0 ? 80 : 0)}>
            {volume === 0 ? (
              <VolumeX className="w-4 h-4 text-slate-400 hover:text-white transition-colors" />
            ) : (
              <Volume2 className="w-4 h-4 text-slate-400 hover:text-white transition-colors" />
            )}
          </button>

          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(parseInt(e.target.value))}
            className="w-20 lg:w-24 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer outline-none overflow-hidden
                       [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-0 [&::-webkit-slider-thumb]:h-0"
            style={{
              background: `linear-gradient(to right, white ${volume}%, rgba(255,255,255,0.1) ${volume}%)`
            }}
          />
        </div>
      </div>
    </div>
  );
}
