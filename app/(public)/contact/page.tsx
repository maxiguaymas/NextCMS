'use client';

import { useState } from "react";
import { sendContactForm } from "./actions";

export default function ContactPage() {
  const [isPending, setIsPending] = useState(false);
  const [status, setStatus] = useState<{ success?: boolean; error?: string } | null>(null);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setStatus(null);
    
    try {
      const result = await sendContactForm(formData);
      setStatus(result);
    } catch {
      setStatus({ error: "Ocurrió un error inesperado. Inténtalo de nuevo." });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12 bg-[#f8fafc] dark:bg-[#0f1b23]">
      <div className="w-full max-w-[550px]">
        <div className="text-center mb-10">
          <h1 className="text-[#0f172a] dark:text-white text-3xl md:text-4xl font-black tracking-tight mb-3">
            Contacto
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            ¿Tienes alguna duda? Envíanos un mensaje y te responderemos lo antes posible.
          </p>
        </div>

        {status?.success ? (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center animate-in fade-in zoom-in duration-300">
            <div className="size-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
              <span className="material-symbols-outlined text-3xl">check</span>
            </div>
            <h3 className="text-emerald-600 dark:text-emerald-400 font-bold text-xl mb-2">¡Mensaje enviado!</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Gracias por contactarnos. Hemos recibido tu solicitud correctamente.</p>
            <button 
              onClick={() => setStatus(null)}
              className="mt-6 text-sm font-bold text-[#068ce5] hover:underline"
            >
              Enviar otro mensaje
            </button>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
            <form action={handleSubmit} className="flex flex-col gap-5">
              {/* Honeypot Field (Invisible para humanos) */}
              <input type="text" name="honeypot" className="hidden" tabIndex={-1} autoComplete="off" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Nombre</label>
                  <input required name="name" type="text" placeholder="Ej. Juan Pérez" className="rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-2 focus:ring-[#068ce5]/20 focus:border-[#068ce5] outline-none px-4 py-3 text-sm transition-all" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Email</label>
                  <input required name="email" type="email" placeholder="tu@email.com" className="rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-2 focus:ring-[#068ce5]/20 focus:border-[#068ce5] outline-none px-4 py-3 text-sm transition-all" />
                </div>
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Asunto</label>
                <input required name="subject" type="text" placeholder="¿Cómo podemos ayudarte?" className="rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-2 focus:ring-[#068ce5]/20 focus:border-[#068ce5] outline-none px-4 py-3 text-sm transition-all" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Mensaje</label>
                <textarea required name="message" rows={4} placeholder="Escribe tu mensaje aquí..." className="rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-2 focus:ring-[#068ce5]/20 focus:border-[#068ce5] outline-none px-4 py-3 text-sm transition-all resize-none"></textarea>
              </div>

              {status?.error && (
                <p className="text-red-500 text-xs font-medium ml-1 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                  {status.error}
                </p>
              )}

              <button 
                disabled={isPending}
                className="bg-[#068ce5] text-white font-bold py-4 rounded-2xl hover:bg-[#068ce5]/90 transition-all shadow-lg shadow-[#068ce5]/25 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                {isPending ? (
                  <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : 'Enviar mensaje'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}