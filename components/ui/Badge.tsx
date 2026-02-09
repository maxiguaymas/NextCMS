import clsx from "clsx";

type Variant = "default" | "success" | "warning" | "danger";

interface BadgeProps {
  children: React.ReactNode;
  variant?: Variant;
}

export default function Badge({
  children,
  variant = "default",
}: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        {
          default:
            "bg-gray-100 text-gray-800 dark:bg-neutral-800 dark:text-gray-200",
          success:
            "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
          warning:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
          danger:
            "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        }[variant]
      )}
    >
      {children}
    </span>
  );
}
