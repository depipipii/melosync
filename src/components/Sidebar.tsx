import { Home, Compass, Library, Disc3, Heart, User } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  showLyrics: boolean;
  setShowLyrics: (show: boolean) => void;
  session: any;
}

export default function Sidebar({ activeTab, setActiveTab, showLyrics, setShowLyrics, session }: SidebarProps) {
  const user = session?.user;
  const userEmail = user?.email || 'Guest User';
  const userName = userEmail.split('@')[0];
  const displayName = userName.charAt(0).toUpperCase() + userName.slice(1);

  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 dark:border-white/5 bg-white/40 dark:bg-slate-950/40 backdrop-blur-2xl flex flex-col p-8 z-20 hidden md:flex">
      <div 
        className="flex items-center gap-3 mb-16 cursor-pointer group" 
        onClick={() => { setActiveTab('Home'); setShowLyrics(false); }}
      >
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600/20 to-violet-900/10 dark:from-white/20 dark:to-white/5 flex items-center justify-center shadow-lg group-hover:scale-105 transition-all border border-violet-200 dark:border-white/10">
          <Disc3 className="w-6 h-6 text-violet-600 dark:text-white" />
        </div>
        <span className="text-2xl font-light tracking-wide text-slate-900 dark:text-white">Melo<span className="font-semibold text-violet-600 dark:text-violet-300">Sync</span></span>
      </div>

      <nav className="space-y-2 flex-1">
        <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 font-bold mb-6 px-2">Menu</p>
        {[
          { id: 'Home', icon: Home },
          { id: 'Discover', icon: Compass },
          { id: 'Library', icon: Library },
          { id: 'Favorites', icon: Heart },
          { id: 'Profile', icon: User },
        ].map((item) => {
          const isActive = activeTab === item.id && !showLyrics;
          return (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setShowLyrics(false); }}
              className={`flex items-center gap-4 text-sm font-medium transition-all duration-300 w-full px-4 py-3.5 rounded-2xl cursor-pointer ${isActive
                  ? 'bg-violet-600/10 dark:bg-white/10 text-violet-600 dark:text-white shadow-[0_4px_20px_rgba(124,58,237,0.1)] dark:shadow-[0_4px_20px_rgba(255,255,255,0.05)] border border-violet-200 dark:border-white/10'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-200 border border-transparent'
                }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-violet-600 dark:text-white' : ''}`} />
              {item.id}
            </button>
          )
        })}
      </nav>

      {/* Quick Profile Footer Widget */}
      <div
        onClick={() => { setActiveTab('Profile'); setShowLyrics(false); }}
        className={`mt-auto pt-4 border-t border-slate-200 dark:border-white/5 flex items-center gap-3 p-2.5 rounded-2xl cursor-pointer transition-all ${activeTab === 'Profile' ? 'bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10' : 'hover:bg-slate-100 dark:hover:bg-white/5'
          }`}
      >
        <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 dark:border-white/20 shrink-0 bg-slate-200 dark:bg-white/5 flex items-center justify-center">
          {user ? (
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
              alt="Profile Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-5 h-5 text-slate-400 dark:text-slate-500" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{user ? displayName : 'Guest'}</p>
          <p className="text-[10px] text-violet-600 dark:text-violet-300 truncate">{user ? 'Pro Hi-Fi Member' : 'Sign in for more'}</p>
        </div>
      </div>
    </aside>
  );
}
