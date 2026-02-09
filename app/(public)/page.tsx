import Link from "next/link";
import { prisma } from "@/lib/prisma";
import NewsletterForm from "@/components/NewsletterForm";

export default async function HomePage() {
  const latestPosts = await prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    take: 3,
    orderBy: { createdAt: 'desc' },
    include: { author: true }
  });

  return (
    <>
      {/* Hero Section */}
      <section className="px-6 md:px-20 lg:px-40 pt-16 pb-12 bg-white dark:bg-[#0f1b23]">
        <div className="mx-auto max-w-[1200px] text-center">
          <h2 className="text-[#0f172a] dark:text-white text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Contenido moderno para equipos técnicos.
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-[600px] mx-auto mb-8 font-normal leading-relaxed">
            El CMS headless diseñado para desarrolladores que valoran la velocidad, la flexibilidad y una experiencia de autoría de clase mundial.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/posts" className="bg-[#0f172a] dark:bg-[#068ce5] text-white font-semibold px-6 py-3 rounded-xl hover:bg-slate-800 dark:hover:bg-[#068ce5]/90 transition-all shadow-lg">
              Explorar Publicaciones
            </Link>
            <Link href="/about" className="text-slate-600 dark:text-slate-300 font-semibold px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
              Sobre el Proyecto
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="px-6 md:px-20 lg:px-40 py-16 bg-[#f8fafc] dark:bg-[#0f1b23]">
        <div className="mx-auto max-w-[1200px]">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-bold text-[#0f172a] dark:text-white">Últimas publicaciones técnicas</h3>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Información y tutoriales del equipo de ingeniería de NextCMS.</p>
            </div>
            <Link className="text-sm font-semibold text-[#068ce5] hover:underline flex items-center gap-1" href="/posts">
              Ver todas las publicaciones <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestPosts.length === 0 ? (
              <div className="col-span-full text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">history_edu</span>
                <h4 className="text-slate-900 dark:text-white font-bold text-lg">Próximamente</h4>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                  Estamos preparando contenido técnico increíble para ti. ¡Vuelve pronto!
                </p>
              </div>
            ) : latestPosts.map((post) => (
              <Link key={post.id} href={`/posts/${post.slug || post.id}`}>
                <article className="bg-white dark:bg-slate-900 rounded-2xl border border-[#e2e8f0] dark:border-slate-800 overflow-hidden h-full flex flex-col group hover:border-[#068ce5]/40 hover:shadow-xl hover:shadow-[#068ce5]/5 transition-all">
                  <div className="aspect-video w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <img 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      src={post.featuredImage || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop"}
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#068ce5] bg-[#068ce5]/5 px-2 py-0.5 rounded">Publicación</span>
                      <span className="text-xs text-slate-400">{new Date(post.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                    <h4 className="text-lg font-bold text-[#0f172a] dark:text-white mb-2 line-clamp-2 leading-snug group-hover:text-[#068ce5] transition-colors">
                      {post.title}
                    </h4>
                    <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-3 mb-6">
                      {post.excerpt || "Lee nuestra última publicación técnica en NextCMS."}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50 dark:border-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex items-center justify-center text-[10px] font-bold text-[#068ce5]">
                          {post.author?.image ? <img alt="Author" src={post.author.image}/> : post.author?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-[#0f172a] dark:text-white">{post.author?.name || "Anónimo"}</p>
                          <p className="text-[10px] text-slate-400">Autor</p>
                        </div>
                      </div>
                      <button className="text-slate-400 hover:text-[#068ce5] transition-colors">
                        <span className="material-symbols-outlined text-lg">bookmark</span>
                      </button>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="px-6 md:px-20 lg:px-40 py-20 bg-white dark:bg-[#0f1b23] border-t border-slate-100 dark:border-slate-800">
        <div className="mx-auto max-w-[800px] text-center">
          <h3 className="text-2xl font-bold text-[#0f172a] dark:text-white mb-2">Suscríbete a nuestro boletín para desarrolladores</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Inmersiones técnicas semanales y actualizaciones de NextCMS enviadas a tu bandeja de entrada.</p>
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}
