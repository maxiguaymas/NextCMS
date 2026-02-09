import Link from "next/link";
import { getPostById } from "../../actions";
import { notFound } from "next/navigation";
import PostForm from "../../new/PostForm";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const result = await getPostById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const post = result.data;

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/content/${post.id}`} className="size-9 flex items-center justify-center rounded-xl border border-gray-200 dark:border-[#282d33] hover:bg-gray-50 dark:hover:bg-white/5 text-slate-500 transition-all">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Editar Publicación</h1>
          <p className="text-slate-500 dark:text-[#8F9BA8] text-xs">Modifica el contenido y la configuración de tu artículo.</p>
        </div>
      </div>
      
      <PostForm initialData={post} />
    </div>
  );
}