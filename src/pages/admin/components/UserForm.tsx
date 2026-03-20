import React from "react";
import { 
  User as UserIcon, Mail, Shield, 
  Key, ChevronDown, Loader2 
} from "lucide-react";
import { useLanguage } from "../../../core/context";
import type { User, Role } from "../../../core/types/user";

interface UserFormProps {
  user: Partial<User> & { password?: string };
  onChange: (updated: Partial<User> & { password?: string }) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  loading: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({ 
  user, onChange, onSubmit, onCancel, loading 
}) => {
  const { t } = useLanguage();

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 dark:text-white/30 ml-2">
            {t("firstName")}
          </label>
          <div className="relative">
            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <input 
              type="text"
              required
              placeholder={t("firstName")}
              value={user.firstName || ""}
              onChange={(e) => onChange({ ...user, firstName: e.target.value })}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/10 dark:text-white focus:outline-none focus:ring-2 focus:ring-zoco-lime/20 focus:border-zoco-lime transition-all font-semibold text-sm"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 dark:text-white/30 ml-2">
            {t("lastName")}
          </label>
          <div className="relative">
            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <input 
              type="text"
              required
              placeholder={t("lastName")}
              value={user.lastName || ""}
              onChange={(e) => onChange({ ...user, lastName: e.target.value })}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/10 dark:text-white focus:outline-none focus:ring-2 focus:ring-zoco-lime/20 focus:border-zoco-lime transition-all font-semibold text-sm"
            />
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 dark:text-white/30 ml-2">
          {t("email")}
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
          <input 
            type="email"
            required
            placeholder="example@techzocos.com"
            value={user.email || ""}
            onChange={(e) => onChange({ ...user, email: e.target.value })}
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/10 dark:text-white focus:outline-none focus:ring-2 focus:ring-zoco-lime/20 focus:border-zoco-lime transition-all font-semibold text-sm"
          />
        </div>
      </div>

      {!user.id && (
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 dark:text-white/30 ml-2">
            {t("password")}
          </label>
          <div className="relative">
            <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <input 
              type="password"
              required
              minLength={6}
              value={user.password || ""}
              onChange={(e) => onChange({ ...user, password: e.target.value })}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/10 dark:text-white focus:outline-none focus:ring-2 focus:ring-zoco-lime/20 focus:border-zoco-lime transition-all font-semibold text-sm"
            />
          </div>
        </div>
      )}

      <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 dark:text-white/30 ml-2">
          {t("role")}
        </label>
        <div className="relative">
          <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
          <select 
            value={user.role || "User"}
            onChange={(e) => onChange({ ...user, role: e.target.value as Role })}
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/10 dark:text-white focus:outline-none focus:ring-2 focus:ring-zoco-lime/20 focus:border-zoco-lime transition-all font-semibold text-sm appearance-none cursor-pointer"
          >
            <option value="User" className="dark:bg-zoco-navy text-slate-800 dark:text-white">
              {t("roleUser")}
            </option>
            <option value="Admin" className="dark:bg-zoco-navy text-slate-800 dark:text-white">
              {t("roleAdmin")}
            </option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button 
          type="button"
          onClick={onCancel}
          className="flex-1 py-3.5 rounded-2xl border border-slate-200 dark:border-white/10 dark:text-white font-black text-xs uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
        >
          {t("cancel")}
        </button>
        <button 
          type="submit"
          disabled={loading}
          className="flex-1 py-3.5 rounded-2xl bg-zoco-lime text-zoco-navy font-black text-xs uppercase tracking-widest hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="animate-spin" size={14} />}
          {t("save")}
        </button>
      </div>
    </form>
  );
};
