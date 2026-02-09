export default function PrivacyPage() {
  return (
    <div className="px-6 md:px-20 lg:px-40 py-20 bg-white dark:bg-[#0f1b23]">
      <div className="mx-auto max-w-[800px] prose dark:prose-invert">
        <h1 className="text-3xl font-bold mb-8">Política de Privacidad</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-6">Última actualización: {new Date().toLocaleDateString()}</p>
        
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">1. Información que recopilamos</h2>
          <p className="text-slate-600 dark:text-slate-300">
            En NextCMS, la privacidad de nuestros usuarios es nuestra prioridad. Recopilamos información básica como nombre y correo electrónico cuando te registras en nuestra plataforma o te suscribes a nuestro boletín.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">2. Uso de la información</h2>
          <p className="text-slate-600 dark:text-slate-300">
            Utilizamos la información recopilada para:
          </p>
          <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-2 mt-4">
            <li>Proporcionar y mantener nuestro servicio.</li>
            <li>Notificarte sobre cambios en nuestro sistema.</li>
            <li>Brindar soporte técnico y atención al cliente.</li>
            <li>Enviar actualizaciones técnicas y noticias relevantes.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">3. Seguridad de los datos</h2>
          <p className="text-slate-600 dark:text-slate-300">
            Implementamos medidas de seguridad de nivel industrial para proteger tu información personal. Sin embargo, recuerda que ningún método de transmisión por Internet es 100% seguro.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">4. Cookies</h2>
          <p className="text-slate-600 dark:text-slate-300">
            Utilizamos cookies para mejorar tu experiencia de navegación y recordar tus preferencias de tema (claro/oscuro). Puedes configurar tu navegador para rechazar todas las cookies, pero algunas partes de nuestro sitio podrían no funcionar correctamente.
          </p>
        </section>

        <div className="mt-12 p-6 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400">Si tienes dudas sobre esta política, contáctanos en privacidad@nextcms.com</p>
        </div>
      </div>
    </div>
  );
}