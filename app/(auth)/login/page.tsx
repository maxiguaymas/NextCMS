'use client';

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isVerified = searchParams.get("verified") === "true";
  const isRegistered = searchParams.get("registered") === "true";
  const isReset = searchParams.get("reset") === "true";
  
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    if (result?.error) {
      setError("Credenciales incorrectas o cuenta no verificada.");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="w-full max-w-[440px] bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
      <div className="mb-8 text-center">
        <h1 className="text-[#101518] dark:text-white tracking-tight text-[28px] font-bold leading-tight pb-2">Bienvenido de nuevo</h1>
        <p className="text-[#5e7a8d] dark:text-slate-400 text-base font-normal">Ingresa a tu cuenta para gestionar tu contenido.</p>
      </div>

      {/* Banner de Verificación Exitosa */}
      {isVerified && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-500">
          <span className="material-symbols-outlined text-emerald-500">verified</span>
          <p className="text-emerald-600 dark:text-emerald-400 text-sm font-medium">
            ¡Cuenta verificada con éxito! Ya puedes iniciar sesión.
          </p>
        </div>
      )}

      {/* Banner de Contraseña Restablecida */}
      {isReset && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-500">
          <span className="material-symbols-outlined text-emerald-500">lock_reset</span>
          <p className="text-emerald-600 dark:text-emerald-400 text-sm font-medium">
            Contraseña actualizada. Ya puedes iniciar sesión con tu nueva clave.
          </p>
        </div>
      )}

      {/* Banner de Registro Exitoso (Pendiente Verificación) */}
      {isRegistered && (
        <div className="mb-6 p-4 bg-[#028ce8]/10 border border-[#028ce8]/20 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-500">
          <span className="material-symbols-outlined text-[#028ce8]">mail</span>
          <p className="text-[#028ce8] dark:text-[#028ce8] text-sm font-medium">
            ¡Registro exitoso! Por favor, revisa tu correo para verificar tu cuenta.
          </p>
        </div>
      )}

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex flex-col w-full">
          <label className="text-[#101518] dark:text-slate-200 text-sm font-medium pb-2">Correo electrónico</label>
          <input 
            required
            className="flex w-full rounded-lg text-[#101518] dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#028ce8]/50 border border-[#dae2e7] dark:border-slate-700 bg-white dark:bg-slate-800 h-12 px-4 text-base transition-all"
            placeholder="nombre@empresa.com" 
            type="email" 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>

        <div className="flex flex-col w-full">
          <div className="flex justify-between items-center pb-2">
            <label className="text-[#101518] dark:text-slate-200 text-sm font-medium">Contraseña</label>
            <Link href="/forgot-password" className="text-[#028ce8] text-xs font-medium hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <div className="relative group">
            <input 
              required
              className="flex w-full rounded-lg text-[#101518] dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#028ce8]/50 border border-[#dae2e7] dark:border-slate-700 bg-white dark:bg-slate-800 h-12 pl-4 pr-12 text-base transition-all"
              placeholder="••••••••" 
              type={showPassword ? "text" : "password"} 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center size-8 rounded-md text-slate-400 hover:text-[#028ce8] hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              <span className="material-symbols-outlined text-[20px]">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
        </div>

        <button 
          disabled={loading}
          className="flex w-full items-center justify-center rounded-lg h-12 bg-[#028ce8] text-white text-base font-bold hover:bg-[#028ce8]/90 transition-all shadow-md shadow-[#028ce8]/20 mt-2 disabled:opacity-50" 
          type="submit"
        >
          {loading ? "Iniciando sesión..." : "Iniciar sesión"}
        </button>

        <div className="text-center mt-2">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            ¿No tienes una cuenta?{" "}
            <Link href="/register" className="text-[#028ce8] font-medium hover:underline">
              Regístrate gratis
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}