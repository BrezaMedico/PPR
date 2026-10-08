export default function Header() {
  return (
    <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <div>
          <h1 className="text-xl font-bold text-white">
            IoT Monitoring
          </h1>

          <p className="mt-1 text-sm text-gray-400">
            Dashboard Monitoring Sensor
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-green-400 shadow-[0_0_10px_#4ade80]" />

          <span className="text-sm font-medium text-green-400">
            Online
          </span>
        </div>
      </div>
    </header>
  );
}