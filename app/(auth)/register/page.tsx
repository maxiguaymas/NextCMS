'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "./actions";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import InputPassword from "@/components/ui/InputPassword";
import PasswordStrengthMeter from "@/components/ui/PasswordStrengthMeter";
import PasswordMatchIndicator from "@/components/ui/PasswordMatchIndicator";
import { useForm } from "@/hooks/useForm";
import { registerSchema, RegisterFormData } from "@/lib/schemas";

export default function RegisterPage() {
  const router = useRouter();

  const { values, errors, isSubmitting, handleChange, onSubmit: handleFormSubmit, setFieldError } = useForm<RegisterFormData>({
    schema: registerSchema,
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: RegisterFormData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);

    const result = await registerUser(formData);

    if (result.success) {
      // Usar window.location para evitar race condition
      window.location.href = "/login?registered=true";
    } else {
      setFieldError("email", result.error || "Error al registrar el usuario.");
    }
  };

  return (
    <div className="w-full max-w-[440px] bg-[var(--surface)] p-8 rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] border border-[var(--border)]">
      <div className="mb-8">
        <h1 className="text-[var(--foreground)] tracking-tight text-[28px] font-bold leading-tight text-center pb-2">
          Crear una cuenta
        </h1>
        <p className="text-[var(--foreground-muted)] text-base font-normal leading-normal text-center">
          Únete a NextCMS y comienza a gestionar tu contenido.
        </p>
      </div>

      <form className="flex flex-col gap-5" onSubmit={handleFormSubmit(onSubmit)}>
        <Input
          label="Nombre completo"
          name="name"
          type="text"
          placeholder="Juan Pérez"
          value={values.name || ""}
          onChange={(e) => handleChange("name", e.target.value)}
          error={errors.name}
          autoComplete="name"
        />

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

        <div className="flex flex-col gap-1.5">
          <InputPassword
            label="Contraseña"
            name="password"
            placeholder="••••••••"
            value={values.password || ""}
            onChange={(e) => handleChange("password", e.target.value)}
            error={errors.password}
            autoComplete="new-password"
          />
          {/* Barra de progreso de contraseña */}
          <PasswordStrengthMeter password={values.password || ""} showLabels />
        </div>

        <div className="flex flex-col gap-1.5">
          <InputPassword
            label="Confirmar contraseña"
            name="confirmPassword"
            placeholder="••••••••"
            value={values.confirmPassword || ""}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            error={errors.confirmPassword}
            autoComplete="new-password"
          />
          {/* Indicador de coincidencia */}
          <PasswordMatchIndicator
            password={values.password || ""}
            confirmPassword={values.confirmPassword || ""}
          />
        </div>

        <Button type="submit" isLoading={isSubmitting} loadingText="Creando cuenta..." className="w-full mt-2">
          Crear cuenta
        </Button>

        <div className="text-center mt-2">
          <p className="text-sm text-[var(--foreground-muted)]">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login" className="text-[var(--primary)] font-medium hover:underline">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}