export default function DeviceStatusSkeleton() {
  return (
    <div
      className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-6 backdrop-blur-xl animate-pulse"
      aria-label="Memuat status perangkat"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="space-y-2">
          <div className="h-5 w-56 rounded bg-white/10" />
          <div className="h-3 w-64 rounded bg-white/5" />
        </div>

        <div className="h-6 w-36 rounded-full bg-white/10" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="rounded-xl bg-black/20 p-4 space-y-2">
            <div className="h-3 w-20 rounded bg-white/5" />
            <div className="h-5 w-28 rounded bg-white/10" />
          </div>
        ))}
      </div>
    </div>
  );
}

