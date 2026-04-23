import { z } from "zod";

// Validaciones de contraseña
const passwordRequirements = {
  minLength: 6,
  hasUppercase: /[A-Z]/,
  hasNumber: /[0-9]/,
};

// Schema para validar contraseña con requisitos individuales
export const passwordSchema = z
  .string()
  .min(1, "La contraseña es requerida")
  .min(passwordRequirements.minLength, `La contraseña debe tener al menos ${passwordRequirements.minLength} caracteres`)
  .refine((pwd) => passwordRequirements.hasUppercase.test(pwd), {
    message: "Debe tener al menos una letra mayúscula",
  })
  .refine((pwd) => passwordRequirements.hasNumber.test(pwd), {
    message: "Debe tener al menos un número",
  });

export type PasswordFormData = z.infer<typeof passwordSchema>;

// Función para obtener requisitos de contraseña cumplidos
export const getPasswordStrength = (password: string) => {
  const checks = {
    length: password.length >= passwordRequirements.minLength,
    uppercase: passwordRequirements.hasUppercase.test(password),
    number: passwordRequirements.hasNumber.test(password),
  };
  
  const strength = Object.values(checks).filter(Boolean).length;
  
  return {
    checks,
    strength, // 0-3
    isValid: strength === 3,
  };
};

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El correo electrónico es requerido")
    .email("Formato de correo inválido"),
  password: z
    .string()
    .min(1, "La contraseña es requerida")
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "El nombre es requerido")
      .min(2, "El nombre debe tener al menos 2 caracteres"),
    email: z
      .string()
      .min(1, "El correo electrónico es requerido")
      .email("Formato de correo inválido"),
    password: z
      .string()
      .min(1, "La contraseña es requerida")
      .min(passwordRequirements.minLength, `La contraseña debe tener al menos ${passwordRequirements.minLength} caracteres`)
      .refine((pwd) => passwordRequirements.hasUppercase.test(pwd), {
        message: "Debe tener al menos una letra mayúscula",
      })
      .refine((pwd) => passwordRequirements.hasNumber.test(pwd), {
        message: "Debe tener al menos un número",
      }),
    confirmPassword: z.string().min(1, "Confirma tu contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export const contactSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z
    .string()
    .min(1, "El correo electrónico es requerido")
    .email("Formato de correo inválido"),
  subject: z.string().min(1, "El asunto es requerido").min(3, "El asunto debe tener al menos 3 caracteres"),
  message: z
    .string()
    .min(1, "El mensaje es requerido")
    .min(10, "El mensaje debe tener al menos 10 caracteres"),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "El correo electrónico es requerido")
    .email("Formato de correo inválido"),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "La contraseña es requerida")
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string().min(1, "Confirma tu contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
