import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Image from "next/image";

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; sort?: string }>;
}) {
  const { q: query = "", page: pageStr = "1", sort = "desc" } = await searchParams;
  
  const page = Math.max(1, parseInt(pageStr));
  const limit = 5; // Cantidad de posts por página
  const skip = (page - 1) * limit;

  const whereClause = {
    status: 'PUBLISHED' as const,
    ...(query ? {
      OR: [
        { title: { contains: query, mode: 'insensitive' as const } },
        { excerpt: { contains: query, mode: 'insensitive' as const } },
      ]
    } : {})
  };

  const [posts, totalPosts] = await Promise.all([
    prisma.post.findMany({
      where: whereClause,
      orderBy: { createdAt: sort === 'asc' ? 'asc' : 'desc' },
      include: { author: true },
      skip,
      take: limit,
    }),
    prisma.post.count({ where: whereClause }),
  ]);

  const totalPages = Math.ceil(totalPosts / limit);
  const startRange = totalPosts === 0 ? 0 : skip + 1;
  const endRange = Math.min(skip + limit, totalPosts);

  return (
    <div className="flex flex-col items-center py-10 px-6 lg:px-40">
      <div className="w-full max-w-[960px] flex flex-col gap-8">
        {/* Heading */}
        <div className="flex flex-col gap-3">
          <h1 className="text-[#111518] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
            Archivo Técnico
          </h1>
          <p className="text-[#5f7a8c] dark:text-gray-400 text-lg font-normal leading-normal max-w-2xl">
            Inmersiones profundas, conocimientos de ingeniería y actualizaciones técnicas del equipo de NextCMS. Aprende cómo construimos una infraestructura de contenido moderna.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-4">
          <form className="w-full">
            <label className="flex flex-col min-w-40 h-14 w-full group">
              <div className="flex w-full flex-1 items-stretch rounded-xl h-full shadow-sm">
                <div className="text-[#5f7a8c] flex border-none bg-white dark:bg-white/5 items-center justify-center pl-4 rounded-l-xl border-r-0">
                  <span className="material-symbols-outlined">search</span>
                </div>
                <input 
                  name="q"
                  defaultValue={query}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111518] dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#068ce5]/50 border-none bg-white dark:bg-white/5 focus:border-none h-full placeholder:text-[#5f7a8c] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal transition-all" 
                  placeholder="Buscar publicaciones técnicas..." 
                />
              </div>
            </label>
          </form>
          
          <div className="flex gap-3 flex-wrap items-center">
            <span className="text-[#5f7a8c] dark:text-gray-400 text-sm font-semibold mr-2 uppercase tracking-wider">Filtrar por:</span>
            <Link 
              href={`/posts?sort=desc${query ? `&q=${query}` : ''}`}
              className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 text-sm font-bold transition-all ${sort === 'desc' ? 'bg-[#068ce5] text-white' : 'bg-white dark:bg-white/10 text-slate-600 dark:text-slate-300'}`}
            >
              Recientes
            </Link>
            <Link 
              href={`/posts?sort=asc${query ? `&q=${query}` : ''}`}
              className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 text-sm font-bold transition-all ${sort === 'asc' ? 'bg-[#068ce5] text-white' : 'bg-white dark:bg-white/10 text-slate-600 dark:text-slate-300'}`}
            >
              Antiguos
            </Link>
          </div>
        </div>

        {/* Posts List */}
        <div className="flex flex-col gap-4">
          {posts.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-white/5 rounded-2xl border border-dashed border-slate-200 dark:border-white/10">
              <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">search_off</span>
              <h4 className="text-slate-900 dark:text-white font-bold text-lg">No se encontraron publicaciones</h4>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                {query ? `No hay resultados para "${query}". Intenta con otros términos.` : "Aún no hay publicaciones técnicas disponibles."}
              </p>
            </div>
          ) : posts.map((post) => (
            <Link key={post.id} href={`/posts/${post.slug || post.id}`} className="group flex gap-6 bg-white dark:bg-white/5 border border-transparent hover:border-[#068ce5]/20 hover:shadow-md p-6 rounded-xl transition-all cursor-pointer">
              <div className="hidden sm:block shrink-0">
                <div 
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-xl h-32 w-32 border border-gray-100 dark:border-white/10" 
                  style={{ backgroundImage: `url("${post.featuredImage || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop'}")` }}
                />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#068ce5]/10 text-[#068ce5] text-[10px] font-bold uppercase tracking-wider">Ingeniería</span>
                    <span className="text-[#5f7a8c] text-xs">•</span>
                    <span className="text-[#5f7a8c] dark:text-gray-400 text-xs">Lectura rápida</span>
                  </div>
                  <h3 className="text-[#111518] dark:text-white text-xl font-bold leading-tight group-hover:text-[#068ce5] transition-colors">{post.title}</h3>
                  <p className="text-[#5f7a8c] dark:text-gray-400 text-sm font-normal leading-relaxed line-clamp-2">
                    {post.excerpt || "Explora los detalles técnicos de esta implementación en nuestro blog oficial."}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-[#068ce5] overflow-hidden relative">
                      {post.author?.image ? (
                        <Image 
                          alt="Author" 
                          src={post.author.image}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        post.author?.name?.charAt(0) || 'U'
                      )}
                    </div>
                    <span className="text-[#111518] dark:text-white text-sm font-medium">{post.author?.name || "Anónimo"}</span>
                  </div>
                  <p className="text-[#5f7a8c] dark:text-gray-400 text-sm font-normal">{new Date(post.createdAt).toLocaleDateString('es-ES')}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {totalPosts > 0 && (
          <nav aria-label="Pagination" className="flex flex-col sm:flex-row items-center justify-between border-t border-[#f0f3f5] dark:border-white/10 py-10 gap-6">
            <div className="flex items-center gap-2">
              <p className="text-sm text-[#5f7a8c] dark:text-gray-400">
                Mostrando <span className="font-semibold text-[#111518] dark:text-white">{startRange}</span> a <span className="font-semibold text-[#111518] dark:text-white">{endRange}</span> de <span className="font-semibold text-[#111518] dark:text-white">{totalPosts}</span> publicaciones
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link 
                href={`/posts?page=${page - 1}${query ? `&q=${query}` : ''}${sort !== 'desc' ? `&sort=${sort}` : ''}`}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg border border-[#f0f3f5] dark:border-white/10 bg-white dark:bg-white/5 text-[#5f7a8c] dark:text-gray-400 text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/10 transition-colors ${page <= 1 ? 'pointer-events-none opacity-50' : ''}`}
              >
                <span className="material-symbols-outlined text-lg leading-none">chevron_left</span>
                <span>Anterior</span>
              </Link>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={`/posts?page=${p}${query ? `&q=${query}` : ''}${sort !== 'desc' ? `&sort=${sort}` : ''}`}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${p === page ? 'bg-[#068ce5] text-white shadow-sm' : 'bg-white dark:bg-white/5 border border-[#f0f3f5] dark:border-white/10 text-[#111518] dark:text-white hover:bg-gray-50 dark:hover:bg-white/10'}`}
                  >
                    {p}
                  </Link>
                ))}
              </div>
              <Link 
                href={`/posts?page=${page + 1}${query ? `&q=${query}` : ''}${sort !== 'desc' ? `&sort=${sort}` : ''}`}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg border border-[#f0f3f5] dark:border-white/10 bg-white dark:bg-white/5 text-[#5f7a8c] dark:text-gray-400 text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/10 transition-colors ${page >= totalPages ? 'pointer-events-none opacity-50' : ''}`}
              >
                <span>Siguiente</span>
                <span className="material-symbols-outlined text-lg leading-none">chevron_right</span>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </div>
  );
}