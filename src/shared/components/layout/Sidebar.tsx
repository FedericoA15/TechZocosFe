import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Users, User, FileText, MapPin, X,
} from "lucide-react";
import { useAuth, useLanguage } from "../../../core/context";
import zocoLogo from "../../../assets/zoco_servicios_de_pago_logo.jpg";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

interface NavItem {
  to: string;
  icon: React.ElementType;
  labelKey: string;
  adminOnly?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const isAdmin = user?.role === "Admin";

  const navItems: NavItem[] = [
    { to: "/dashboard",        icon: LayoutDashboard, labelKey: "navDashboard" },
    { to: "/profile",          icon: User,            labelKey: "navProfile" },
    { to: "/studies",          icon: FileText,        labelKey: "navStudies" },
    { to: "/addresses",        icon: MapPin,          labelKey: "navAddresses" },
    // 🚨 Admin Only
    { to: "/admin/users",      icon: Users,           labelKey: "navUsers",           adminOnly: true },
  ];

  const filteredItems = navItems.filter(item => !item.adminOnly || isAdmin);

  const content = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <img src={zocoLogo} alt="ZOCO" className="h-7 rounded-md" />
          <span className="text-white/30 text-[10px] font-bold tracking-[0.18em] uppercase">
            {t("panel")}
          </span>
        </div>
        {/* Close button — mobile only */}
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all"
        >
          <X size={18} />
        </button>
      </div>

      {/* Role badge */}
      <div className="px-6 pt-5 pb-3">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
            ${isAdmin
              ? "bg-zoco-lime/15 text-zoco-lime"
              : "bg-white/5 text-white/40"
            }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {isAdmin ? t("roleAdmin") : t("roleUser")}
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {filteredItems.map(({ to, icon: Icon, labelKey }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }: { isActive: boolean }) =>
              `group flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200
              ${isActive
                ? "bg-zoco-lime text-zoco-navy shadow-lg shadow-zoco-lime/20"
                : "text-white/50 hover:text-white hover:bg-white/5"
              }`
            }
          >
            {({ isActive }: { isActive: boolean }) => (
              <>
                <Icon
                  size={18}
                  className={`shrink-0 transition-transform duration-200 ${isActive ? "" : "group-hover:scale-110"}`}
                />
                <span>{t(labelKey)}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom version tag */}
      <div className="px-6 py-4 border-t border-white/5">
        <p className="text-white/20 text-[10px] font-bold tracking-widest uppercase">
          TechZocos v1.0
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop Sidebar ─────────────────────────── */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0 h-screen sticky top-0"
             style={{ background: "#0B2236" }}>
        {content}
      </aside>

      {/* ── Mobile Drawer ───────────────────────────── */}
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden
          ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />
      {/* Drawer panel */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 z-50 flex flex-col lg:hidden
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}`}
        style={{ background: "#0B2236" }}
      >
        {content}
      </aside>
    </>
  );
};

export default Sidebar;
