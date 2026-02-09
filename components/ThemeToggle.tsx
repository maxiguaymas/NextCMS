'use client';

import { useTheme } from "@/components/ThemeProvider";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Senior pattern: Prevenir desajustes de hidratación (hydration mismatch)
  // El tema se lee de localStorage en el cliente, por lo que el servidor no sabe qué icono renderizar.
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="size-9" />; // Placeholder para evitar saltos visuales
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center size-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-slate-600 dark:text-slate-400 shadow-sm active:scale-95"
      aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
    >
      <span className="material-symbols-outlined text-[20px] transition-transform duration-300">
        {isDark ? 'light_mode' : 'dark_mode'}
      </span>
    </button>
  );
}