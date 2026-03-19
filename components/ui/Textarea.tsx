import { forwardRef } from "react";
import clsx from "clsx";

type TextareaSize = "sm" | "md" | "lg";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: TextareaSize;
}

const sizeStyles: Record<TextareaSize, string> = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-3 text-sm",
  lg: "px-4 py-3 text-base",
};

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, size = "md", className, id, ...props }, ref) => {
    const textareaId = id || props.name;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-[var(--foreground)]"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={clsx(
            "w-full rounded-[var(--radius-md)] border bg-[var(--surface)] text-[var(--foreground)]",
            "placeholder:text-[var(--foreground-muted)]",
            "transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent",
            "resize-none",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--background-subtle)]",
            error
              ? "border-[var(--danger)] focus:ring-[var(--danger)]"
              : "border-[var(--border)]",
            sizeStyles[size],
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-[var(--danger)]">{error}</p>}
        {helperText && !error && (
          <p className="text-xs text-[var(--foreground-muted)]">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
