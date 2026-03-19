import { useState, useCallback } from "react";
import { ZodSchema, ZodError } from "zod";

type DefaultValues<T> = Partial<Record<keyof T, string>>;

interface UseFormOptions<T> {
  schema: ZodSchema<T>;
  defaultValues: DefaultValues<T>;
}

interface UseFormReturn<T> {
  values: DefaultValues<T>;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isValid: boolean;
  handleChange: (name: keyof T, value: string) => void;
  setValue: (name: keyof T, value: string) => void;
  setFieldError: (name: string, error: string) => void;
  clearErrors: () => void;
  reset: () => void;
  onSubmit: (onValid: (data: T) => Promise<void>) => (e: React.FormEvent) => Promise<void>;
}

export function useForm<T>({ schema, defaultValues }: UseFormOptions<T>): UseFormReturn<T> {
  const [values, setValues] = useState<DefaultValues<T>>(defaultValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((name: keyof T, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name as string]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as string];
        return newErrors;
      });
    }
  }, [errors]);

  const setValue = useCallback((name: keyof T, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const setFieldError = useCallback((name: string, error: string) => {
    setErrors((prev) => ({ ...prev, [name]: error }));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const reset = useCallback(() => {
    setValues(defaultValues);
    setErrors({});
    setIsSubmitting(false);
  }, [defaultValues]);

  const onSubmit = useCallback((onValid: (data: T) => Promise<void>) => {
    return async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      setErrors({});

      try {
        const validated = schema.parse(values) as T;
        await onValid(validated);
      } catch (error) {
        if (error instanceof ZodError) {
          const fieldErrors: Record<string, string> = {};
          error.errors.forEach((err) => {
            const path = err.path.join(".");
            if (!fieldErrors[path]) {
              fieldErrors[path] = err.message;
            }
          });
          setErrors(fieldErrors);
        }
      } finally {
        setIsSubmitting(false);
      }
    };
  }, [schema, values]);

  return {
    values,
    errors,
    isSubmitting,
    isValid: Object.keys(errors).length === 0,
    handleChange,
    setValue,
    setFieldError,
    clearErrors,
    reset,
    onSubmit,
  };
}
