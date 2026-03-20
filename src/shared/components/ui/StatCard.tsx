import React from "react";
import type { LucideIcon } from "lucide-react";
import { useLanguage } from "../../../core/context";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  color = "#B8C900",
}) => {
  const { t } = useLanguage();

  return (
    <div className="bg-white dark:bg-white/5 p-6 rounded-3xl border border-slate-200/50 dark:border-white/5 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-sm font-bold text-slate-400 dark:text-white/30 uppercase tracking-widest mb-1">
            {title}
          </p>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white">
            {value}
          </h3>
        </div>
        <div 
          className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3"
          style={{ backgroundColor: `${color}15`, color }}
        >
          <Icon size={24} />
        </div>
      </div>

      {trend && (
        <div className="mt-4 flex items-center gap-2 relative z-10">
          <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
            trend.isPositive 
              ? "bg-green-500/10 text-green-500" 
              : "bg-red-500/10 text-red-500"
          }`}>
            {trend.isPositive ? "+" : "-"}{trend.value}%
          </span>
          <span className="text-[10px] font-bold text-slate-400 dark:text-white/20 uppercase tracking-tighter">
            {t("vsLastMonth")}
          </span>
        </div>
      )}

      {/* Decorative aura */}
      <div 
        className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity"
        style={{ backgroundColor: color }}
      />
    </div>
  );
};
