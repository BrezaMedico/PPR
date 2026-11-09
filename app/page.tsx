import { Suspense } from "react";

import Header from "./components/Header";
import SensorCards from "./components/SensorCards";
import SensorData from "./components/SensorData";
import Loading from "./components/Loading";
import DeviceStatus from "./components/DeviceStatus";
import DeviceStatusSkeleton from "./components/DeviceStatusSkeleton";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <Header />

      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* HERO (STATIC SHELL) */}
        <section className="mb-10">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.3em] text-cyan-400">
            IoT Dashboard
          </p>

          <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
            Monitoring Sensor
          </h2>

          <p className="mt-4 max-w-2xl text-gray-400">
            Pantau kondisi sensor secara real-time dengan
            sistem Partial Prerendering pada Next.js.
          </p>
        </section>

        {/* STATIC SENSOR CARDS (STATIC SHELL) */}
        <section>
          <div className="mb-5">
            <h3 className="text-xl font-semibold">
              Ringkasan Sensor
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Informasi monitoring perangkat (4 Sensor)
            </p>
          </div>

          <SensorCards />
        </section>

        {/* DYNAMIC HOLE 1: SENSOR DATA */}
        <section className="mt-8">
          <Suspense fallback={<Loading />}>
            <SensorData />
          </Suspense>
        </section>

        {/* DYNAMIC HOLE 2: DEVICE STATUS */}
        <section className="mt-8">
          <Suspense fallback={<DeviceStatusSkeleton />}>
            <DeviceStatus />
          </Suspense>
        </section>

        {/* ACTIVITY (STATIC SHELL) */}
        <section className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <h3 className="text-lg font-semibold text-white">
            Aktivitas Terbaru
          </h3>

          <div className="mt-5 space-y-4">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-green-400" />

              <div>
                <p className="text-sm text-gray-300">
                  Sensor berhasil terhubung
                </p>

                <p className="text-xs text-gray-600">
                  Baru saja
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />

              <div>
                <p className="text-sm text-gray-300">
                  Data sensor diperbarui
                </p>

                <p className="text-xs text-gray-600">
                  Beberapa saat yang lalu
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-purple-400" />

              <div>
                <p className="text-sm text-gray-300">
                  Sistem monitoring aktif
                </p>

                <p className="text-xs text-gray-600">
                  Hari ini
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* FOOTER (STATIC SHELL) */}
      <footer className="border-t border-white/10 py-6 text-center">
        <p className="text-xs text-gray-600">
          IoT Monitoring Dashboard • Next.js + PPR
        </p>
      </footer>
    </main>
  );
}
