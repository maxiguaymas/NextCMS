'use client';

import { useState } from "react";
import { requestPasswordReset } from "./actions";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("email", email);

    const result = await requestPasswordReset(formData);

    if (result.success) {
      setMessage({ 
        type: 'success', 
        text: "Si el correo está registrado, recibirás un enlace para restablecer tu contraseña en unos minutos." 
      });
    } else {
      setMessage({ type: 'error', text: result.error || "Ocurrió un error inesperado." });
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-[440px] bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
      <div className="mb-8 text-center">
        <h1 className="text-[#101518] dark:text-white tracking-tight text-[28px] font-bold leading-tight pb-2">Recuperar contraseña</h1>
        <p className="text-[#5e7a8d] dark:text-slate-400 text-base font-normal">Introduce tu email y te enviaremos las instrucciones.</p>
      </div>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        {message && (
          <div className={`p-4 text-sm rounded-lg border ${
            message.type === 'success' 
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
              : 'bg-red-50 border-red-200 text-red-500 dark:bg-red-900/20 dark:border-red-800'
          }`}>
            {message.text}
          </div>
        )}

        <div className="flex flex-col w-full">
          <label className="text-[#101518] dark:text-slate-200 text-sm font-medium pb-2">Correo electrónico</label>
          <input 
            required
            className="flex w-full rounded-lg text-[#101518] dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#028ce8]/50 border border-[#dae2e7] dark:border-slate-700 bg-white dark:bg-slate-800 h-12 px-4 text-base transition-all"
            placeholder="nombre@empresa.com" 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button 
          disabled={loading || message?.type === 'success'}
          className="flex w-full items-center justify-center rounded-lg h-12 bg-[#028ce8] text-white text-base font-bold hover:bg-[#028ce8]/90 transition-all shadow-md shadow-[#028ce8]/20 mt-2 disabled:opacity-50" 
          type="submit"
        >
          {loading ? "Enviando..." : "Enviar enlace de recuperación"}
        </button>

        <div className="text-center mt-2">
          <Link href="/login" className="text-[#028ce8] text-sm font-medium hover:underline flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Volver al inicio de sesión
          </Link>
        </div>
      </form>
    </div>
  );
}