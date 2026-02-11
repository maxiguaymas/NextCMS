'use client';

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "./actions";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{ [key in keyof typeof formData]?: string } & { general?: string }>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!formData.name.trim()) newErrors.name = "El nombre completo es obligatorio.";
    if (!formData.email) {
      newErrors.email = "El correo electrónico es obligatorio.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El formato del correo no es válido.";
    }
    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria.";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres.";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      // Convertimos los datos del estado a FormData para la Server Action
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("password", formData.password);

      const result = await registerUser(data);

      if (result.success) {
        router.push("/login?registered=true");
      } else {
        setErrors({ general: result.error || "Error al registrar el usuario." });
      }
    } catch (err) {
      setErrors({ general: "Ocurrió un error inesperado." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[440px] bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
      {/* Headline Section */}
      <div className="mb-8">
        <h1 className="text-[#101518] dark:text-white tracking-tight text-[28px] font-bold leading-tight text-center pb-2">Crear una cuenta</h1>
        <p className="text-[#5e7a8d] dark:text-slate-400 text-base font-normal leading-normal text-center">Únete a NextCMS y comienza a gestionar tu contenido.</p>
      </div>

      {/* Register Form */}
      <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
        {errors.general && (
          <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            {errors.general}
          </div>
        )}
        {/* Name Field */}
        <div className="flex flex-col w-full">
          <label className="flex flex-col w-full">
            <p className="text-[#101518] dark:text-slate-200 text-sm font-medium leading-normal pb-2">Nombre completo</p>
            <div className="relative">
              <input 
                className={`flex w-full rounded-lg text-[#101518] dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#028ce8]/50 border ${errors.name ? 'border-red-500' : 'border-[#dae2e7] dark:border-slate-700'} bg-white dark:bg-slate-800 h-12 placeholder:text-[#5e7a8d] px-4 text-base font-normal transition-all`}
                placeholder="Juan Pérez" 
                type="text" 
                value={formData.name}
                onChange={(e) => { setFormData({...formData, name: e.target.value}); setErrors(prev => ({ ...prev, name: undefined })) }}
              />
            </div>
            {errors.name && <p className="text-xs text-red-500 mt-1 ml-1">{errors.name}</p>}
          </label>
        </div>

        {/* Email Field */}
        <div className="flex flex-col w-full">
          <label className="flex flex-col w-full">
            <p className="text-[#101518] dark:text-slate-200 text-sm font-medium leading-normal pb-2">Correo electrónico</p>
            <div className="relative">
              <input 
                className={`flex w-full rounded-lg text-[#101518] dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#028ce8]/50 border ${errors.email ? 'border-red-500' : 'border-[#dae2e7] dark:border-slate-700'} bg-white dark:bg-slate-800 h-12 placeholder:text-[#5e7a8d] px-4 text-base font-normal transition-all`}
                placeholder="nombre@empresa.com" 
                type="email" 
                value={formData.email}
                onChange={(e) => { setFormData({...formData, email: e.target.value}); setErrors(prev => ({ ...prev, email: undefined })) }}
              />
            </div>
            {errors.email && <p className="text-xs text-red-500 mt-1 ml-1">{errors.email}</p>}
          </label>
        </div>

        {/* Password Field */}
        <div className="flex flex-col w-full group">
          <p className="text-[#101518] dark:text-slate-200 text-sm font-medium leading-normal pb-2">Contraseña</p>
          <label className="flex flex-col w-full">
            <div className="relative">
              <input 
                className={`flex w-full rounded-lg text-[#101518] dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#028ce8]/50 border ${(errors.password || (formData.password.length > 0 && formData.password.length < 6)) ? 'border-red-500' : 'border-[#dae2e7] dark:border-slate-700'} bg-white dark:bg-slate-800 h-12 placeholder:text-[#5e7a8d] pl-4 pr-12 text-base font-normal transition-all`}
                placeholder="••••••••" 
                type={showPassword ? "text" : "password"} 
                value={formData.password}
                onChange={(e) => { setFormData({...formData, password: e.target.value}); setErrors(prev => ({ ...prev, password: undefined })) }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center size-8 rounded-md text-slate-400 hover:text-[#028ce8] transition-colors"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            {(errors.password || (formData.password.length > 0 && formData.password.length < 6)) && (
              <p className="text-xs text-red-500 mt-1 ml-1">
                {formData.password.length > 0 && formData.password.length < 6 
                  ? "La contraseña debe tener al menos 6 caracteres." 
                  : errors.password}
              </p>
            )}
          </label>
        </div>

        {/* Confirm Password Field */}
        <div className="flex flex-col w-full">
          <p className="text-[#101518] dark:text-slate-200 text-sm font-medium leading-normal pb-2">Confirmar contraseña</p>
          <label className="flex flex-col w-full">
            <div className="relative">
              <input 
                className={`flex w-full rounded-lg text-[#101518] dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#028ce8]/50 border ${(errors.confirmPassword || (formData.confirmPassword.length > 0 && formData.confirmPassword !== formData.password)) ? 'border-red-500' : 'border-[#dae2e7] dark:border-slate-700'} bg-white dark:bg-slate-800 h-12 placeholder:text-[#5e7a8d] pl-4 pr-12 text-base font-normal transition-all`}
                placeholder="••••••••" 
                type={showConfirmPassword ? "text" : "password"} 
                value={formData.confirmPassword}
                onChange={(e) => { setFormData({...formData, confirmPassword: e.target.value}); setErrors(prev => ({ ...prev, confirmPassword: undefined })) }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center size-8 rounded-md text-slate-400 hover:text-[#028ce8] transition-colors"
                aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showConfirmPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            {(errors.confirmPassword || (formData.confirmPassword.length > 0 && formData.confirmPassword !== formData.password)) && (
              <p className="text-xs text-red-500 mt-1 ml-1">
                {formData.confirmPassword.length > 0 && formData.confirmPassword !== formData.password 
                  ? "Las contraseñas no coinciden." 
                  : errors.confirmPassword}
              </p>
            )}
          </label>
        </div>

        {/* Sign Up Button */}
        <button 
          disabled={loading}
          className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-[#028ce8] text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-[#028ce8]/90 transition-all shadow-md shadow-[#028ce8]/20 mt-2 disabled:opacity-50" 
          type="submit"
        >
          <span className="truncate">{loading ? "Creando cuenta..." : "Crear cuenta"}</span>
        </button>

        <div className="text-center mt-2">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login" className="text-[#028ce8] font-medium hover:underline">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}