import Link from "next/link";
import Image from "next/image";
import { getPostById } from "../actions";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const result = await getPostById(id);
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role || "VIEWER";

  if (!result.success || !result.data) {
    notFound();
  }

  const post = result.data;

  const statusMap = {
    'PUBLISHED': { label: 'Publicado', color: 'emerald' },
    'DRAFT': { label: 'Borrador', color: 'slate' },
    'ARCHIVED': { label: 'Archivado', color: 'amber' },
  } as const;

  const statusInfo = statusMap[post.status as keyof typeof statusMap] || statusMap['DRAFT'];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(new Date(date));
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/content" className="size-9 flex items-center justify-center rounded-xl border border-gray-200 dark:border-[#282d33] hover:bg-gray-50 dark:hover:bg-white/5 text-slate-500 transition-all">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </Link>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Detalle de Publicación</h1>
            <p className="text-slate-500 dark:text-[#8F9BA8] text-xs">Visualiza la información completa del artículo.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {(role === "ADMIN" || role === "EDITOR") && (
            <Link 
              href={`/dashboard/content/${post.id}/edit`}
              className="flex items-center justify-center gap-2 h-9 px-4 rounded-lg border border-gray-200 dark:border-[#282d33] bg-white dark:bg-[#16181c] text-slate-600 dark:text-white text-xs font-bold transition-all hover:border-[#028ce8]/50 shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">edit</span>
              <span>Editar contenido</span>
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna Principal: Contenido */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#16181c] border border-gray-200 dark:border-[#282d33] rounded-2xl overflow-hidden shadow-sm">
            {post.featuredImage && (
              <div className="aspect-video w-full overflow-hidden border-b border-gray-100 dark:border-[#282d33] relative">
                <Image 
                  src={post.featuredImage} 
                  alt={post.title} 
                  fill 
                  className="object-cover"
                  priority
                />
              </div>
            )}
            <div className="p-6 md:p-8 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                   <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border shadow-sm
                    ${statusInfo.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 
                      statusInfo.color === 'amber' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 
                      'bg-slate-500/10 text-slate-600 border-slate-500/20'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      statusInfo.color === 'emerald' ? 'bg-emerald-500' : 
                      statusInfo.color === 'amber' ? 'bg-amber-500' : 'bg-slate-500'}`}></span>
                    {statusInfo.label}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">/posts/{post.slug}</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-tight">{post.title}</h2>
              </div>

              {post.excerpt && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0f1115] border border-gray-100 dark:border-[#282d33]">
                  <p className="text-sm text-slate-600 dark:text-slate-400 italic">"{post.excerpt}"</p>
                </div>
              )}

              <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300" dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
          </div>
        </div>

        {/* Columna Lateral: Metadata */}
        <div className="lg:col-span-1 space-y-6">
          {/* Card: Información */}
          <div className="bg-white dark:bg-[#16181c] border border-gray-200 dark:border-[#282d33] rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#028ce8]">info</span>
              Información
            </h3>
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Autor</span>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[#0f1115] border border-gray-100 dark:border-[#282d33]">
                  <div className="size-8 rounded-full bg-[#028ce8]/10 text-[#028ce8] text-xs font-bold flex items-center justify-center border border-[#028ce8]/20">
                    {post.author.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-700 dark:text-white truncate">{post.author.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{post.author.email}</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fecha de creación</span>
                  <span className="text-xs text-slate-600 dark:text-slate-300">{formatDate(post.createdAt)}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Última actualización</span>
                  <span className="text-xs text-slate-600 dark:text-slate-300">{formatDate(post.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card: SEO */}
          <div className="bg-white dark:bg-[#16181c] border border-gray-200 dark:border-[#282d33] rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#028ce8]">search</span>
              SEO & Metadata
            </h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Meta Título</span>
                <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-[#0f1115] p-3 rounded-xl border border-gray-100 dark:border-[#282d33]">
                  {post.metaTitle || 'No definido'}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Meta Descripción</span>
                <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-[#0f1115] p-3 rounded-xl border border-gray-100 dark:border-[#282d33]">
                  {post.metaDescription || 'No definida'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}