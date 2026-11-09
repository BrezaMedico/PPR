export default function Loading() {
  return (
    <div
      className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6 backdrop-blur-xl animate-pulse"
      aria-label="Memuat data sensor"
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-6 w-48 rounded-md bg-white/10" />
          <div className="h-4 w-60 rounded-md bg-white/5" />
        </div>

        <div className="h-6 w-20 rounded-full bg-white/10" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((card) => (
          <div key={card} className="rounded-xl bg-black/20 p-5 space-y-3">
            <div className="h-4 w-14 rounded bg-white/10" />
            <div className="h-8 w-24 rounded bg-white/10" />
          </div>
        ))}
      </div>

      <div className="mt-5 border-t border-white/10 pt-4">
        <div className="h-4 w-52 rounded bg-white/5" />
      </div>
    </div>
  );
}
