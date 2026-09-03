export default function App() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <section className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl sm:p-12">
        
        <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-2xl text-emerald-400">
          ✓
        </div>

        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-emerald-400">
          Bienvenido
        </p>

        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Portal de Monitoreo y Evaluación
        </h1>

        <p className="mt-5 max-w-xl text-lg leading-8 text-slate-400">
          Aplicación preparada para consultar, organizar y presentar
          información de monitoreo y evaluación.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <article className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
            <p className="text-sm text-slate-500">
              Estado
            </p>

            <p className="mt-2 text-lg font-semibold text-emerald-400">
              Aplicación activa
            </p>
          </article>

          <article className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
            <p className="text-sm text-slate-500">
              Módulo
            </p>

            <p className="mt-2 text-lg font-semibold">
              Monitoreo y Evaluación
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}