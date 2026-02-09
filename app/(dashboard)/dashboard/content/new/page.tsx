import { Metadata } from "next";
import Link from "next/link";
import PostForm from "./PostForm";

export const metadata: Metadata = {
  title: "Nueva Publicación | NextCMS",
};

export default function NewPostPage() {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/content" className="size-9 flex items-center justify-center rounded-xl border border-gray-200 dark:border-[#282d33] hover:bg-gray-50 dark:hover:bg-white/5 text-slate-500 transition-all">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Nueva Publicación</h1>
          <p className="text-slate-500 dark:text-[#8F9BA8] text-xs">Crea un nuevo artículo para tu blog o sitio web.</p>
        </div>
      </div>
      
      <PostForm />
    </div>
  );
}
  
