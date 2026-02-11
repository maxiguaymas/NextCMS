'use client';

import { useState, useRef } from "react";
import Image from "next/image";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.url) {
        onChange(data.url);
      }
    } catch (error) {
      console.error("Error subiendo imagen:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleUpload} 
        accept="image/*" 
        className="hidden" 
      />
      
      {value ? (
        <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-100 dark:border-[#282d33] group">
          <Image 
            src={value} 
            alt="Preview" 
            fill 
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button type="button" onClick={() => fileInputRef.current?.click()} className="px-3 py-1.5 bg-white text-slate-900 text-[10px] font-bold rounded-lg hover:bg-slate-100 transition-colors">Cambiar</button>
            <button type="button" onClick={() => onChange("")} className="px-3 py-1.5 bg-red-500 text-white text-[10px] font-bold rounded-lg hover:bg-red-600 transition-colors">Eliminar</button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full aspect-video rounded-xl bg-slate-50 dark:bg-[#0f1115] border-2 border-dashed border-gray-200 dark:border-[#282d33] flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-[#028ce8]/50 hover:text-slate-500 transition-all disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-3xl">{uploading ? 'sync' : 'add_photo_alternate'}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">{uploading ? 'Subiendo...' : 'Subir Imagen'}</span>
        </button>
      )}
    </div>
  );
}