import { forwardRef } from "react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "danger" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<Variant, string> = {
  primary: [
    "bg-[var(--primary)] text-[var(--primary-foreground)]",
    "hover:bg-[var(--primary-hover)]",
    "focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2",
    "disabled:opacity-50 disabled:cursor-not-allowed",
  ].join(" "),
  secondary: [
    "bg-[var(--background-subtle)] text-[var(--foreground)]",
    "border border-[var(--border)]",
    "hover:bg-[var(--border)] hover:border-[var(--border)]",
    "focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2",
    "dark:bg-[var(--surface)] dark:border-[var(--border)]",
    "dark:hover:bg-[var(--border)]",
    "disabled:opacity-50 disabled:cursor-not-allowed",
  ].join(" "),
  danger: [
    "bg-[var(--danger)] text-white",
    "hover:opacity-90",
    "focus-visible:ring-2 focus-visible:ring-[var(--danger)] focus-visible:ring-offset-2",
    "disabled:opacity-50 disabled:cursor-not-allowed",
  ].join(" "),
  ghost: [
    "bg-transparent text-[var(--foreground)]",
    "hover:bg-[var(--background-subtle)]",
    "dark:hover:bg-[var(--surface)]",
    "focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2",
    "disabled:opacity-50 disabled:cursor-not-allowed",
  ].join(" "),
};

const sizeStyles: Record<Size, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2.5",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      loadingText,
      leftIcon,
      rightIcon,
      className,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={clsx(
          "inline-flex items-center justify-center rounded-[var(--radius-md)] font-medium transition-all duration-200",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[var(--background)]",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <span className="size-4 border-2 border-current border-opacity-30 border-t-current rounded-full animate-spin" />
            <span>{loadingText || children}</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
