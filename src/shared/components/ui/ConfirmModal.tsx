import React from "react";
import { createPortal } from "react-dom";
import { X, AlertTriangle, Loader2 } from "lucide-react";
import { useLanguage } from "../../../core/context";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: "danger" | "warning" | "success";
  loading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ 
  isOpen, onClose, onConfirm, 
  title, message, confirmLabel, 
  cancelLabel, type = "danger",
  loading = false
}) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  const getColors = () => {
    switch(type) {
      case "danger": return { bg: "bg-red-500", shadow: "shadow-red-500/20", icon: "text-red-500", lightBg: "bg-red-500/10" };
      case "warning": return { bg: "bg-amber-500", shadow: "shadow-amber-500/20", icon: "text-amber-500", lightBg: "bg-amber-500/10" };
      case "success": return { bg: "bg-zoco-lime", shadow: "shadow-zoco-lime/20", icon: "text-zoco-lime", lightBg: "bg-zoco-lime/10" };
      default: return { bg: "bg-zoco-navy", shadow: "shadow-zoco-navy/20", icon: "text-zoco-navy", lightBg: "bg-slate-100" };
    }
  };

  const colors = getColors();

  return createPortal(
    <div className="fixed inset-0 z-999 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white dark:bg-zoco-navy w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200 dark:border-white/5 p-8 text-center">
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
        >
          <X size={18} />
        </button>

        <div className={`w-16 h-16 ${colors.lightBg} ${colors.icon} rounded-3xl flex items-center justify-center mx-auto mb-6`}>
          <AlertTriangle size={32} />
        </div>

        <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight mb-2">
          {title}
        </h3>
        <p className="text-slate-500 dark:text-white/40 text-sm font-medium leading-relaxed mb-8">
          {message}
        </p>

        <div className="flex flex-col gap-3">
          <button 
            onClick={onConfirm}
            disabled={loading}
            className={`w-full py-4 rounded-2xl ${colors.bg} text-white font-black text-xs uppercase tracking-widest ${colors.shadow} hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2`}
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {confirmLabel || t("confirm")}
          </button>
          <button 
            onClick={onClose}
            className="w-full py-4 rounded-2xl bg-slate-50 dark:bg-white/5 text-slate-400 dark:text-white/40 font-black text-xs uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
          >
            {cancelLabel || t("cancel")}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
