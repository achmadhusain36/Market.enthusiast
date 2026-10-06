import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

let toastListeners: ((items: ToastItem[]) => void)[] = [];
let currentToasts: ToastItem[] = [];

export function showToast(toast: Omit<ToastItem, 'id'>) {
  const newToast: ToastItem = { ...toast, id: `toast-${Date.now()}` };
  currentToasts = [...currentToasts, newToast];
  toastListeners.forEach((fn) => fn(currentToasts));

  setTimeout(() => {
    currentToasts = currentToasts.filter((t) => t.id !== newToast.id);
    toastListeners.forEach((fn) => fn(currentToasts));
  }, 4000);
}

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    toastListeners.push(setToasts);
    return () => {
      toastListeners = toastListeners.filter((fn) => fn !== setToasts);
    };
  }, []);

  const dismiss = (id: string) => {
    currentToasts = currentToasts.filter((t) => t.id !== id);
    toastListeners.forEach((fn) => fn(currentToasts));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto p-4 rounded-2xl border shadow-2xl flex items-start gap-3 backdrop-blur-xl animate-in slide-in-from-bottom-2 ${
            t.type === 'success'
              ? 'bg-[#0f1f17]/95 border-emerald-500/40 text-white'
              : t.type === 'error'
              ? 'bg-[#220d0f]/95 border-red-500/40 text-white'
              : 'bg-[#141a24]/95 border-cyan-500/40 text-white'
          }`}
        >
          {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
          {t.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />}
          {t.type === 'info' && <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />}

          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold font-mono">{t.title}</h4>
            {t.message && <p className="text-[11px] text-neutral-300 mt-0.5">{t.message}</p>}
          </div>

          <button
            onClick={() => dismiss(t.id)}
            className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
