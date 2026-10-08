export default function Loading() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
      <div className="flex flex-col items-center justify-center py-10">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-cyan-400" />

        <p className="mt-5 text-sm text-gray-400">
          Mengambil data sensor...
        </p>

        <p className="mt-1 text-xs text-gray-600">
          Server sedang memproses data
        </p>
      </div>
    </div>
  );
}