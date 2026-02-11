import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <span className="text-sm font-mono text-blue-600 mb-4">404 Error</span>
      <h1 className="text-4xl font-bold tracking-tight mb-4">Page not found</h1>
      <p className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-xs">Sorry, we couldn&apos;t find the page you&apos;re looking for.</p>
      <Link href="/" className="text-sm font-semibold hover:underline">
        ← Back to home
      </Link>
    </main>
  );
}
