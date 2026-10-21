export default function Loading() {
  return (
    <div className="page-loading" role="status" aria-label="Abrindo o acervo">
      <span className="sr-only">Abrindo as páginas do acervo…</span>
      <div className="skeleton h-4 w-32" />
      <div className="skeleton h-14 w-3/4" />
      <div className="skeleton h-5 w-1/2" />
      <div className="grid sm:grid-cols-2 gap-6 mt-6">
        <div className="skeleton h-72" />
        <div className="skeleton h-72" />
      </div>
    </div>
  );
}
