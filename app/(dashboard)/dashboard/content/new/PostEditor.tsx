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
        class: 'prose dark:prose-invert max-w-none focus:outline-none min-h-[400px] text-slate-600 dark:text-slate-300',
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
      {/* Toolbar básico */}
      <div className="flex flex-wrap gap-1 p-1 bg-slate-50 dark:bg-[#0f1115] border border-gray-100 dark:border-[#282d33] rounded-xl">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded-lg transition-colors ${editor.isActive('bold') ? 'bg-[#028ce8] text-white' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-white/5'}`}
        >
          <span className="material-symbols-outlined text-[18px]">format_bold</span>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded-lg transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-[#028ce8] text-white' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-white/5'}`}
        >
          <span className="material-symbols-outlined text-[18px]">format_h2</span>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded-lg transition-colors ${editor.isActive('bulletList') ? 'bg-[#028ce8] text-white' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-white/5'}`}
        >
          <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
        </button>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-white/5 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">image</span>
        </button>
      </div>

      <div className="p-4 bg-slate-50/50 dark:bg-[#0f1115]/30 rounded-2xl border border-gray-100 dark:border-[#282d33]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}