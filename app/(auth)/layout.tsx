import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#f5f7f8] dark:bg-[#0f1b23] font-sans min-h-screen flex flex-col transition-colors duration-300">
      {/* Top Navigation */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f0f3f5] dark:border-b-slate-800 px-6 md:px-10 py-4 bg-white dark:bg-[#0f1b23]">
        <Link href="/" className="flex items-center gap-4 text-[#101518] dark:text-white">
          <div className="size-6 text-[#028ce8]">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z" fill="currentColor"></path>
            </svg>
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">NextCMS</h2>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500 dark:text-slate-400 hidden sm:block">¿No tienes una cuenta?</span>
          <Link href="/register" className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#028ce8]/10 text-[#028ce8] text-sm font-bold leading-normal hover:bg-[#028ce8]/20 transition-colors">
            <span className="truncate">Registrarse</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        {children}
        
        {/* Support Info */}
        <div className="mt-8 text-center text-slate-500 dark:text-slate-400 text-sm">
          <p>Protocolo de seguridad activado. ¿Necesitas ayuda? <Link className="text-[#028ce8] hover:underline" href="#">Contactar soporte</Link></p>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="py-6 px-10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f1b23]">
        <div className="flex gap-6">
          <Link className="hover:text-[#028ce8]" href="#">Política de privacidad</Link>
          <Link className="hover:text-[#028ce8]" href="#">Términos de servicio</Link>
          <Link className="hover:text-[#028ce8]" href="#">Estado</Link>
        </div>
        <div>
          © {new Date().getFullYear()} NextCMS. All rights reserved.
        </div>
      </footer>
    </div>
  );
}