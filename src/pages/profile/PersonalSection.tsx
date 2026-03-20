import React, { useState } from "react";
import { User, Mail, Save, Loader2 } from "lucide-react";
import { useAuth, useLanguage } from "../../core/context";
import { userService } from "../../core/services/user.service";
import { toast } from "sonner";

export const PersonalSection: React.FC = () => {
  const { user, login } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const updatedUser = await userService.updateUser(user.id, formData);
      // Update context state (User first, then token, then expiresAt)
      login(updatedUser, sessionStorage.getItem("token") || "", sessionStorage.getItem("expiresAt") || "");
      toast.success(t("successUpdate"));
    } catch (err) {
      console.error(err);
      toast.error("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-white/5 rounded-[2.5rem] border border-slate-200 dark:border-white/5 p-8 shadow-sm">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-zoco-lime/10 flex items-center justify-center text-zoco-lime">
          <User size={24} />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
            {t("personalData")}
          </h3>
          <p className="text-xs font-bold text-slate-400 dark:text-white/20 uppercase tracking-widest">
            {user?.role === "Admin" ? t("roleAdmin") : t("roleUser")} {t("account")}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-white/30 ml-4">
              {t("name")}
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 dark:text-white focus:outline-none focus:ring-2 focus:ring-zoco-lime/20 focus:border-zoco-lime transition-all font-semibold"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-white/30 ml-4">
              {t("lastName")}
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 dark:text-white focus:outline-none focus:ring-2 focus:ring-zoco-lime/20 focus:border-zoco-lime transition-all font-semibold"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-white/30 ml-4">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="email"
              value={formData.email}
              disabled
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-white/20 font-semibold cursor-not-allowed"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-zoco-lime text-zoco-navy font-black text-sm shadow-lg shadow-zoco-lime/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {t("save")}
          </button>
        </div>
      </form>
    </div>
  );
};
