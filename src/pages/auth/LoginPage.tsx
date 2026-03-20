import React, { useActionState, useState } from "react";
import { useAuth, useTheme, useLanguage } from "../../core/context";
import {
  Mail, Lock, Eye, EyeOff, Sun, Moon, Languages, Loader2,
  ArrowRight, Shield, Zap, Sparkles,
} from "lucide-react";
import zocoLogo from "../../assets/zoco_servicios_de_pago_logo.jpg";
import { authService } from "../../core/services/auth.service";

// ── Brand feature list ───────────────────────────────────────────────────────
const features = [
  { icon: Shield, labelKey: "featureSecurity" },
  { icon: Zap,    labelKey: "featureSpeed"    },
  { icon: Sparkles, labelKey: "featureExperience" },
];

export const LoginPage: React.FC = () => {
  const { login }            = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe,   setRememberMe  ] = useState(
    () => localStorage.getItem("rememberedEmail") !== null
  );

  const [error, loginAction, isPending] = useActionState(
    async (_prev: string | null, fd: FormData) => {
      const email    = fd.get("email")    as string;
      const password = fd.get("password") as string;
      const remember = fd.get("remember") === "on";

      try {
        const data = await authService.login(email, password);
        login(data.user, data.token, data.expiresAt);

        if (remember) {
          localStorage.setItem("rememberedEmail", email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        window.location.href = "/dashboard";
        return null;
      } catch (err: unknown) {
        // Simple error handling for now as we don't have axios types imported here
        const axiosError = err as { response?: { status: number } };
        if (axiosError.response?.status === 401) {
          return t("errorLogin");
        }
        return t("serverError");
      }
    },
    null
  );

  const initialEmail = localStorage.getItem("rememberedEmail") || "";

  return (
    <div className="min-h-screen w-full flex bg-white dark:bg-zoco-navy transition-colors duration-500 overflow-hidden">

      {/* ────────────────────────────────────────────────────────────────────
          LEFT PANEL – Branding
      ──────────────────────────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-16"
           style={{ background: "#0B2236" }}>

        {/* Improved Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Main glow */}
          <div className="absolute -top-[10%] -left-[10%] w-[80%] h-[80%] rounded-full opacity-20 blur-[120px]"
               style={{ background: "radial-gradient(circle, #B8C900 0%, transparent 70%)" }} />
          
          {/* Accent glow */}
          <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full opacity-10 blur-[100px]"
               style={{ background: "radial-gradient(circle, #1A3D5C 0%, transparent 70%)" }} />

          {/* Masked Dot Grid — To avoid sharp cuts */}
          <div className="absolute inset-0 opacity-15"
               style={{
                 backgroundImage: "radial-gradient(circle, #B8C900 1px, transparent 1px)",
                 backgroundSize:  "32px 32px",
                 maskImage: "radial-gradient(ellipse at center, black 20%, transparent 80%)",
                 WebkitMaskImage: "radial-gradient(ellipse at center, black 20%, transparent 80%)"
               }} />
        </div>

        {/* Logo Section */}
        <div className="relative z-10">
          <div className="flex items-center gap-4">
            <img src={zocoLogo} alt="ZOCO Logo" className="h-10 rounded-lg shadow-2xl border border-white/10" />
            <div className="h-6 w-px bg-white/20" />
            <span className="text-white/40 text-xs font-bold tracking-[0.2em] uppercase">
              Servicios de Pago
            </span>
          </div>
        </div>

        {/* Center copy */}
        <div className="relative z-10 space-y-12 max-w-lg">
          <div>
            <h2 className="text-6xl font-black text-white leading-[1.1] tracking-tight">
              {t("brandingHeadline")}
            </h2>
            <p className="mt-6 text-white/50 text-xl leading-relaxed">
              {t("brandingSubheadline")}
            </p>
          </div>

          {/* Feature list */}
          <div className="flex flex-col gap-6">
            {features.map(({ icon: Icon, labelKey }) => (
              <div key={labelKey} className="group flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 bg-white/5 group-hover:bg-zoco-lime/10 transition-colors">
                  <Icon size={22} style={{ color: "#B8C900" }} />
                </div>
                <span className="text-white/80 font-semibold text-lg">{t(labelKey)}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ────────────────────────────────────────────────────────────────────
          RIGHT PANEL – Form
      ──────────────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col relative">
        <div className="flex items-center justify-between px-10 py-8">
          {/* Mobile logo only */}
          <img src={zocoLogo} alt="ZOCO Logo" className="h-8 lg:invisible" />
          
          <div className="flex gap-3 ml-auto">
            <button
              onClick={() => setLanguage(language === "es" ? "en" : "es")}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold text-slate-600 dark:text-white/60 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-all active:scale-95"
            >
              <Languages size={16} />
              {language === "es" ? "ES" : "EN"}
            </button>
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-2xl text-slate-600 dark:text-white/60 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-all active:scale-95 shadow-sm"
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-8 pb-12">
          <div className="w-full max-w-sm space-y-10 login-card">
            <div>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                {t("loginTitle")}
              </h1>
              <p className="mt-3 text-slate-500 dark:text-white/40 font-medium">
                {t("loginSubtitle")}
              </p>
            </div>


            <form action={loginAction} className="space-y-5">
              <div className="relative group">
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  required
                  defaultValue={initialEmail}
                  placeholder=" "
                  className="peer w-full px-5 pt-7 pb-3 rounded-2xl outline-none transition-all text-slate-900 dark:text-white text-sm bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-zoco-lime dark:focus:border-zoco-lime shadow-inner"
                />
                <label
                  htmlFor="login-email"
                  className="absolute left-5 top-5 text-slate-400 dark:text-white/30 text-sm pointer-events-none transition-all duration-300
                    peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm
                    peer-focus:top-2.5 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-wider peer-focus:font-black peer-focus:text-zoco-lime
                    peer-not-placeholder-shown:top-2.5 peer-not-placeholder-shown:text-[10px] peer-not-placeholder-shown:uppercase peer-not-placeholder-shown:tracking-wider peer-not-placeholder-shown:font-black"
                >
                  {t("email")}
                </label>
                <Mail className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 dark:text-white/20 group-focus-within:text-zoco-lime transition-all" size={18} />
              </div>

              <div className="relative group">
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder=" "
                  className="peer w-full px-5 pt-7 pb-3 pr-24 rounded-2xl outline-none transition-all text-slate-900 dark:text-white text-sm bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-zoco-lime dark:focus:border-zoco-lime shadow-inner"
                />
                <label
                  htmlFor="login-password"
                  className="absolute left-5 top-5 text-slate-400 dark:text-white/30 text-sm pointer-events-none transition-all duration-300
                    peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm
                    peer-focus:top-2.5 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-wider peer-focus:font-black peer-focus:text-zoco-lime
                    peer-not-placeholder-shown:top-2.5 peer-not-placeholder-shown:text-[10px] peer-not-placeholder-shown:uppercase peer-not-placeholder-shown:tracking-wider peer-not-placeholder-shown:font-black"
                >
                  {t("password")}
                </label>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <Lock className="text-slate-300 dark:text-white/20 group-focus-within:text-zoco-lime transition-all" size={16} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="p-1.5 text-slate-400 dark:text-white/30 hover:text-zoco-lime transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative shrink-0">
                    <input
                      name="remember"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-6 rounded-full bg-slate-200 dark:bg-white/10 peer-checked:bg-zoco-lime transition-all duration-300" />
                    <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-md transition-all duration-300 peer-checked:translate-x-4 peer-checked:scale-90" />
                  </div>
                  <span className="text-xs font-bold text-slate-400 dark:text-white/40 group-hover:text-slate-600 dark:group-hover:text-white/60 transition-colors uppercase tracking-wider">
                    {t("rememberMe")}
                  </span>
                </label>
                <a
                  href="#"
                  className="text-xs font-black text-zoco-lime hover:text-zoco-lime-lt transition-all uppercase tracking-tighter"
                >
                  {t("forgotPassword")}
                </a>
              </div>

              {error && (
                <div className="flex items-center gap-3 p-4 rounded-2xl text-xs font-bold bg-red-500/10 border border-red-500/20 text-red-500 animate-shake">
                  <Shield size={16} className="shrink-0" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="group relative w-full py-4.5 rounded-2xl font-black text-lg transition-all duration-500 active:scale-[0.98] overflow-hidden disabled:opacity-50"
                style={{ background: "#B8C900", color: "#0B2236" }}
              >
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/20 transition-colors" />
                <div className="relative flex items-center justify-center gap-3">
                  {isPending ? (
                    <>
                      <Loader2 className="animate-spin" size={22} />
                      {t("loggingIn")}
                    </>
                  ) : (
                    <>
                      {t("loginButton")}
                      <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                    </>
                  )}
                </div>
              </button>
            </form>

            <p className="text-center text-xs font-bold text-slate-400 dark:text-white/30 uppercase tracking-widest">
              {t("noAccount")}{" "}
              <a
                href="#"
                className="text-zoco-lime hover:text-zoco-lime-lt transition-colors underline decoration-2 underline-offset-4"
              >
                {t("register")}
              </a>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .login-card {
          animation: slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%      { transform: translateX(-6px); }
          40%      { transform: translateX(6px); }
          60%      { transform: translateX(-4px); }
          80%      { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
};
