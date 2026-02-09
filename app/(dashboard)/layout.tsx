'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role || "VIEWER";
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#eff2f5] dark:bg-[#0f1115] text-slate-900 dark:text-white transition-colors duration-300">
      <Sidebar role={role} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-[#f8fafc] dark:bg-[#0f1115]">
        {/* Mobile Header */}
        <div className="md:hidden h-14 border-b border-gray-200 dark:border-[#282d33] flex items-center justify-between px-4 bg-white dark:bg-[#16181c] transition-colors">
          <span className="font-bold">NextCMS</span>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="text-slate-500 p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 md:p-8 lg:px-12 lg:py-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}