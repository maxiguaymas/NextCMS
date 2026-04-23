'use client';

import { useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';

interface PostEditorProps {
  onChange: (content: string) => void;
  initialContent?: string;
}

export default function PostEditor({ onChange, initialContent }: PostEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Placeholder.configure({
        placeholder: 'Escribe el contenido de tu publicación aquí...',
      }),
    ],
    immediatelyRender: false,
    content: initialContent,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none focus:outline-none min-h-[400px] text-slate-600 dark:text-slate-300 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:dark:text-white [&_h2]:mt-6 [&_h2]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1 [&_li]:text-slate-700 [&_li]:dark:text-slate-300 [&_blockquote]:border-l-4 [&_blockquote]:border-[#028ce8] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-600 [&_blockquote]:dark:text-slate-400',
      },
    },
  });

  if (!editor) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.url) {
        editor.chain().focus().setImage({ src: data.url }).run();
      }
    } catch (error) {
      console.error("Error subiendo imagen al editor:", error);
    }
  };

  return (
    <div className="space-y-4">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
      {/* Toolbar completo */}
      <div className="flex flex-wrap gap-1 p-2 bg-slate-100 dark:bg-[#1a1e23] border border-gray-200 dark:border-[#282d33] rounded-xl">
        {/* Negrita */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded-lg transition-colors ${editor.isActive('bold') ? 'bg-[#028ce8] text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'}`}
          title="Negrita (Ctrl+B)"
        >
          <span className="material-symbols-outlined text-[18px]">format_bold</span>
        </button>
        
        {/* Cursiva */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded-lg transition-colors ${editor.isActive('italic') ? 'bg-[#028ce8] text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'}`}
          title="Cursiva (Ctrl+I)"
        >
          <span className="material-symbols-outlined text-[18px]">format_italic</span>
        </button>
        
        <div className="w-px bg-slate-300 dark:bg-slate-600 mx-1"></div>
        
        {/* H2 - Subtítulo (H1 es el título de la publicación) */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded-lg transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-[#028ce8] text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'}`}
          title="Subtítulo"
        >
          <span className="material-symbols-outlined text-[18px]">format_h2</span>
        </button>
        
        <div className="w-px bg-slate-300 dark:bg-slate-600 mx-1"></div>
        
        {/* Lista con viñetas */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded-lg transition-colors ${editor.isActive('bulletList') ? 'bg-[#028ce8] text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'}`}
          title="Lista con viñetas"
        >
          <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
        </button>
        
        {/* Lista numerada */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded-lg transition-colors ${editor.isActive('orderedList') ? 'bg-[#028ce8] text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'}`}
          title="Lista numerada"
        >
          <span className="material-symbols-outlined text-[18px]">format_list_numbered</span>
        </button>
        
        <div className="w-px bg-slate-300 dark:bg-slate-600 mx-1"></div>
        
        {/* Blockquote - Cita */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded-lg transition-colors ${editor.isActive('blockquote') ? 'bg-[#028ce8] text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'}`}
          title="Cita"
        >
          <span className="material-symbols-outlined text-[18px]">format_quote</span>
        </button>
        
        {/* Código inline */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-2 rounded-lg transition-colors ${editor.isActive('code') ? 'bg-[#028ce8] text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'}`}
          title="Código"
        >
          <span className="material-symbols-outlined text-[18px]">code</span>
        </button>
        
        <div className="w-px bg-slate-300 dark:bg-slate-600 mx-1"></div>
        
        {/* Imagen */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
          title="Insertar imagen"
        >
          <span className="material-symbols-outlined text-[18px]">image</span>
        </button>
        
        {/* División horizontal */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
          title="Línea horizontal"
        >
          <span className="material-symbols-outlined text-[18px]">horizontal_rule</span>
        </button>
      </div>

      <div className="p-4 bg-white dark:bg-[#16181c] rounded-2xl border border-gray-100 dark:border-[#282d33] min-h-[400px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}