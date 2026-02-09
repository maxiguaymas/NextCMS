import { forwardRef } from "react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "danger" | "ghost";
type Size = "sm" | "md" | "lg";


interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-neutral-900",
          {
            primary:
              "bg-black text-white hover:bg-neutral-800 focus:ring-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200",
            secondary:
              "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-300 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700",
            danger:
              "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
            ghost:
              "bg-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-neutral-800",
          }[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export default Button;
