// app/page.tsx
export default function Home() {
  return (
    <main className="sm:p-6 space-y-6">
      {/* Headline */}
      <div className="flex flex-col">
        <h1 className="text-2xl sm:text-3xl text-black font-semibold">Dashboard</h1>
        <p className="text-sm text-gray-500">Ringkasan singkat untuk Garuda Mas — statistik dan aktivitas terbaru.</p>
      </div>

      {/* Stats (cards putih, tanpa border) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-white p-5 shadow-md hover:shadow-lg transition-shadow">
          <div className="text-sm text-gray-500">Total Pesanan</div>
          <div className="mt-2 flex items-baseline gap-2">
            <div className="text-2xl font-bold">1,284</div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">+8%</span>
          </div>
          <div className="mt-3 h-2 rounded-full bg-gray-100">
            <div className="h-2 rounded-full bg-black w-3/5" />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-md hover:shadow-lg transition-shadow">
          <div className="text-sm text-gray-500">Pendapatan</div>
          <div className="mt-2 text-2xl font-bold">Rp 87.450.000</div>
          <div className="mt-3 h-2 rounded-full bg-gray-100">
            <div className="h-2 rounded-full bg-black w-2/3" />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-md hover:shadow-lg transition-shadow">
          <div className="text-sm text-gray-500">Tiket Baru</div>
          <div className="mt-2 text-2xl font-bold">42</div>
          <div className="mt-3 h-2 rounded-full bg-gray-100">
            <div className="h-2 rounded-full bg-black w-1/3" />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-md hover:shadow-lg transition-shadow">
          <div className="text-sm text-gray-500">Voucher Aktif</div>
          <div className="mt-2 text-2xl font-bold">13</div>
          <div className="mt-3 h-2 rounded-full bg-gray-100">
            <div className="h-2 rounded-full bg-black w-1/4" />
          </div>
        </div>
      </section>

      {/* Recent activity & table */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 rounded-2xl bg-white p-5 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Pesanan Terbaru</h2>
            <a href="/admin/pesanan" className="text-sm text-black/70 hover:underline">
              Lihat semua
            </a>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-gray-500">
                <tr>
                  <th className="py-2 pr-4">Order ID</th>
                  <th className="py-2 pr-4">Customer</th>
                  <th className="py-2 pr-4">Total</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {[
                  { id: "ORD-2301", name: "Andi", total: "Rp 1.250.000", status: "Diproses", date: "28 Agu 2025" },
                  { id: "ORD-2299", name: "Sinta", total: "Rp 780.000", status: "Selesai", date: "28 Agu 2025" },
                  { id: "ORD-2295", name: "Rudi", total: "Rp 2.100.000", status: "Belum Bayar", date: "27 Agu 2025" },
                ].map((row) => (
                  <tr key={row.id}>
                    <td className="py-3 pr-4 font-medium">{row.id}</td>
                    <td className="py-3 pr-4">{row.name}</td>
                    <td className="py-3 pr-4">{row.total}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={[
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs",
                          row.status === "Selesai" && "bg-green-100 text-green-700",
                          row.status === "Diproses" && "bg-amber-100 text-amber-700",
                          row.status === "Belum Bayar" && "bg-red-100 text-red-700",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3">{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-lg font-semibold">Aktivitas</h2>
          <ul className="mt-4 space-y-3">
            {[
              { t: "Voucher ‘MERDEKA45’ digunakan", time: "1 jam lalu" },
              { t: "Pesanan #ORD-2301 dibuat", time: "2 jam lalu" },
              { t: "Tiket bantuan baru oleh Sinta", time: "3 jam lalu" },
            ].map((a, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-black" />
                <div>
                  <p className="text-sm">{a.t}</p>
                  <p className="text-xs text-gray-500">{a.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
