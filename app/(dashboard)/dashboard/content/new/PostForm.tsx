'use client';

import { useState, useEffect } from "react";
import PostEditor from "./PostEditor";
import ImageUpload from "./ImageUpload";
import { createPost } from "./actions";
import { updatePost } from "../actions";
import { useRouter } from "next/navigation";

export default function PostForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED'>(initialData?.status || 'DRAFT');
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [isManualSlug, setIsManualSlug] = useState(!!initialData);
  const [featuredImage, setFeaturedImage] = useState(initialData?.featuredImage || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription || "");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Generación automática de slug
  useEffect(() => {
    if (!isManualSlug && title) {
      const generated = title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generated);
    }
  }, [title, isManualSlug]);

  const executeSubmit = async () => {
    setLoading(true);
    setShowConfirmModal(false);
    
    const postData = {
      title,
      slug,
      content,
      featuredImage,
      status,
      excerpt,
      metaTitle,
      metaDescription
    };

    const result = initialData 
      ? await updatePost(initialData.id, postData)
      : await createPost(postData);
    
    setLoading(false);

    if (result.success) {
      // Redirigir a la lista de contenidos tras el éxito
      router.push("/dashboard/content");
    } else {
      alert(result.error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (initialData) {
      setShowConfirmModal(true);
    } else {
      executeSubmit();
    }
  };

  return (
    <>
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Columna Principal: Contenido */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white dark:bg-[#16181c] border border-gray-200 dark:border-[#282d33] rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
          {/* Título */}
          <div className="space-y-1">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título de la publicación..."
              className="w-full bg-transparent text-3xl md:text-4xl font-black text-slate-900 dark:text-white placeholder-slate-200 dark:placeholder-slate-800 focus:outline-none"
              required
            />
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="material-symbols-outlined text-[14px]">link</span>
              <span>/posts/</span>
              <input 
                type="text"
                value={slug}
                onChange={(e) => { setSlug(e.target.value); setIsManualSlug(true); }}
                className="bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#028ce8] focus:outline-none text-[#028ce8] min-w-[100px]"
              />
            </div>
          </div>

          {/* Editor TipTap */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contenido</label>
            <PostEditor onChange={setContent} initialContent={content} />
          </div>
        </div>
      </div>

      {/* Columna Lateral: Metadata */}
      <div className="lg:col-span-1 space-y-6">
        {/* Card: Publicación */}
        <div className="bg-white dark:bg-[#16181c] border border-gray-200 dark:border-[#282d33] rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#028ce8]">send</span>
            Publicación
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#0f1115] border border-gray-100 dark:border-[#282d33]">
              <span className="text-xs font-medium text-slate-500">Estado</span>
              <select 
                value={status} 
                onChange={(e) => setStatus(e.target.value as any)}
                className="bg-transparent text-[10px] font-bold uppercase focus:outline-none text-[#028ce8] cursor-pointer"
              >
                <option value="DRAFT">Borrador</option>
                <option value="PUBLISHED">Publicado</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#028ce8] text-white text-sm font-bold rounded-xl hover:bg-[#026fc2] transition-all shadow-lg shadow-[#028ce8]/20 disabled:opacity-50"
            >
              {loading 
                ? 'Guardando...' 
                : initialData 
                  ? 'Actualizar Publicación' 
                  : status === 'PUBLISHED' ? 'Publicar Ahora' : 'Guardar Borrador'}
            </button>
          </div>
        </div>

        {/* Card: Imagen Destacada */}
        <div className="bg-white dark:bg-[#16181c] border border-gray-200 dark:border-[#282d33] rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#028ce8]">image</span>
            Imagen de Portada
          </h3>
          <ImageUpload value={featuredImage} onChange={setFeaturedImage} />
        </div>

        {/* Card: SEO */}
        <div className="bg-white dark:bg-[#16181c] border border-gray-200 dark:border-[#282d33] rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#028ce8]">search</span>
            SEO & Social
          </h3>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Extracto</label>
              <textarea
                rows={3}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Resumen corto para redes sociales..."
                className="w-full bg-slate-50 dark:bg-[#0f1115] border border-gray-100 dark:border-[#282d33] rounded-xl p-3 text-xs text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#028ce8] transition-all resize-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Meta Título</label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="Título para Google..."
                className="w-full bg-slate-50 dark:bg-[#0f1115] border border-gray-100 dark:border-[#282d33] rounded-xl p-3 text-xs text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#028ce8] transition-all"
              />
            </div>
          </div>
        </div>
      </div>
    </form>

    {/* Modal de Confirmación */}
    {showConfirmModal && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white dark:bg-[#16181c] border border-gray-200 dark:border-[#282d33] rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="flex items-center gap-3 mb-4 text-amber-500">
            <span className="material-symbols-outlined text-3xl">warning</span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Confirmar cambios</h3>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            ¿Estás seguro de que deseas aplicar los cambios a esta publicación? Esta acción actualizará el contenido de forma inmediata.
          </p>
          <div className="flex gap-3">
            <button 
              type="button"
              onClick={() => setShowConfirmModal(false)}
              className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-[#282d33] text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
            >
              Cancelar
            </button>
            <button 
              type="button"
              onClick={executeSubmit}
              className="flex-1 px-4 py-2 rounded-xl bg-[#028ce8] text-white text-xs font-bold hover:bg-[#026fc2] transition-all shadow-lg shadow-[#028ce8]/20"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}