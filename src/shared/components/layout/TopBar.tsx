import React from "react";
import { Menu, Sun, Moon, LogOut, ChevronDown, Languages } from "lucide-react";
import { useAuth, useTheme, useLanguage } from "../../../core/context";

interface TopBarProps {
  onMenuOpen: () => void;
  title: string;
}

const TopBar: React.FC<TopBarProps> = ({ onMenuOpen, title }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const initials = user
    ? `${(user.firstName?.[0] || "?")}${(user.lastName?.[0] || "?")}`.toUpperCase()
    : "??";

  const fullName = user ? `${user.firstName} ${user.lastName}` : "";

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between
      px-5 md:px-8 h-16 shrink-0
      bg-white/80 dark:bg-zoco-navy/80 backdrop-blur-xl
      border-b border-slate-200/50 dark:border-white/5">

      {/* Left: Hamburger + Page title */}
      <div className="flex items-center gap-4">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuOpen}
          className="lg:hidden p-2 rounded-xl text-slate-500 dark:text-white/50
            hover:bg-slate-100 dark:hover:bg-white/10 transition-all active:scale-95"
          aria-label="Abrir menú"
        >
          <Menu size={20} />
        </button>

        <h1 className="text-base font-black text-slate-800 dark:text-white tracking-tight">
          {title}
        </h1>
      </div>

      {/* Right: Lang + Theme toggle + User info + Logout */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Language Toggle */}
        <button
          onClick={() => setLanguage(language === "es" ? "en" : "es")}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold
            text-slate-500 dark:text-white/50 bg-slate-100 dark:bg-white/5
            hover:bg-slate-200 dark:hover:bg-white/10 transition-all active:scale-95"
        >
          <Languages size={14} />
          {language.toUpperCase()}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 dark:text-white/50
            hover:bg-slate-100 dark:hover:bg-white/10 transition-all active:scale-95"
          aria-label="Cambiar tema"
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* User info — desktop enhanced */}
        <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-slate-200 dark:border-white/10">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-black text-xs"
               style={{ background: "#B8C900", color: "#0B2236" }}>
            {initials}
          </div>
          <div className="hidden md:flex flex-col leading-tight">
            <span className="text-xs font-black text-slate-800 dark:text-white truncate max-w-[120px]">
              {fullName}
            </span>
            <span className="text-[10px] font-bold text-slate-400 dark:text-white/30 uppercase tracking-wider">
              {user?.role === "Admin" ? t("roleAdmin") : t("roleUser")}
            </span>
          </div>
          <ChevronDown size={14} className="text-slate-300 dark:text-white/20 hidden md:block" />
        </div>

        {/* Mobile avatar */}
        <div className="sm:hidden w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs"
             style={{ background: "#B8C900", color: "#0B2236" }}>
          {initials}
        </div>

        {/* Logout button */}
        <button
          onClick={logout}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold
            text-red-500 hover:bg-red-500/10 transition-all active:scale-95"
          aria-label={t("logout")}
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">{t("logoutShort")}</span>
        </button>
      </div>
    </header>
  );
};

export default TopBar;
