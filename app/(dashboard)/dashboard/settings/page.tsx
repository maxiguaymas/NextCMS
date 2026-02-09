'use client';

import React, { useState, useEffect, useRef } from "react";
import { getUserProfile, updateProfile, updatePassword } from "./actions";
import { useTheme } from "@/components/ThemeProvider";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setLoadingSaving] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  
  // Estados para contraseña
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { theme, setTheme } = useTheme();

  // Estado para el modal de notificación (Senior Pattern)
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'error';
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: 'success'
  });

  // Validaciones derivadas (Senior pattern: evita useEffect innecesarios)
  const isNewPasswordValid = newPassword.length >= 6;
  const passwordsMatch = newPassword === confirmPassword && confirmPassword !== "";
  const isFormValid = currentPassword.length > 0 && isNewPasswordValid && passwordsMatch;

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadData() {
      const data = await getUserProfile();
      if (data) {
        setUser(data);
        setName(data.name);
        setImage(data.image || "");
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await response.json();
      if (data.url) setImage(data.url);
    } catch (error) {
      console.error("Error subiendo avatar:", error);
    }
  };

  const handleSave = async () => {
    setLoadingSaving(true);
    const result = await updateProfile({ name, image });
    setLoadingSaving(false);
    
    if (result.success) {
      setModalConfig({ isOpen: true, title: "Perfil Actualizado", message: "Tus cambios se han guardado con éxito.", type: "success" });
    } else {
      setModalConfig({ isOpen: true, title: "Error", message: result.error || "Hubo un problema al actualizar tu perfil.", type: "error" });
    }
  };

  const handlePasswordSave = async () => {
    if (newPassword !== confirmPassword) {
      setModalConfig({ isOpen: true, title: "Error de Validación", message: "Las nuevas contraseñas no coinciden.", type: "error" });
      return;
    }
    if (newPassword.length < 6) {
      setModalConfig({ isOpen: true, title: "Contraseña Débil", message: "La contraseña debe tener al menos 6 caracteres.", type: "error" });
      return;
    }

    setLoadingSaving(true);
    const result = await updatePassword({ current: currentPassword, new: newPassword });
    setLoadingSaving(false);

    if (result.success) {
      setModalConfig({ isOpen: true, title: "¡Éxito!", message: "Tu contraseña ha sido actualizada correctamente.", type: "success" });
      setShowPasswordForm(false);
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } else {
      setModalConfig({ isOpen: true, title: "Error", message: result.error || "No se pudo actualizar la contraseña.", type: "error" });
    }
  };

  if (loading) return <div className="py-10 text-center text-sm text-zinc-500">Cargando configuración...</div>;

  return (
    <div className="relative space-y-12">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Configuración</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">Gestiona los ajustes de tu cuenta y preferencias.</p>
      </header>

      <div className="grid gap-10">
        {/* Sección de Perfil */}
        <section className="grid md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold tracking-tight">Perfil</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Actualiza tu información personal y foto de perfil.</p>
          </div>
          <div className="md:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm space-y-8">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="w-20 h-20 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-xl font-bold text-[#028ce8] overflow-hidden">
                  {image ? (
                    <img src={image} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    name.charAt(0).toUpperCase()
                  )}
                </div>
                <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} accept="image/*" className="hidden" />
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                Cambiar avatar
              </button>
            </div>
            
            <div className="grid gap-6">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Nombre Completo</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <label htmlFor="email" className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                value={user?.email || ""}
                readOnly
                className="w-full px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-500 cursor-not-allowed outline-none text-sm"
              />
            </div>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <button 
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-black text-sm font-bold rounded-full hover:opacity-90 transition-all active:scale-95 disabled:opacity-50"
              >
                {saving ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </div>
        </section>

        {/* Sección de Seguridad */}
        <section className="grid md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold tracking-tight">Seguridad</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Gestiona tu contraseña y la seguridad de la cuenta.</p>
          </div>
          <div className="md:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm">
            {!showPasswordForm ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">Contraseña</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Cambia tu contraseña para mantener tu cuenta segura.</p>
                </div>
                <button 
                  onClick={() => setShowPasswordForm(true)}
                  className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 text-xs font-bold rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
                >
                  Cambiar Contraseña
                </button>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Contraseña Actual</label>
                    <input 
                      type="password" 
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className={`w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-950 border rounded-xl text-sm outline-none transition-all focus:ring-2 ${
                        currentPassword 
                          ? 'border-emerald-500/50 focus:ring-emerald-500/20' 
                          : 'border-zinc-200 dark:border-zinc-800 focus:ring-blue-600'
                      }`}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Nueva Contraseña</label>
                    <input 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={`w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-950 border rounded-xl text-sm outline-none transition-all focus:ring-2 ${
                        newPassword 
                          ? (isNewPasswordValid ? 'border-emerald-500/50 focus:ring-emerald-500/20' : 'border-red-500/50 focus:ring-red-500/20') 
                          : 'border-zinc-200 dark:border-zinc-800 focus:ring-blue-600'
                      }`}
                    />
                    {newPassword && !isNewPasswordValid && (
                      <p className="text-[10px] text-red-500 font-medium animate-in fade-in duration-300">Mínimo 6 caracteres</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Confirmar Nueva Contraseña</label>
                    <input 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-950 border rounded-xl text-sm outline-none transition-all focus:ring-2 ${
                        confirmPassword 
                          ? (passwordsMatch ? 'border-emerald-500/50 focus:ring-emerald-500/20' : 'border-red-500/50 focus:ring-red-500/20') 
                          : 'border-zinc-200 dark:border-zinc-800 focus:ring-blue-600'
                      }`}
                    />
                    {confirmPassword && !passwordsMatch && (
                      <p className="text-[10px] text-red-500 font-medium animate-in fade-in duration-300">Las contraseñas no coinciden</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={handlePasswordSave} 
                    disabled={saving || !isFormValid} 
                    className="px-6 py-2 bg-zinc-900 dark:bg-white text-white dark:text-black text-xs font-bold rounded-full hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                  >
                    {saving ? "Actualizando..." : "Actualizar Contraseña"}
                  </button>
                  <button onClick={() => setShowPasswordForm(false)} className="px-6 py-2 text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Sección de Preferencias */}
        <section className="grid md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold tracking-tight">Preferencias</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Personaliza cómo se ve y se comporta NextCMS.</p>
          </div>
          <div className="md:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Tema</p>
                <p className="text-xs text-zinc-500 mt-0.5">Selecciona tu tema de interfaz preferido.</p>
              </div>
              <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
                <button 
                  onClick={() => setTheme('light')}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${theme === 'light' ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'}`}
                >
                  Claro
                </button>
                <button 
                  onClick={() => setTheme('dark')}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${theme === 'dark' ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'}`}
                >
                  Oscuro
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Modal de Notificación (Senior UI/UX) */}
      {modalConfig.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center gap-5">
              <div className={`size-14 rounded-full flex items-center justify-center ${
                modalConfig.type === 'success' ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600' : 'bg-red-100 dark:bg-red-500/10 text-red-600'
              }`}>
                <span className="material-symbols-outlined text-3xl">
                  {modalConfig.type === 'success' ? 'check_circle' : 'error'}
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{modalConfig.title}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{modalConfig.message}</p>
              </div>
              <button 
                onClick={() => setModalConfig({ ...modalConfig, isOpen: false })}
                className="w-full py-3 bg-zinc-900 dark:bg-white text-white dark:text-black text-sm font-bold rounded-2xl hover:opacity-90 transition-all active:scale-[0.98]"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}