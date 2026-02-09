'use client';

import { useState } from "react";
import { subscribeToNewsletter } from "@/app/(public)/newsletter-actions";

export default function NewsletterForm() {
  const [status, setStatus] = useState<{ success?: boolean; error?: string } | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setStatus(null);
    const result = await subscribeToNewsletter(formData);
    setStatus(result);
    setIsPending(false);
  }

  if (status?.success) {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 text-center animate-in fade-in zoom-in duration-300">
        <p className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">
          ¡Gracias por suscribirte! Pronto recibirás novedades.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <form action={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <div className="flex-1 flex flex-col gap-2">
          <input 
            required
            name="email"
            className="w-full rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-[#068ce5] focus:border-[#068ce5] px-4 py-3 text-sm outline-none transition-all" 
            placeholder="tu@empresa.com" 
            type="email"
          />
          {status?.error && (
            <p className="text-red-500 text-[10px] font-bold text-left ml-1 uppercase tracking-wider">
              {status.error}
            </p>
          )}
        </div>
        <button 
          disabled={isPending}
          className="h-[46px] bg-[#068ce5] text-white font-bold px-6 rounded-xl hover:bg-[#068ce5]/90 transition-all shadow-md shadow-[#068ce5]/10 disabled:opacity-50"
        >
          {isPending ? '...' : 'Suscribirse'}
        </button>
      </form>
    </div>
  );
}