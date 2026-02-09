"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { hasRole } from "@/lib/permissions";

type Role = "ADMIN" | "EDITOR" | "VIEWER";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    roles: ["ADMIN", "EDITOR", "VIEWER"] as Role[],
  },
  {
    name: "Content",
    href: "/content",
    roles: ["ADMIN", "EDITOR"] as Role[],
  },
  {
    name: "Users",
    href: "/users",
    roles: ["ADMIN"] as Role[],
  },
  {
    name: "Settings",
    href: "/settings",
    roles: ["ADMIN"] as Role[],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  return (
    <aside className="w-64 shrink-0 border-r border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hidden lg:flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-200 dark:border-neutral-800">
        <span className="text-lg font-bold tracking-tight">NextCMS</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigation.map((item) => {
          if (
            item.roles &&
            session?.user?.role &&
            !hasRole(session.user.role, item.roles)
          ) {
            return null;
          }

          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
          block rounded-md px-3 py-2 text-sm font-medium transition
          ${
            isActive
              ? "bg-gray-100 text-gray-900 dark:bg-neutral-800 dark:text-white"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-neutral-800 dark:hover:text-white"
          }
        `}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User footer (placeholder) */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-neutral-800">
        <p className="text-sm font-medium">{session?.user?.name ?? "User"}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {session?.user?.email}
        </p>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="text-xs text-gray-500 hover:underline"
      >
        Sign out
      </button>
    </aside>
  );
}
