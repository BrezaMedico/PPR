import { connection } from "next/server";

async function getSensorData() {
  // Menandai request-time boundary secara eksplisit
  await connection();

  // Simulasi latensi streaming data sensor
  await new Promise((resolve) => {
    setTimeout(resolve, 5000);
  });

  // Nilai sensor dinamis berubah setiap request (Challenge 4)
  const tempRandom = +(27.0 + Math.random() * 3.0).toFixed(1);
  const lightRandom = Math.floor(70 + Math.random() * 20);
  const distanceRandom = Math.floor(100 + Math.random() * 40);

  return {
    temperature: tempRandom,
    light: lightRandom,
    distance: distanceRandom,
    status: "Normal",
  };
}

export default async function SensorData() {
  const data = await getSensorData();

  return (
    <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6 backdrop-blur-xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">
            Data Sensor Terbaru
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Data berhasil diterima dari server
          </p>
        </div>

        <span className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
          {data.status}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-black/20 p-5">
          <p className="text-sm text-gray-500">
            Suhu
          </p>

          <p className="mt-2 text-2xl font-bold text-white">
            {data.temperature}°C
          </p>
        </div>

        <div className="rounded-xl bg-black/20 p-5">
          <p className="text-sm text-gray-500">
            LDR
          </p>

          <p className="mt-2 text-2xl font-bold text-white">
            {data.light}%
          </p>
        </div>

        <div className="rounded-xl bg-black/20 p-5">
          <p className="text-sm text-gray-500">
            Jarak
          </p>

          <p className="mt-2 text-2xl font-bold text-white">
            {data.distance} cm
          </p>
        </div>
      </div>

      <div className="mt-5 border-t border-white/10 pt-4">
        <p className="text-xs text-gray-500">
          ✓ Data sensor berhasil diperbarui secara streaming
        </p>
      </div>
    </div>
  );
}
