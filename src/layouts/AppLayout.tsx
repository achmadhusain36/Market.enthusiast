import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Topbar } from '../components/layout/Topbar';
import { ToastContainer } from '../components/ui/Toast';

export const AppLayout: React.FC = () => {
  return (
    <div className="h-screen w-screen bg-[#0a0a0a] text-[#fafafa] flex overflow-hidden font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar />

      {/* 2. Main Workstation Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header Bar */}
        <Topbar />

        {/* Scrollable Page Outlet */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0a0a0a]">
          <div className="max-w-7xl mx-auto w-full pb-12">
            <Outlet />
          </div>
        </main>
      </div>

      {/* 3. Global Toast Notifications */}
      <ToastContainer />
    </div>
  );
};
