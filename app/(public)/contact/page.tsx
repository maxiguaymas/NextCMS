'use client';

import { useState } from "react";
import { sendContactForm } from "./actions";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { useForm } from "@/hooks/useForm";
import { contactSchema, ContactFormData } from "@/lib/schemas";

export default function ContactPage() {
  const [status, setStatus] = useState<{ success?: boolean; error?: string } | null>(null);
  
  const { values, errors, isSubmitting, handleChange, onSubmit } = useForm<ContactFormData>({
    schema: contactSchema,
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  const handleFormSubmit = async (data: ContactFormData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("subject", data.subject);
    formData.append("message", data.message);

    const result = await sendContactForm(formData);
    if (result.success) {
      setStatus({ success: true });
    } else {
      setStatus({ error: result.error || "Error al enviar el mensaje" });
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12 bg-[var(--background-subtle)]">
      <div className="w-full max-w-[550px]">
        <div className="text-center mb-10">
          <h1 className="text-[var(--foreground)] text-3xl md:text-4xl font-black tracking-tight mb-3">
            Contacto
          </h1>
          <p className="text-[var(--foreground-muted)]">
            ¿Tienes alguna duda? Envíanos un mensaje y te responderemos lo antes posible.
          </p>
        </div>

        {status?.success ? (
          <div className="bg-[var(--success-muted)] border border-[var(--success)]/20 rounded-[var(--radius-xl)] p-8 text-center animate-fade-in">
            <div className="size-16 bg-[var(--success)] text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="material-symbols-outlined text-3xl">check</span>
            </div>
            <h3 className="text-[var(--success)] font-bold text-xl mb-2">¡Mensaje enviado!</h3>
            <p className="text-[var(--foreground-muted)] text-sm">
              Gracias por contactarnos. Hemos recibido tu solicitud correctamente.
            </p>
            <button
              onClick={() => setStatus(null)}
              className="mt-6 text-sm font-bold text-[var(--primary)] hover:underline"
            >
              Enviar otro mensaje
            </button>
          </div>
        ) : (
          <div className="bg-[var(--surface)] p-8 rounded-[var(--radius-xl)] border border-[var(--border)] shadow-[var(--shadow-lg)]">
            <form onSubmit={onSubmit(handleFormSubmit)} className="flex flex-col gap-5">
              {status?.error && (
                <div className="p-3 text-sm text-[var(--danger)] bg-[var(--danger-muted)] rounded-[var(--radius-md)] border border-[var(--danger)]/20">
                  {status.error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label="Nombre"
                  name="name"
                  type="text"
                  placeholder="Ej. Juan Pérez"
                  value={values.name || ""}
                  onChange={(e) => handleChange("name", e.target.value)}
                  error={errors.name}
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={values.email || ""}
                  onChange={(e) => handleChange("email", e.target.value)}
                  error={errors.email}
                />
              </div>

              <Input
                label="Asunto"
                name="subject"
                type="text"
                placeholder="¿Cómo podemos ayudarte?"
                value={values.subject || ""}
                onChange={(e) => handleChange("subject", e.target.value)}
                error={errors.subject}
              />

              <Textarea
                label="Mensaje"
                name="message"
                rows={4}
                placeholder="Escribe tu mensaje aquí..."
                value={values.message || ""}
                onChange={(e) => handleChange("message", e.target.value)}
                error={errors.message}
              />

              <Button
                type="submit"
                isLoading={isSubmitting}
                loadingText="Enviando mensaje..."
                className="w-full mt-2"
                size="lg"
              >
                Enviar mensaje
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
