import React from "react";
import { ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface QuickActionProps {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  color?: string;
  className?: string;
}

export const QuickAction: React.FC<QuickActionProps> = ({
  label,
  icon: Icon,
  onClick,
  color = "#B8C900",
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`group flex items-center justify-between p-5 rounded-3xl border border-slate-200/50 dark:border-white/5 bg-white dark:bg-white/5 hover:border-zoco-lime dark:hover:border-zoco-lime transition-all active:scale-95 shadow-sm hover:shadow-md grow ${className}`}
    >
      <div className="flex items-center gap-4 text-left">
        <div 
          className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-105"
          style={{ backgroundColor: `${color}15`, color }}
        >
          <Icon size={22} className="group-hover:rotate-6 transition-transform" />
        </div>
        <div>
          <span className="block text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight leading-tight">
            {label}
          </span>
          <span className="text-[10px] font-bold text-slate-400 dark:text-white/30 uppercase tracking-widest">
            Action Item
          </span>
        </div>
      </div>
      
      <ArrowRight 
        size={18} 
        className="text-slate-300 dark:text-white/20 group-hover:text-zoco-lime group-hover:translate-x-1 transition-all" 
      />
    </button>
  );
};
