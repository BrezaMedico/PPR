import { connection } from "next/server";

async function getDeviceStatus() {
  // Menandai request-time boundary secara eksplisit untuk PPR
  await connection();

  // Simulasi latensi pengecekan koneksi IoT (2 detik)
  await new Promise((resolve) => {
    setTimeout(resolve, 2000);
  });

  const now = new Date();
  const requestTime = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Jakarta",
  });

  return {
    nodeId: "ESP32-GATEWAY-01",
    ipAddress: "192.168.1.105",
    rssi: "-64 dBm (Sinyal Kuat)",
    battery: "98%",
    requestTime,
  };
}

export default async function DeviceStatus() {
  const status = await getDeviceStatus();

  return (
    <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-6 backdrop-blur-xl">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Status Perangkat & Konektivitas
          </h3>
          <p className="mt-1 text-sm text-gray-400">
            Dynamic Boundary Kedua (PPR Request-time Hole)
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1">
          <span className="h-2 w-2 rounded-full bg-indigo-400 animate-ping" />
          <span className="text-xs font-mono text-indigo-300">
            Request Time: {status.requestTime} WIB
          </span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-black/20 p-4">
          <p className="text-xs text-gray-500">ID Gateway</p>
          <p className="mt-1 font-mono text-sm font-semibold text-white">
            {status.nodeId}
          </p>
        </div>

        <div className="rounded-xl bg-black/20 p-4">
          <p className="text-xs text-gray-500">Alamat IP Gateway</p>
          <p className="mt-1 font-mono text-sm font-semibold text-cyan-400">
            {status.ipAddress}
          </p>
        </div>

        <div className="rounded-xl bg-black/20 p-4">
          <p className="text-xs text-gray-500">Kekuatan Sinyal WiFi</p>
          <p className="mt-1 text-sm font-semibold text-green-400">
            {status.rssi}
          </p>
        </div>

        <div className="rounded-xl bg-black/20 p-4">
          <p className="text-xs text-gray-500">Kapasitas Baterai</p>
          <p className="mt-1 text-sm font-semibold text-purple-400">
            {status.battery} (Optimal)
          </p>
        </div>
      </div>
    </div>
  );
}

