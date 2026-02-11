export default function TermsPage() {
  return (
    <div className="px-6 md:px-20 lg:px-40 py-20 bg-white dark:bg-[#0f1b23]">
      <div className="mx-auto max-w-[800px] prose dark:prose-invert">
        <h1 className="text-3xl font-bold mb-8">Términos de Servicio</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-6">Vigente desde: {new Date().toLocaleDateString()}</p>
        
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">1. Aceptación de los términos</h2>
          <p className="text-slate-600 dark:text-slate-300">
            Al acceder y utilizar NextCMS, aceptas cumplir con estos términos de servicio y todas las leyes y regulaciones aplicables. Si no estás de acuerdo con alguno de estos términos, tienes prohibido utilizar este sitio.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">2. Licencia de uso</h2>
          <p className="text-slate-600 dark:text-slate-300">
            Se concede permiso para descargar temporalmente una copia de los materiales en NextCMS para visualización transitoria personal y no comercial solamente. Esta es la concesión de una licencia, no una transferencia de título.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">3. Descargo de responsabilidad</h2>
          <p className="text-slate-600 dark:text-slate-300 italic">
            Los materiales en NextCMS se proporcionan &quot;tal cual&quot;. NextCMS no ofrece garantías, expresas o implícitas, y por la presente renuncia y niega todas las demás garantías, incluyendo, sin limitación, las garantías implícitas o condiciones de comerciabilidad.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">4. Limitaciones</h2>
          <p className="text-slate-600 dark:text-slate-300">
            En ningún caso NextCMS o sus proveedores serán responsables de cualquier daño (incluyendo, sin limitación, daños por pérdida de datos o beneficios, o debido a la interrupción del negocio) que surja del uso o la imposibilidad de usar los materiales en NextCMS.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">5. Revisiones y erratas</h2>
          <p className="text-slate-600 dark:text-slate-300">
            Los materiales que aparecen en NextCMS podrían incluir errores técnicos, tipográficos o fotográficos. NextCMS no garantiza que ninguno de los materiales en su sitio web sea preciso, completo o actual.
          </p>
        </section>

        <div className="mt-12 border-t border-slate-200 dark:border-slate-800 pt-8">
          <p className="text-sm text-slate-500 dark:text-slate-400">NextCMS se reserva el derecho de revisar estos términos en cualquier momento sin previo aviso.</p>
        </div>
      </div>
    </div>
  );
}