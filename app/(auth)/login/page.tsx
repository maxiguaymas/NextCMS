'use client';

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import InputPassword from "@/components/ui/InputPassword";
import { useForm } from "@/hooks/useForm";
import { loginSchema, LoginFormData } from "@/lib/schemas";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isVerified = searchParams.get("verified") === "true";
  const isRegistered = searchParams.get("registered") === "true";
  const isReset = searchParams.get("reset") === "true";

  const { values, errors, isSubmitting, handleChange, onSubmit: handleFormSubmit, setFieldError } = useForm<LoginFormData>({
    schema: loginSchema,
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (result?.error) {
      setFieldError("email", "Credenciales incorrectas o cuenta no verificada.");
    } else {
      // Usar window.location para evitar race condition con la cookie de sesión
      window.location.href = "/dashboard";
    }
  };

  return (
    <div className="w-full max-w-[440px] bg-[var(--surface)] p-8 rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] border border-[var(--border)]">
      <div className="mb-8 text-center">
        <h1 className="text-[var(--foreground)] tracking-tight text-[28px] font-bold leading-tight pb-2">
          Bienvenido de nuevo
        </h1>
        <p className="text-[var(--foreground-muted)] text-base font-normal">
          Ingresa a tu cuenta para gestionar tu contenido.
        </p>
      </div>

      {isVerified && (
        <div className="mb-6 p-4 bg-[var(--success-muted)] border border-[var(--success)]/20 rounded-[var(--radius-lg)] flex items-center gap-3 animate-fade-in">
          <span className="material-symbols-outlined text-[var(--success)]">verified</span>
          <p className="text-[var(--success)] text-sm font-medium">
            ¡Cuenta verificada con éxito! Ya puedes iniciar sesión.
          </p>
        </div>
      )}

      {isReset && (
        <div className="mb-6 p-4 bg-[var(--success-muted)] border border-[var(--success)]/20 rounded-[var(--radius-lg)] flex items-center gap-3 animate-fade-in">
          <span className="material-symbols-outlined text-[var(--success)]">lock_reset</span>
          <p className="text-[var(--success)] text-sm font-medium">
            Contraseña actualizada. Ya puedes iniciar sesión con tu nueva clave.
          </p>
        </div>
      )}

      {isRegistered && (
        <div className="mb-6 p-4 bg-[var(--primary-muted)] border border-[var(--primary)]/20 rounded-[var(--radius-lg)] flex items-center gap-3 animate-fade-in">
          <span className="material-symbols-outlined text-[var(--primary)]">mail</span>
          <p className="text-[var(--primary)] text-sm font-medium">
            ¡Registro exitoso! Por favor, revisa tu correo para verificar tu cuenta.
          </p>
        </div>
      )}

      <form className="flex flex-col gap-5" onSubmit={handleFormSubmit(onSubmit)}>
        <Input
          label="Correo electrónico"
          name="email"
          type="email"
          placeholder="nombre@empresa.com"
          value={values.email || ""}
          onChange={(e) => handleChange("email", e.target.value)}
          error={errors.email}
          autoComplete="email"
        />

        <InputPassword
          label="Contraseña"
          name="password"
          placeholder="••••••••"
          value={values.password || ""}
          onChange={(e) => handleChange("password", e.target.value)}
          error={errors.password}
          autoComplete="current-password"
        />

        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-sm text-[var(--primary)] font-medium hover:underline">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <Button type="submit" isLoading={isSubmitting} loadingText="Iniciando sesión..." className="w-full mt-2">
          Iniciar sesión
        </Button>

        <div className="text-center mt-2">
          <p className="text-sm text-[var(--foreground-muted)]">
            ¿No tienes una cuenta?{" "}
            <Link href="/register" className="text-[var(--primary)] font-medium hover:underline">
              Regístrate gratis
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
