import { useState, useEffect } from 'react';
import { supabase, demoSignIn, demoSignUp, USE_DEMO_AUTH } from '../lib/supabase';
import { Disc3, Mail, Lock, ArrowRight, Loader2, Sparkles, AlertCircle, X, Eye, EyeOff } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'signin' | 'signup';
  reasonText?: string;
}

export default function Auth({ isOpen, onClose, defaultMode = 'signin', reasonText }: AuthModalProps) {
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(defaultMode === 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Password strength
  const pwLen = password.length;
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const pwStrength = [pwLen >= 6, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
  const strengthLabel = ['', 'Lemah', 'Cukup', 'Kuat', 'Sangat Kuat'][pwStrength];
  const strengthColors = [
    '',
    'bg-rose-500',
    'bg-amber-400',
    'bg-emerald-400',
    'bg-emerald-500',
  ];
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Sync default mode when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsRegister(defaultMode === 'signup');
      setError(null);
      setSuccessMsg(null);
    }
  }, [isOpen, defaultMode]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    if (!email.includes('@')) {
      setError('Masukkan email yang valid.');
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError('Password minimal 6 karakter.');
      setLoading(false);
      return;
    }

    try {
      if (USE_DEMO_AUTH) {
        if (isRegister) {
          await demoSignUp(email, password);
          setSuccessMsg('Akun berhasil dibuat! Menyinkronkan...');
          setTimeout(() => { onClose(); window.location.reload(); }, 1200);
        } else {
          await demoSignIn(email, password);
          setSuccessMsg('Login berhasil! Memuat...');
          setTimeout(() => { onClose(); window.location.reload(); }, 800);
        }
      } else {
        if (isRegister) {
          const { error } = await supabase.auth.signUp({ email, password });
          if (error) throw error;
          setSuccessMsg('Cek email untuk link konfirmasi!');
        } else {
          const { error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) throw error;
          setTimeout(onClose, 400);
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      let msg = err.message || 'Terjadi kesalahan saat autentikasi.';
      if (msg.includes('Invalid login')) msg = 'Email atau password salah.';
      if (msg.includes('User already')) msg = 'Email ini sudah terdaftar.';
      if (msg.includes('fetch')) msg = 'Gagal terhubung ke server. Cek konfigurasi Supabase.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md relative animate-in zoom-in-95 slide-in-from-bottom-2 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close login"
          className="absolute -top-12 right-0 p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-[2rem] p-7 md:p-8 shadow-2xl relative overflow-hidden">
          {/* Background Glow */}
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-violet-600/10 dark:bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-fuchsia-500/10 dark:bg-fuchsia-500/20 rounded-full blur-3xl pointer-events-none" />





          <div className="flex flex-col items-center mb-7 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg mb-3">
              <Disc3 className="w-8 h-8 text-white animate-spin-slow" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Melo<span className="text-violet-600 dark:text-violet-400">Sync</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 text-center max-w-xs">
              {isRegister ? 'Buat akun untuk simpan playlist & favoritmu' : 'Masuk untuk akses koleksi musik kamu'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4 relative z-10">
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-300 text-xs p-3 rounded-xl text-center flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {successMsg && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-300 text-xs p-3 rounded-xl text-center flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 ml-1 flex items-center gap-1">
                <Mail className="w-3 h-3" /> Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trim())}
                  placeholder="kamu@melosync.com"
                  className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 ml-1 flex items-center gap-1">
                <Lock className="w-3 h-3" /> Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 pl-11 pr-10 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 dark:text-slate-500 hover:text-violet-500 dark:hover:text-violet-400 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength — hanya saat register dan password mulai diketik */}
              {isRegister && password.length > 0 && (
                <div className="mt-2.5 space-y-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((bar) => (
                      <div
                        key={bar}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          pwStrength >= bar ? strengthColors[pwStrength] : 'bg-slate-200 dark:bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-[11px] font-semibold ${
                    pwStrength <= 1 ? 'text-rose-500' :
                    pwStrength === 2 ? 'text-amber-500' :
                    'text-emerald-500'
                  }`}>{strengthLabel}</p>
                  <ul className="space-y-0.5">
                    {[
                      { ok: pwLen >= 6, label: 'Minimal 6 karakter' },
                      { ok: hasUpper,   label: 'Mengandung huruf kapital' },
                      { ok: hasNumber,  label: 'Mengandung angka' },
                      { ok: hasSpecial, label: 'Mengandung karakter khusus (!@#…)' },
                    ].map(({ ok, label }) => (
                      <li key={label} className={`flex items-center gap-1.5 text-[11px] transition-colors ${
                        ok ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'
                      }`}>
                        <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 text-white text-[9px] font-bold transition-all ${
                          ok ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-white/10'
                        }`}>{ok ? '✓' : ''}</span>
                        {label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 mt-3 shadow-xl shadow-violet-900/20 cursor-pointer"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  {isRegister ? 'Create Account' : 'Sign In'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center relative z-10">
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              {isRegister ? (
                <>Sudah punya akun? <span className="text-violet-600 dark:text-violet-400 font-semibold">Sign In</span></>
              ) : (
                <>Baru di MeloSync? <span className="text-violet-600 dark:text-violet-400 font-semibold">Create Account</span></>
              )}
            </button>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}} />
    </div>
  );
}
