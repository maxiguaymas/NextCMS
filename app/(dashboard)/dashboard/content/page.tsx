'use client';

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { getPosts, deletePost } from "./actions";

export default function ContentListPage() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role || "VIEWER";
  
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    const result = await getPosts(search, statusFilter);
    if (result.success) {
      setPosts(result.data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPosts();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, statusFilter]);

  const statusMap: Record<string, { label: string, color: string }> = {
    'PUBLISHED': { label: 'Publicado', color: 'emerald' },
    'DRAFT': { label: 'Borrador', color: 'slate' },
    'ARCHIVED': { label: 'Archivado', color: 'amber' },
  };

  const activePost = posts.find(p => p.id === activeMenu);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Contenido</h1>
          <p className="text-slate-500 dark:text-[#8F9BA8] text-sm">Gestiona tus artículos y publicaciones.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Buscador */}
          <div className="relative min-w-[240px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-slate-400 text-[20px]">search</span>
            </div>
            <input 
              className="block w-full pl-10 pr-4 py-2 bg-white dark:bg-[#16181c] border border-gray-200 dark:border-[#282d33] rounded-lg text-sm placeholder-slate-400 text-slate-900 dark:text-white focus:outline-none focus:border-[#028ce8] focus:ring-1 focus:ring-[#028ce8] transition-all shadow-sm" 
              placeholder="Buscar por título o slug..." 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Botón de Filtro */}
          <div className="relative">
            <button 
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className={`flex items-center justify-center gap-2 h-9 px-3 rounded-lg border transition-all text-xs font-medium shadow-sm ${
                statusFilter !== 'ALL' 
                ? 'border-[#028ce8] bg-[#028ce8]/5 text-[#028ce8]' 
                : 'border-gray-200 dark:border-[#282d33] bg-white dark:bg-[#16181c] text-slate-600 dark:text-[#8F9BA8] hover:text-[#028ce8]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">filter_list</span>
              <span>{statusFilter === 'ALL' ? 'Filtrar' : statusMap[statusFilter]?.label}</span>
            </button>

            {showFilterMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowFilterMenu(false)}></div>
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-[#16181c] border border-gray-200 dark:border-[#282d33] rounded-xl shadow-xl z-50 py-1 animate-in fade-in zoom-in-95 duration-100">
                  <button 
                    onClick={() => { setStatusFilter('ALL'); setShowFilterMenu(false); }}
                    className={`w-full text-left px-4 py-2 text-xs hover:bg-gray-50 dark:hover:bg-white/5 ${statusFilter === 'ALL' ? 'text-[#028ce8] font-bold' : 'text-slate-600 dark:text-slate-300'}`}
                  >Todos</button>
                  {Object.entries(statusMap).map(([key, info]) => (
                    <button 
                      key={key}
                      onClick={() => { setStatusFilter(key); setShowFilterMenu(false); }}
                      className={`w-full text-left px-4 py-2 text-xs hover:bg-gray-50 dark:hover:bg-white/5 ${statusFilter === key ? 'text-[#028ce8] font-bold' : 'text-slate-600 dark:text-slate-300'}`}
                    >
                      {info.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <Link href="/dashboard/content/new" className="flex items-center justify-center gap-2 h-9 px-4 rounded-lg bg-[#028ce8] text-white text-xs font-bold shadow-lg shadow-[#028ce8]/20">
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Nueva Publicación</span>
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-[#16181c] border border-gray-200 dark:border-[#282d33] rounded-2xl overflow-x-auto shadow-sm">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-100 dark:border-[#282d33] bg-gray-50/50 dark:bg-white/[0.02]">
              <th className="py-3 px-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Título</th>
              <th className="py-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Autor</th>
              <th className="py-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estado</th>
              <th className="py-3 px-5 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-[#282d33]">
            {loading ? (
              <tr><td colSpan={4} className="py-10 text-center text-slate-400 text-xs">Cargando...</td></tr>
            ) : posts.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <span className="material-symbols-outlined text-4xl text-slate-300">article</span>
                    <p className="text-slate-500 text-sm">No hay publicaciones creadas todavía.</p>
                    <Link href="/dashboard/content/new" className="text-[#028ce8] text-xs font-bold hover:underline mt-2">
                      Crear la primera publicación
                    </Link>
                  </div>
                </td>
              </tr>
            ) : posts.map((post) => (
              <tr key={post.id} className="group hover:bg-gray-50 dark:hover:bg-white/[0.01]">
                <td className="py-4 px-5">
                  <div className="flex flex-col">
                    <span className="text-slate-900 dark:text-white font-semibold text-sm">{post.title}</span>
                    <span className="text-slate-400 text-xs">/posts/{post.slug}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <div className="size-6 rounded-full bg-[#028ce8]/10 text-[#028ce8] text-[10px] font-bold flex items-center justify-center border border-[#028ce8]/20">
                      {post.author?.name?.split(' ').map((n: any) => n[0]).join('') || '??'}
                    </div>
                    <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">{post.author?.name || 'Anónimo'}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border shadow-sm
                    ${statusMap[post.status]?.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 
                      statusMap[post.status]?.color === 'amber' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 
                      'bg-slate-500/10 text-slate-600 border-slate-500/20'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      statusMap[post.status]?.color === 'emerald' ? 'bg-emerald-500' : 
                      statusMap[post.status]?.color === 'amber' ? 'bg-amber-500' : 'bg-slate-500'}`}></span>
                    {statusMap[post.status]?.label}
                  </span>
                </td>
                <td className="py-4 px-5 text-right relative">
                  <div className="flex justify-end">
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const rect = e.currentTarget.getBoundingClientRect();
                        setMenuPosition({ top: rect.bottom, left: rect.right });
                        setActiveMenu(activeMenu === post.id ? null : post.id);
                      }}
                      className="text-slate-400 hover:text-[#028ce8] p-1 rounded hover:bg-[#028ce8]/5 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Menú de Acciones Flotante */}
      {activeMenu && menuPosition && activePost && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setActiveMenu(null)}></div>
          <div 
            className="fixed z-50 w-48 bg-white dark:bg-[#16181c] border border-gray-200 dark:border-[#282d33] rounded-xl shadow-2xl py-1 animate-in fade-in zoom-in-95 duration-100"
            style={{ 
              top: menuPosition.top + 8, 
              left: menuPosition.left - 192 
            }}
          >
            <Link 
              href={`/dashboard/content/${activePost.id}`}
              className="flex items-center gap-2 w-full px-3 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">visibility</span>
              Ver detalle
            </Link>
            
            {(role === "ADMIN" || role === "EDITOR") && (
              <Link 
                href={`/dashboard/content/${activePost.id}/edit`}
                className="flex items-center gap-2 w-full px-3 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">edit</span>
                Editar
              </Link>
            )}
          </div>
        </>
      )}
    </div>
  );
}
