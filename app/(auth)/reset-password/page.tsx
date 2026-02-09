'use client';

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { resetPassword } from "./actions";
import Link from "next/link";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!token) {
    return (
      <div className="w-full max-w-[440px] bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 text-center">
        <h1 className="text-2xl font-bold mb-4">Enlace no válido</h1>
        <p className="text-slate-500 mb-6">El token de recuperación falta o no es válido.</p>
        <Link href="/forgot-password" className="text-[#028ce8] font-medium hover:underline">Solicitar nuevo enlace</Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError("Las contraseñas no coinciden.");
    }
    if (password.length < 6) {
      return setError("La contraseña debe tener al menos 6 caracteres.");
    }

    setLoading(true);
    setError(null);

    const result = await resetPassword(token, password);

    if (result.success) {
      router.push("/login?reset=true");
    } else {
      setError(result.error || "Error al restablecer la contraseña.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[440px] bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
      <div className="mb-8 text-center">
        <h1 className="text-[#101518] dark:text-white tracking-tight text-[28px] font-bold leading-tight pb-2">Nueva contraseña</h1>
        <p className="text-[#5e7a8d] dark:text-slate-400 text-base font-normal">Crea una contraseña segura para tu cuenta.</p>
      </div>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex flex-col w-full">
          <label className="text-[#101518] dark:text-slate-200 text-sm font-medium pb-2">Nueva contraseña</label>
          <input 
            required
            className="flex w-full rounded-lg text-[#101518] dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#028ce8]/50 border border-[#dae2e7] dark:border-slate-700 bg-white dark:bg-slate-800 h-12 px-4 text-base transition-all"
            placeholder="••••••••" 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex flex-col w-full">
          <label className="text-[#101518] dark:text-slate-200 text-sm font-medium pb-2">Confirmar contraseña</label>
          <input 
            required
            className="flex w-full rounded-lg text-[#101518] dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#028ce8]/50 border border-[#dae2e7] dark:border-slate-700 bg-white dark:bg-slate-800 h-12 px-4 text-base transition-all"
            placeholder="••••••••" 
            type="password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button 
          disabled={loading}
          className="flex w-full items-center justify-center rounded-lg h-12 bg-[#028ce8] text-white text-base font-bold hover:bg-[#028ce8]/90 transition-all shadow-md shadow-[#028ce8]/20 mt-2 disabled:opacity-50" 
          type="submit"
        >
          {loading ? "Actualizando..." : "Restablecer contraseña"}
        </button>
      </form>
    </div>
  );
}