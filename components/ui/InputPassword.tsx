import { forwardRef, useState } from "react";
import clsx from "clsx";

type InputSize = "sm" | "md" | "lg";

interface InputPasswordProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: InputSize;
  showPasswordToggle?: boolean;
}

const sizeStyles: Record<InputSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-4 text-base",
};

const InputPassword = forwardRef<HTMLInputElement, InputPasswordProps>(
  ({ label, error, helperText, size = "md", showPasswordToggle = true, className, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || props.name;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[var(--foreground)]">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={showPassword ? "text" : "password"}
            className={clsx(
              "w-full rounded-[var(--radius-md)] border bg-[var(--surface)] text-[var(--foreground)]",
              "placeholder:text-[var(--foreground-muted)]",
              "transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--background-subtle)]",
              showPasswordToggle && "pr-10",
              error
                ? "border-[var(--danger)] focus:ring-[var(--danger)]"
                : "border-[var(--border)]",
              sizeStyles[size],
              className
            )}
            {...props}
          />
          {showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              <span className="material-symbols-outlined text-[20px]">
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          )}
        </div>
        {error && <p className="text-xs text-[var(--danger)]">{error}</p>}
        {helperText && !error && (
          <p className="text-xs text-[var(--foreground-muted)]">{helperText}</p>
        )}
      </div>
    );
  }
);

InputPassword.displayName = "InputPassword";

export default InputPassword;
