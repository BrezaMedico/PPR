const sensors = [
  {
    name: "SUHU",
    value: "28.5",
    unit: "°C",
    icon: "🌡️",
    description: "Temperatur ruangan",
  },
  {
    name: "LDR",
    value: "75",
    unit: "%",
    icon: "☀️",
    description: "Intensitas cahaya",
  },
  {
    name: "JARAK",
    value: "120",
    unit: "cm",
    icon: "📏",
    description: "Jarak objek",
  },
];

export default function SensorCards() {
  return (
    <section className="grid gap-5 md:grid-cols-3">
      {sensors.map((sensor) => (
        <div
          key={sensor.name}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/10"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium tracking-widest text-gray-400">
                {sensor.name}
              </p>

              <div className="mt-4 flex items-end gap-2">
                <span className="text-4xl font-bold text-white">
                  {sensor.value}
                </span>

                <span className="mb-1 text-lg text-gray-400">
                  {sensor.unit}
                </span>
              </div>
            </div>

            <div className="text-3xl">
              {sensor.icon}
            </div>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            {sensor.description}
          </p>
        </div>
      ))}
    </section>
  );
}