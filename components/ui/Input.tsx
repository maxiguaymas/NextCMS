import { forwardRef } from "react";
import clsx from "clsx";

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={clsx(
          "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-white dark:focus:ring-white",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
