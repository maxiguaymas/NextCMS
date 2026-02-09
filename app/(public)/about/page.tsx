export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="flex justify-center py-12 md:py-20 bg-white dark:bg-[#0f1b23]">
        <div className="max-w-[960px] flex-1 px-6 md:px-10">
          <div 
            className="flex min-h-[420px] flex-col gap-6 bg-cover bg-center bg-no-repeat rounded-xl items-center justify-center p-8 text-center"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.7) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuBnEn7JVME7cGZ2627rezTmVq_yFYcuxuO2MtTQ3UqunMw3WnlLUNhcHQrdjEnI2VslnZ3DU5QrBAfFYED8d9N_o5x6qjP12HZ5dxjTBa86gwHKuqKnSbiZPJi4so6WhLV7nL0Jui6-_G48m2AbX0HltDNaxA1F1pR-j4icvfXkStQVeUWvzNKOe9TdABX9Lwje_vAtjzo8ZsmOJzybmmMxzZcKlZ1dCASW-bDtFt3Xi2ukiyJkIthxNxBlZQkr3DSS0x3Ty3Mnzh0")`
            }}
          >
            <div className="flex flex-col gap-4 max-w-2xl">
              <span className="text-[#068ce5] font-bold tracking-widest uppercase text-xs">Nuestra Misión</span>
              <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] md:text-6xl">
                Empoderando a los equipos con precisión de nivel de desarrollador.
              </h1>
              <p className="text-gray-200 text-lg font-normal leading-relaxed md:text-xl">
                Creemos que la gestión de contenidos no debería ser un compromiso entre potencia y facilidad de uso. NextCMS está diseñado para el rendimiento, la seguridad y la escalabilidad.
              </p>
            </div>
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <button className="flex min-w-[180px] cursor-pointer items-center justify-center rounded-lg h-12 px-6 bg-[#068ce5] text-white text-base font-bold tracking-[0.015em] hover:opacity-90 transition-opacity">
                Únete al equipo
              </button>
              <button className="flex min-w-[180px] cursor-pointer items-center justify-center rounded-lg h-12 px-6 bg-white/10 backdrop-blur-md border border-white/20 text-white text-base font-bold tracking-[0.015em] hover:bg-white/20 transition-all">
                Lee nuestro manifiesto
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Why NextCMS Section */}
      <section className="flex flex-col items-center bg-white dark:bg-[#0f1b23] pb-20">
        <div className="max-w-[960px] w-full px-6 md:px-10">
          <div className="pt-10 pb-10">
            <h2 className="text-[#111518] dark:text-white text-3xl font-bold leading-tight tracking-tight">¿Por qué NextCMS?</h2>
            <div className="h-1 w-12 bg-[#068ce5] mt-4 rounded-full"></div>
          </div>
          
          <div className="flex flex-col gap-10">
            <p className="text-[#5f7a8c] dark:text-gray-400 text-lg font-normal leading-relaxed max-w-[720px]">
              NextCMS nació de la frustración de los equipos técnicos que luchaban con sistemas heredados. Construimos la plataforma que queríamos usar: una que respeta el flujo de trabajo del desarrollador mientras brinda a los editores las mejores herramientas que merecen.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-1 gap-4 rounded-xl border border-[#dbe2e6] dark:border-gray-800 bg-white dark:bg-gray-900/50 p-6 flex-col hover:shadow-lg transition-shadow">
                <div className="text-[#068ce5]">
                  <span className="material-symbols-outlined text-4xl">api</span>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-[#111518] dark:text-white text-lg font-bold">Arquitectura API-First</h3>
                  <p className="text-[#5f7a8c] dark:text-gray-400 text-sm font-normal leading-relaxed">
                    Conecta tu contenido a cualquier plataforma con nuestras robustas APIs GraphQL y REST. SDKs nativos para todos los frameworks principales.
                  </p>
                </div>
              </div>
              <div className="flex flex-1 gap-4 rounded-xl border border-[#dbe2e6] dark:border-gray-800 bg-white dark:bg-gray-900/50 p-6 flex-col hover:shadow-lg transition-shadow">
                <div className="text-[#068ce5]">
                  <span className="material-symbols-outlined text-4xl">account_tree</span>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-[#111518] dark:text-white text-lg font-bold">Flujos de trabajo basados en Git</h3>
                  <p className="text-[#5f7a8c] dark:text-gray-400 text-sm font-normal leading-relaxed">
                    Gestiona el control de versiones de contenido al igual que el código. Ramas, pull requests y entornos de prueba múltiples están integrados.
                  </p>
                </div>
              </div>
              <div className="flex flex-1 gap-4 rounded-xl border border-[#dbe2e6] dark:border-gray-800 bg-white dark:bg-gray-900/50 p-6 flex-col hover:shadow-lg transition-shadow">
                <div className="text-[#068ce5]">
                  <span className="material-symbols-outlined text-4xl">edit_note</span>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-[#111518] dark:text-white text-lg font-bold">Soporte para Markdown</h3>
                  <p className="text-[#5f7a8c] dark:text-gray-400 text-sm font-normal leading-relaxed">
                    Escribe de forma natural en Markdown o MDX. Incluye un potente motor de vista previa en tiempo real para la colaboración en vivo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="flex justify-center bg-[#f5f7f8] dark:bg-gray-900/20 py-16">
        <div className="max-w-[960px] flex-1 px-6 md:px-10 text-center items-center">
          <h2 className="text-[#111518] dark:text-white text-3xl font-bold leading-tight tracking-tight mb-6">Creado por desarrolladores para desarrolladores</h2>
          <p className="text-[#5f7a8c] dark:text-gray-400 text-lg leading-relaxed max-w-[680px] mx-auto mb-10">
            Nuestro equipo está formado por ingenieros que han escalado productos en las empresas tecnológicas líderes del mundo. Entendemos la complejidad de los ciclos de despliegue modernos.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full mt-4">
            {[
              { label: "SLA de tiempo de actividad", value: "99.9%" },
              { label: "Instalaciones activas", value: "50k+" },
              { label: "Soporte experto", value: "24/7" },
              { label: "Latencia de API global", value: "100ms" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-2">
                <span className="text-3xl font-black text-[#068ce5]">{stat.value}</span>
                <span className="text-sm font-medium text-[#111518] dark:text-gray-300">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}