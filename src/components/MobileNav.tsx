import { Home, Compass, Library, User } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  showLyrics: boolean;
  setShowLyrics: (show: boolean) => void;
  session: any;
}

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
  isGuest?: boolean;
}

export default function MobileNav({
  activeTab,
  setActiveTab,
  showLyrics,
  setShowLyrics,
  session
}: MobileNavProps) {
  const navItems: NavItem[] = [
    { id: 'Home', label: 'Home', icon: Home },
    { id: 'Discover', label: 'Discover', icon: Compass },
    { id: 'Library', label: 'Library', icon: Library },
    { id: 'Profile', label: 'Profile', icon: User, isGuest: !session },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white/85 dark:bg-slate-950/85 backdrop-blur-2xl border-t border-slate-200 dark:border-white/10 z-40 md:hidden flex items-center justify-around px-2 shadow-[0_-10px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
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
              isActive ? 'text-violet-600 dark:text-violet-400 font-semibold' : 'text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-violet-600 dark:text-white' : ''}`} />
              {item.badge !== undefined && (
                <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {item.badge > 9 ? '9+' : item.badge}
                </span>
              )}
              {item.isGuest && (
                <span className="absolute -top-1 -right-1.5 w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full border border-white dark:border-slate-950" />
              )}
            </div>
            <span className={`text-[10px] mt-1 transition-colors ${isActive ? 'text-violet-600 dark:text-violet-300 font-medium' : 'text-slate-400'}`}>
              {item.label}
            </span>
            {isActive && (
              <span className="absolute bottom-1 w-1 h-1 rounded-full bg-violet-600 dark:bg-violet-400 shadow-[0_0_8px_rgba(124,58,237,1)] dark:shadow-[0_0_8px_rgba(167,139,250,1)]" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
