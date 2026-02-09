'use client';

import { useState } from "react";
import Link from "next/link";
import { Session } from "next-auth";

export default function MobileMenu({ session }: { session: Session | null }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden flex items-center">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-slate-600 dark:text-slate-300 p-2"
        aria-label="Menu de navegación"
      >
        <span className="material-symbols-outlined text-3xl">
          {isOpen ? 'close' : 'menu'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white dark:bg-[#0f1b23] border-b border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-6 shadow-2xl animate-in fade-in slide-in-from-top-5 duration-300 z-50">
          <nav className="flex flex-col gap-4">
            <Link onClick={() => setIsOpen(false)} href="/posts" className="text-lg font-semibold text-slate-600 dark:text-slate-300">
              Publicaciones
            </Link>
            <Link onClick={() => setIsOpen(false)} href="/about" className="text-lg font-semibold text-slate-600 dark:text-slate-300">
              Nosotros
            </Link>
            <Link onClick={() => setIsOpen(false)} href="/contact" className="text-lg font-semibold text-slate-600 dark:text-slate-300">
              Contacto
            </Link>
          </nav>
          
          <div className="h-px bg-slate-100 dark:bg-slate-800 w-full"></div>
          
          <div className="flex flex-col gap-3">
            {session ? (
              <Link 
                onClick={() => setIsOpen(false)} 
                href="/dashboard" 
                className="bg-[#068ce5] text-white text-center py-3 rounded-xl font-bold shadow-lg shadow-[#068ce5]/20"
              >
                Ir al Panel
              </Link>
            ) : (
              <>
                <Link onClick={() => setIsOpen(false)} href="/login" className="text-center py-3 font-bold text-[#068ce5]">
                  Iniciar sesión
                </Link>
                <Link onClick={() => setIsOpen(false)} href="/dashboard" className="bg-[#068ce5] text-white text-center py-3 rounded-xl font-bold">
                  Empezar
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}