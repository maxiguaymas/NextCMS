'use client';

import { useState } from 'react';

interface ShareButtonProps {
  title: string;
  text?: string;
}

export default function ShareButton({ title, text }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title,
      text: text || 'Echa un vistazo a esta publicación técnica en NextCMS',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button 
      onClick={handleShare}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors font-medium text-sm"
    >
      <span className="material-symbols-outlined text-lg">
        {copied ? 'check' : 'share'}
      </span>
      {copied ? '¡Enlace copiado!' : 'Compartir publicación'}
    </button>
  );
}