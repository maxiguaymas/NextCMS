import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ShareButton from "@/components/ShareButton";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
  });

  if (!post) return { title: "Post no encontrado" };

  return {
    title: `${post.title} | NextCMS`,
    description: post.excerpt || post.metaDescription,
  };
}

export default async function PostDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: true,
    },
  });

  if (!post || post.status !== 'PUBLISHED') {
    notFound();
  }

  return (
    <article className="flex flex-col items-center py-10 px-6 lg:px-40">
      <div className="w-full max-w-[800px] flex flex-col gap-8">
        {/* Breadcrumbs & Back */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-gray-400">
          <Link href="/" className="hover:text-[#068ce5] transition-colors">Inicio</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <Link href="/posts" className="hover:text-[#068ce5] transition-colors">Archivo</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-[#111518] dark:text-white font-medium truncate">{post.title}</span>
        </nav>

        {/* Header */}
        <header className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <span className="px-2 py-1 rounded bg-[#068ce5]/10 text-[#068ce5] text-xs font-bold uppercase tracking-wider">
              Ingeniería
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-slate-500 dark:text-gray-400 text-xs font-medium">Lectura técnica</span>
          </div>
          
          <h1 className="text-[#111518] dark:text-white text-4xl md:text-5xl font-black leading-tight tracking-tight">
            {post.title}
          </h1>

          <div className="flex items-center justify-between py-6 border-y border-slate-100 dark:border-white/10">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-sm font-bold text-[#068ce5] overflow-hidden border border-gray-200 dark:border-white/20">
                {post.author?.image ? (
                  <img alt={post.author.name || "Autor"} src={post.author.image} className="object-cover h-full w-full" />
                ) : (
                  post.author?.name?.charAt(0) || 'U'
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-[#111518] dark:text-white font-bold">{post.author?.name || "Anónimo"}</span>
                <span className="text-slate-500 dark:text-gray-400 text-xs">Autor de NextCMS</span>
              </div>
            </div>
            <div className="text-right flex flex-col">
              <span className="text-slate-400 text-xs uppercase tracking-widest font-bold">Publicado</span>
              <span className="text-[#111518] dark:text-white font-medium">
                {new Date(post.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {post.featuredImage && (
          <div 
            className="w-full aspect-video rounded-2xl bg-center bg-no-repeat bg-cover border border-slate-100 dark:border-white/10 shadow-sm"
            style={{ backgroundImage: `url("${post.featuredImage}")` }}
          />
        )}

        {/* Content Area */}
        <div 
          className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-[#068ce5] prose-pre:bg-[#0f1b23] [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:dark:text-white [&_h2]:mt-6 [&_h2]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1 [&_li]:text-slate-700 [&_li]:dark:text-slate-300 [&_blockquote]:border-l-4 [&_blockquote]:border-[#028ce8] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-600 [&_blockquote]:dark:text-slate-400"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Footer Actions */}
        <footer className="mt-12 pt-8 border-t border-slate-100 dark:border-white/10 flex justify-between items-center">
          <Link href="/posts" className="flex items-center gap-2 text-[#068ce5] font-bold hover:underline">
            <span className="material-symbols-outlined">arrow_back</span>
            Volver al archivo
          </Link>
          <ShareButton title={post.title} text={post.excerpt || undefined} />
        </footer>
      </div>
    </article>
  );
}