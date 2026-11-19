import { useState } from 'react';
import { ShieldAlert, Lock, ArrowLeft, KeyRound, Eye, EyeOff, Sparkles, CheckCircle2 } from 'lucide-react';

interface AdminGateProps {
  onUnlock: (passcode: string) => boolean;
  onBackToApp: () => void;
  currentUserEmail?: string | null;
}

export default function AdminGate({ onUnlock, onBackToApp, currentUserEmail }: AdminGateProps) {
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!passcode.trim()) {
      setErrorMsg('Masukkan kunci akses administrator.');
      return;
    }

    const success = onUnlock(passcode.trim());
    if (success) {
      setIsSuccess(true);
      setErrorMsg(null);
    } else {
      setErrorMsg('Kunci akses salah. Akses ditolak.');
      setPasscode('');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-violet-600/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-fuchsia-600/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center space-y-6">
          {/* Lock Icon Badge */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-violet-500/20 border border-amber-500/30 mx-auto flex items-center justify-center shadow-lg">
            {isSuccess ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-500 animate-bounce" />
            ) : (
              <ShieldAlert className="w-8 h-8 text-amber-500" />
            )}
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[11px] font-bold uppercase tracking-wider mb-2">
              <Lock className="w-3 h-3" /> Area Terbatas Administrator
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Autentikasi Administrator
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
              Halaman pengunggahan lagu khusus untuk Admin. Pengguna biasa tidak memiliki akses ke halaman ini.
            </p>
          </div>

          {currentUserEmail && (
            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-xs text-slate-600 dark:text-slate-400">
              Masuk sebagai: <span className="font-semibold text-slate-900 dark:text-white">{currentUserEmail}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold animate-shake">
              {errorMsg}
            </div>
          )}

          {/* Form Password Admin */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Kunci Akses / PIN Admin
              </label>
              <div className="relative">
                <input
                  type={showPasscode ? 'text' : 'password'}
                  autoFocus
                  required
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Masukkan password admin..."
                  className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 pl-4 pr-11 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                >
                  {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1">
                <KeyRound className="w-3 h-3" /> Password bawaan pengembang: <code className="font-bold text-violet-500">admin123</code>
              </p>
            </div>

            <button
              type="submit"
              disabled={isSuccess}
              className="w-full bg-gradient-to-r from-violet-600 via-indigo-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-violet-900/20 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {isSuccess ? 'Membuka Studio...' : 'Buka Akses Admin'}
            </button>
          </form>

          <div className="pt-2 border-t border-slate-200 dark:border-white/5">
            <button
              type="button"
              onClick={onBackToApp}
              className="w-full py-2.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Beranda Pengguna
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
