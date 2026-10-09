import { Home, Compass, Library, Heart, User } from 'lucide-react';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  showLyrics: boolean;
  setShowLyrics: (show: boolean) => void;
  favoritesCount: number;
}

export default function MobileNav({
  activeTab,
  setActiveTab,
  showLyrics,
  setShowLyrics,
  favoritesCount,
}: MobileNavProps) {
  const navItems = [
    { id: 'Home', label: 'Home', icon: Home },
    { id: 'Discover', label: 'Discover', icon: Compass },
    { id: 'Library', label: 'Library', icon: Library },
    { id: 'Favorites', label: 'Favorites', icon: Heart, badge: favoritesCount > 0 ? favoritesCount : undefined },
    { id: 'Profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-slate-950/85 backdrop-blur-2xl border-t border-white/10 z-40 md:hidden flex items-center justify-around px-2 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
      {navItems.map((item) => {
        const isActive = activeTab === item.id && !showLyrics;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              setShowLyrics(false);
            }}
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 relative transition-all duration-200 cursor-pointer ${
              isActive ? 'text-violet-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-white' : ''}`} />
              {item.badge !== undefined && (
                <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {item.badge > 9 ? '9+' : item.badge}
                </span>
              )}
            </div>
            <span className={`text-[10px] mt-1 transition-colors ${isActive ? 'text-violet-300 font-medium' : 'text-slate-400'}`}>
              {item.label}
            </span>
            {isActive && (
              <span className="absolute bottom-1 w-1 h-1 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,1)]" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
