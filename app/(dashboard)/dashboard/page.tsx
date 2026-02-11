import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role || "VIEWER";

  // Consultas dinámicas a la base de datos
  const [totalUsers, activeUsers, publishedPosts, draftPosts, recentPosts, recentUsers] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { active: true } }),
    prisma.post.count({ where: { status: 'PUBLISHED' } }),
    prisma.post.count({ where: { status: 'DRAFT' } }),
    prisma.post.findMany({ take: 3, orderBy: { updatedAt: 'desc' }, include: { author: { select: { name: true } } } }),
    prisma.user.findMany({ take: 3, orderBy: { id: 'desc' } }),
  ]);

  const stats = [
    { label: "Usuarios Totales", value: totalUsers.toString(), icon: "group", color: "text-blue-500" },
    { label: "Usuarios Activos", value: activeUsers.toString(), icon: "person_check", color: "text-emerald-500" },
    { label: "Contenido Publicado", value: publishedPosts.toString(), icon: "article", color: "text-[#028ce8]" },
    { label: "Borradores / Pendientes", value: draftPosts.toString(), icon: "edit_note", color: "text-amber-500" },
  ];

  // Construcción de actividad reciente basada en datos reales
  const recentActivity = [
    ...recentPosts.map(post => ({
      id: `post-${post.id}`,
      user: post.author?.name || "Un editor",
      action: post.status === 'PUBLISHED' ? "publicó" : "actualizó el borrador",
      target: post.title,
      time: "Reciente",
      icon: post.status === 'PUBLISHED' ? "article" : "edit_note",
      iconColor: post.status === 'PUBLISHED' ? "text-[#028ce8]" : "text-amber-500",
      href: `/dashboard/content/${post.id}`
    })),
    ...recentUsers.map(user => ({
      id: `user-${user.id}`,
      user: "Sistema",
      action: "registró a",
      target: user.name,
      time: "Nuevo ingreso",
      icon: "person_add",
      iconColor: "text-purple-500",
      href: "/dashboard/users"
    }))
  ].slice(0, 6);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Panel General</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 uppercase tracking-wide">Producción</span>
          </div>
          <p className="text-slate-500 dark:text-[#8F9BA8] text-sm">Resumen operativo del sistema y gestión de contenidos.</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-[#16181c] border border-gray-200 dark:border-[#282d33] text-slate-600 dark:text-white text-sm font-semibold rounded-xl hover:border-[#028ce8]/50 transition-all shadow-sm">
          <span className="material-symbols-outlined text-[20px]">refresh</span>
          Actualizar Estado
        </button>
      </div>

      {/* Cards Principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-[#16181c] border border-gray-200 dark:border-[#282d33] rounded-2xl p-6 shadow-sm group hover:border-[#028ce8]/30 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl bg-slate-50 dark:bg-[#0f1115] flex items-center justify-center border border-gray-100 dark:border-[#282d33] ${stat.color}`}>
                <span className="material-symbols-outlined text-[28px]">{stat.icon}</span>
              </div>
            </div>
            <p className="text-slate-500 dark:text-[#8F9BA8] text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Sección Central */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Actividad Reciente */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-slate-900 dark:text-white font-bold text-lg tracking-tight">Actividad Reciente</h3>
          </div>
          <div className="bg-white dark:bg-[#16181c]/50 border border-gray-200 dark:border-[#282d33] rounded-2xl overflow-hidden shadow-sm">
            <div className="divide-y divide-gray-100 dark:divide-[#282d33]/50">
              {recentActivity.map((item) => (
                <Link key={item.id} href={item.href} className="block">
                  <div className="p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group">
                    <div className={`w-10 h-10 rounded-xl bg-slate-100 dark:bg-[#0f1115] flex items-center justify-center border border-gray-200 dark:border-[#282d33] ${item.iconColor}`}>
                      <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-900 dark:text-white font-medium">
                        <span className="font-bold">{item.user}</span> {item.action} <span className="text-[#028ce8] font-semibold">{item.target}</span>
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{item.time}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        {/* Acciones Rápidas */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <h3 className="text-slate-900 dark:text-white font-bold text-lg tracking-tight">Acciones Rápidas</h3>
          <div className="bg-white dark:bg-[#16181c] border border-gray-200 dark:border-[#282d33] rounded-2xl p-5 shadow-sm space-y-3">
            
            {/* Acciones para ADMIN */}
            {role === "ADMIN" && (
              <>
                <button className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 dark:border-[#282d33] hover:bg-gray-50 dark:hover:bg-white/5 transition-all text-left group">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">person_add</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Invitar Miembro</span>
                </button>
                <Link href="/dashboard/users" className="block">
                  <button className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 dark:border-[#282d33] hover:bg-gray-50 dark:hover:bg-white/5 transition-all text-left group">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">group</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Gestionar Usuarios</span>
                  </button>
                </Link>
              </>
            )}

            {/* Acciones para EDITOR */}
            {(role === "ADMIN" || role === "EDITOR") && (
              <>
                <Link href="/dashboard/content/new" className="block">
                  <button className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 dark:border-[#282d33] hover:bg-gray-50 dark:hover:bg-white/5 transition-all text-left group">
                    <div className="w-8 h-8 rounded-lg bg-[#028ce8]/10 text-[#028ce8] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">add_circle</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Crear Contenido</span>
                  </button>
                </Link>
                <Link href="/dashboard/content?status=DRAFT" className="block">
                  <button className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 dark:border-[#282d33] hover:bg-gray-50 dark:hover:bg-white/5 transition-all text-left group">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">drafts</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Ver Borradores</span>
                  </button>
                </Link>
              </>
            )}

            {/* Estado para VIEWER */}
            {role === "VIEWER" && (
              <div className="p-4 text-center">
                <span className="material-symbols-outlined text-slate-300 text-4xl mb-2">visibility</span>
                <p className="text-xs text-slate-500">Tienes acceso de solo lectura. No hay acciones disponibles.</p>
              </div>
            )}

            <div className="pt-2">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0f1115] border border-gray-100 dark:border-[#282d33]">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tu Rol Actual</p>
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-[#028ce8]"></div>
                  <span className="text-sm font-bold text-slate-700 dark:text-white">{role}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
