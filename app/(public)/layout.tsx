import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ThemeToggle from "@/components/ThemeToggle";
import MobileMenu from "@/components/MobileMenu";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f8fafc] dark:bg-[#0f1b23] transition-colors duration-300">
      <header className="sticky top-0 z-50 w-full border-b border-[#e2e8f0] dark:border-slate-800 bg-white/90 dark:bg-[#0f1b23]/90 backdrop-blur-md px-6 md:px-20 lg:px-40 py-3">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between">
          <Link href="/" className="flex items-center gap-3 text-[#068ce5]">
            <div className="size-7">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z" fill="currentColor"></path>
              </svg>
            </div>
            <h1 className="text-[#0f172a] dark:text-white text-xl font-bold tracking-tight">NextCMS</h1>
          </Link>

          {/* Navegación de Escritorio */}
          <nav className="hidden md:flex items-center gap-8">
            <Link className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-[#068ce5] transition-colors" href="/posts">Publicaciones</Link>
            <Link className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-[#068ce5] transition-colors" href="/about">Nosotros</Link>
            <Link className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-[#068ce5] transition-colors" href="/contact">Contacto</Link>
            <ThemeToggle />
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700"></div>
            {session ? (
              <Link href="/dashboard" className="bg-[#068ce5] text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm shadow-[#068ce5]/20 hover:bg-[#068ce5]/90 transition-all flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">dashboard</span>
                Ir al Panel
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm font-semibold text-[#068ce5] hover:text-[#068ce5]/80 transition-colors">Iniciar sesión</Link>
                <Link href="/dashboard" className="bg-[#068ce5] text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm shadow-[#068ce5]/20 hover:bg-[#068ce5]/90 transition-all">
                  Empezar
                </Link>
              </>
            )}
          </nav>

          {/* Controles para Móvil */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <MobileMenu session={session} />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t border-[#e2e8f0] dark:border-slate-800 bg-white dark:bg-[#0f1b23] px-6 md:px-20 lg:px-40 py-12">
        <div className="mx-auto max-w-[1200px]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 text-[#068ce5] mb-4">
                <div className="size-5">
                  <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z" fill="currentColor"></path>
                  </svg>
                </div>
                <span className="font-bold text-[#0f172a] dark:text-white">NextCMS</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mb-6">
                Impulsando la infraestructura de contenido para los equipos de desarrollo más ambiciosos del mundo.
              </p>
            </div>
            <div>
              <h6 className="text-xs font-bold uppercase tracking-wider text-[#0f172a] dark:text-white mb-4">Explorar</h6>
              <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                <li><Link className="hover:text-[#068ce5] transition-colors" href="/about">Nosotros</Link></li>
                <li><Link className="hover:text-[#068ce5] transition-colors" href="/contact">Contacto</Link></li>
                <li><Link className="hover:text-[#068ce5] transition-colors" href="/posts">Publicaciones</Link></li>
              </ul>
            </div>
            <div>
              <h6 className="text-xs font-bold uppercase tracking-wider text-[#0f172a] dark:text-white mb-4">Legal</h6>
              <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                <li><Link className="hover:text-[#068ce5] transition-colors" href="/privacy">Privacidad</Link></li>
                <li><Link className="hover:text-[#068ce5] transition-colors" href="/terms">Términos</Link></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-slate-100 dark:border-slate-800">
            <p className="text-slate-400 text-xs">© {new Date().getFullYear()} NextCMS Inc. Todos los derechos reservados.</p>
            <div className="flex gap-4">
              <Link className="text-slate-400 hover:text-[#068ce5] transition-colors" href="#"><span className="material-symbols-outlined text-xl">account_tree</span></Link>
              <Link className="text-slate-400 hover:text-[#068ce5] transition-colors" href="#"><span className="material-symbols-outlined text-xl">share</span></Link>
              <Link className="text-slate-400 hover:text-[#068ce5] transition-colors" href="#"><span className="material-symbols-outlined text-xl">public</span></Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
