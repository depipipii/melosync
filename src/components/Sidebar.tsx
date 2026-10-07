import { Home, Compass, Library, Disc3 } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  showLyrics: boolean;
  setShowLyrics: (show: boolean) => void;
}

export default function Sidebar({ activeTab, setActiveTab, showLyrics, setShowLyrics }: SidebarProps) {
  return (
    <aside className="w-64 border-r border-white/5 bg-slate-950/40 backdrop-blur-2xl flex flex-col p-8 z-20 hidden md:flex">
      <div 
        className="flex items-center gap-3 mb-16 cursor-pointer group" 
        onClick={() => { setActiveTab('Home'); setShowLyrics(false); }}
      >
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center shadow-lg group-hover:scale-105 transition-all border border-white/10">
          <Disc3 className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl font-light tracking-wide text-white">Melo<span className="font-semibold text-violet-300">Sync</span></span>
      </div>

      <nav className="space-y-2 flex-1">
        <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold mb-6 px-2">Menu</p>
        {[
          { id: 'Home', icon: Home },
          { id: 'Discover', icon: Compass },
          { id: 'Library', icon: Library },
        ].map((item) => {
          const isActive = activeTab === item.id && !showLyrics;
          return (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setShowLyrics(false); }}
              className={`flex items-center gap-4 text-sm font-medium transition-all duration-300 w-full px-4 py-3.5 rounded-2xl ${isActive
                  ? 'bg-white/10 text-white shadow-[0_4px_20px_rgba(255,255,255,0.05)] border border-white/10'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'
                }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />
              {item.id}
            </button>
          )
        })}
      </nav>
    </aside>
  );
}
