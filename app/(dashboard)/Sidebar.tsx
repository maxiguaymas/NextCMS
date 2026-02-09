'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { getUnreadMessagesCount } from "./dashboard/messages/actions";

type Role = "ADMIN" | "EDITOR" | "VIEWER";

interface NavItem {
  label: string;
  href: string;
  icon: string;
  roles: Role[];
  badge?: string;
}

const navItems: NavItem[] = [
  { label: "Panel", href: "/dashboard", icon: "dashboard", roles: ["ADMIN", "EDITOR", "VIEWER"] },
  { label: "Contenido", href: "/dashboard/content", icon: "article", roles: ["ADMIN", "EDITOR", "VIEWER"] },
  { label: "Usuarios", href: "/dashboard/users", icon: "group", roles: ["ADMIN"] },
  { label: "Mensajes", href: "/dashboard/messages", icon: "mail", roles: ["ADMIN"] },
];

interface SidebarProps {
  role: Role;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ role, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [unreadCount, setUnreadCount] = useState(0);
  const isDark = theme === 'dark';

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Cerrar sidebar al cambiar de ruta en móvil
  useEffect(() => {
    onClose();
  }, [pathname]);

  // Cargar contador de mensajes sin leer
  useEffect(() => {
    if (role === "ADMIN") {
      getUnreadMessagesCount().then(setUnreadCount);
    }
  }, [role, pathname]);

  return (
    <>
      {/* Backdrop para móvil */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-300"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 flex flex-col border-r border-gray-200 dark:border-[#282d33] bg-white dark:bg-[#16181c] h-full justify-between transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
      <div>
        <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-[#282d33]/50 justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#028ce8] flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-[#028ce8]/20">N</div>
            <span className="font-bold text-lg tracking-tight">NextCMS</span>
          </div>
          <button 
            onClick={onClose}
            className="md:hidden text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-3 mt-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-500 dark:text-[#8F9BA8] hover:text-[#028ce8] hover:bg-[#028ce8]/5 transition-all group"
          >
            <span className="material-symbols-outlined text-[20px]">public</span>
            <span className="text-sm font-medium">Ver Sitio Público</span>
            <span className="material-symbols-outlined text-[14px] ml-auto opacity-0 group-hover:opacity-100 transition-opacity">open_in_new</span>
          </Link>

          <div className="my-1 border-t border-gray-100 dark:border-[#282d33]/50 mx-3"></div>

        {navItems
          .filter((item) => item.roles.includes(role))
          .map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all group ${
                  isActive
                    ? "bg-[#028ce8]/10 text-[#028ce8] border border-[#028ce8]/20" 
                    : "text-slate-500 dark:text-[#8F9BA8] hover:text-[#028ce8] hover:bg-[#028ce8]/5"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
                {item.label === "Mensajes" && unreadCount > 0 && (
                  <span className="ml-auto flex items-center justify-center size-5 bg-red-500 text-white text-[10px] font-bold rounded-full shadow-sm animate-in zoom-in duration-300">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Botón de acción rápida: Solo para ADMIN y EDITOR */}
          {(role === "ADMIN" || role === "EDITOR") && (
            <div className="px-1 mt-2">
              <Link 
                href="/dashboard/content/new"
                className="flex items-center justify-center gap-2 w-full py-2 bg-[#028ce8] text-white text-sm font-bold rounded-xl hover:bg-[#028ce8]/90 transition-all shadow-md shadow-[#028ce8]/20"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                Nuevo Post
              </Link>
            </div>
          )}

          <div className="my-2 border-t border-gray-100 dark:border-[#282d33]/50 mx-3"></div>
          <Link href="/dashboard/settings" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-slate-500 dark:text-[#8F9BA8] hover:text-[#028ce8] hover:bg-[#028ce8]/5 transition-all ${pathname === '/dashboard/settings' ? 'text-[#028ce8] bg-[#028ce8]/5' : ''}`}>
            <span className="material-symbols-outlined text-[20px]">settings</span>
            <span className="text-sm font-medium">Configuración</span>
          </Link>
        </nav>
      </div>

      <div className="flex flex-col">
        <div className="px-3 pb-3">
          <button 
            onClick={toggleTheme}
            className="flex items-center justify-between w-full p-2 rounded-lg border border-gray-200 dark:border-[#282d33] bg-gray-50 dark:bg-[#0f1115]/50 hover:border-[#028ce8]/50 transition-all group"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-slate-400 group-hover:text-[#028ce8] text-[18px]">
                {isDark ? 'light_mode' : 'dark_mode'}
              </span>
              <span className="text-sm text-slate-500 group-hover:text-[#028ce8]">
                {isDark ? 'Modo Claro' : 'Modo Oscuro'}
              </span>
            </div>
            <div className={`w-8 h-4 rounded-full relative transition-colors ${isDark ? 'bg-[#028ce8]' : 'bg-slate-300'}`}>
              <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${isDark ? 'right-1' : 'left-1'}`}></div>
            </div>
          </button>
        </div>
        <div className="p-4 border-t border-gray-100 dark:border-[#282d33]/50">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors group">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 border border-gray-200 dark:border-[#282d33] overflow-hidden flex items-center justify-center text-[#028ce8] text-xs font-bold">
              {user?.image ? (
                <img src={user.image} alt={user.name || "Avatar"} className="w-full h-full object-cover" />
              ) : (
                getInitials(user?.name)
              )}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium truncate">{user?.name || "Usuario"}</span>
              <span className="text-[10px] text-slate-500 dark:text-[#8F9BA8] uppercase font-bold tracking-wider">{role}</span>
            </div>
            <button 
              onClick={() => setShowLogoutModal(true)}
              className="material-symbols-outlined ml-auto text-slate-400 hover:text-red-500 text-[18px] transition-colors"
            >
              logout
            </button>
          </div>
        </div>
      </div>
    </aside>

    {/* Modal de Confirmación de Cierre de Sesión - Movido fuera del aside para evitar problemas de posicionamiento */}
    {showLogoutModal && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white dark:bg-[#16181c] border border-gray-200 dark:border-[#282d33] rounded-2xl p-6 max-w-sm w-full shadow-2xl scale-in-center animate-in zoom-in-95 duration-200">
          <div className="flex items-center gap-3 mb-4 text-amber-500">
            <span className="material-symbols-outlined text-3xl">logout</span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">¿Cerrar sesión?</h3>
          </div>
          <p className="text-slate-500 dark:text-[#8F9BA8] mb-6">
            ¿Estás seguro de que deseas salir? Tendrás que volver a introducir tus credenciales para acceder de nuevo.
          </p>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowLogoutModal(false)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#282d33] text-slate-600 dark:text-white font-semibold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold shadow-lg shadow-red-500/20 transition-all active:scale-95"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}