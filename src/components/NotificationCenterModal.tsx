import React from 'react';
import {
  Bell,
  X,
  CheckCheck,
  Trash2,
  TrendingUp,
  ArrowUpDown,
  Calendar,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { AppNotification, Language } from '../types';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  language: Language;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onClearAll,
  language = 'en',
}) => {
  const isId = language === 'id';
  if (!isOpen) return null;

  return (
    <div className="absolute top-12 right-0 sm:right-4 w-80 sm:w-96 bg-[#121620] border border-[#232b3c] rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[480px] animate-in fade-in slide-in-from-top-2">
      {/* Top Header */}
      <div className="p-3.5 border-b border-[#1c2332] bg-[#161c2a] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            {isId ? 'Pusat Notifikasi' : 'Notification Center'}
          </h3>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-mono">
            {notifications.filter((n) => !n.read).length} new
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onMarkAllAsRead}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-[#20293d] transition-colors cursor-pointer"
            title={isId ? 'Tandai sudah dibaca' : 'Mark all as read'}
          >
            <CheckCheck className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClearAll}
            className="p-1 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-[#20293d] transition-colors cursor-pointer"
            title={isId ? 'Bersihkan semua' : 'Clear all'}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-[#20293d] transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="p-2 overflow-y-auto flex-1 divide-y divide-[#18202e] text-xs">
        {notifications.length === 0 ? (
          <div className="py-12 text-center text-neutral-500">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-30 text-amber-400" />
            <p>{isId ? 'Tidak ada notifikasi baru.' : 'No new notifications.'}</p>
          </div>
        ) : (
          notifications.map((item) => {
            const isAlert = item.type === 'ALERT';
            const isOrder = item.type === 'ORDER';
            return (
              <div
                key={item.id}
                className={`p-2.5 rounded-xl transition-colors flex items-start gap-2.5 ${
                  item.read ? 'bg-transparent text-neutral-400' : 'bg-[#182030]/60 text-white'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center mt-0.5 ${
                    isAlert
                      ? 'bg-amber-500/20 text-amber-400'
                      : isOrder
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-cyan-500/20 text-cyan-400'
                  }`}
                >
                  {isAlert ? (
                    <Bell className="w-3.5 h-3.5" />
                  ) : isOrder ? (
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  ) : (
                    <Calendar className="w-3.5 h-3.5" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{item.title}</span>
                    <span className="text-[10px] text-neutral-500 font-mono">{item.time}</span>
                  </div>
                  <p className="text-[11px] text-neutral-300 mt-0.5 leading-snug">{item.message}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
