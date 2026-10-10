import React, { useState, useRef, useEffect } from 'react';
import { useWhiteLabel } from '../context/WhiteLabelContext';
import { LogOut, User as UserIcon, Cloud, Sparkles, ChevronDown, Loader2 } from 'lucide-react';

interface GoogleAuthButtonProps {
  onNavigateToProfile?: () => void;
  className?: string;
}

export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
  onNavigateToProfile,
  className = '',
}) => {
  const { currentUser, isAuthLoading, signInWithGoogle, signOut } = useWhiteLabel();
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogin = async () => {
    try {
      setErrorMessage(null);
      setIsLoggingIn(true);
      await signInWithGoogle();
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user' && err?.code !== 'auth/cancelled-popup-request') {
        setErrorMessage('Não foi possível conectar com o Google. Tente novamente.');
        setTimeout(() => setErrorMessage(null), 4000);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    await signOut();
  };

  if (isAuthLoading) {
    return (
      <div className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse ${className}`}>
        <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-500" />
        <span className="hidden sm:inline">Conectando...</span>
      </div>
    );
  }

  // User is logged in: Display user avatar badge with dropdown
  if (currentUser) {
    const firstName = currentUser.displayName?.split(' ')[0] || 'Usuário';

    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 border border-slate-200/90 dark:border-slate-700 shadow-xs transition-all cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-200 group"
          title={`Conectado como ${currentUser.displayName || currentUser.email} (Firestore Sincronizado)`}
          aria-expanded={isDropdownOpen}
          aria-haspopup="true"
        >
          {currentUser.photoURL ? (
            <img
              src={currentUser.photoURL}
              alt={currentUser.displayName || 'Avatar'}
              className="w-6 h-6 rounded-full object-cover ring-2 ring-emerald-500/80"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-linear-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center text-xs font-bold ring-2 ring-emerald-500/60 shadow-xs">
              {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
            </div>
          )}

          <div className="hidden sm:flex flex-col text-left leading-tight">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100 max-w-[90px] truncate">
              {firstName}
            </span>
          </div>

          <span
            className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-400/30 animate-pulse"
            title="Sincronizado na Nuvem"
          />

          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
              isDropdownOpen ? 'rotate-180 text-emerald-500' : ''
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            {/* Header info */}
            <div className="p-2.5 border-b border-slate-100 dark:border-slate-800/80 mb-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <Cloud className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Cloud Firestore Ativo
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                {currentUser.displayName || 'Usuário'}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {currentUser.email}
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-0.5">
              {onNavigateToProfile && (
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onNavigateToProfile();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer text-left"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>Perfil & Metas Salvas</span>
                </button>
              )}

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer text-left"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Desconectar Conta</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // User is NOT logged in: Customized Google Auth button to access saved data
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={handleLogin}
        disabled={isLoggingIn}
        className="flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/90 active:scale-95 border border-slate-200/90 dark:border-slate-700 rounded-xl shadow-xs hover:shadow-sm transition-all cursor-pointer group"
        title="Entre com sua conta Google para salvar e sincronizar seus dados no Firestore"
      >
        {isLoggingIn ? (
          <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
        ) : (
          <svg className="w-4 h-4 shrink-0 transition-transform group-hover:scale-105" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        )}

        <div className="flex flex-col text-left">
          <span className="hidden sm:inline font-semibold">
            {isLoggingIn ? 'Conectando...' : 'Entrar com Google'}
          </span>
          <span className="sm:hidden font-semibold">
            {isLoggingIn ? 'Entrando...' : 'Entrar'}
          </span>
        </div>

        <span className="hidden xl:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800">
          <Cloud className="w-2.5 h-2.5" />
          Nuvem
        </span>
      </button>

      {errorMessage && (
        <div className="absolute top-full mt-1.5 right-0 w-56 p-2 bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800 rounded-xl text-[11px] text-rose-700 dark:text-rose-200 shadow-lg z-50 animate-in fade-in">
          {errorMessage}
        </div>
      )}
    </div>
  );
};
