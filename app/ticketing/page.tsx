/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/libs/firebase/config";
import AddProduct, { TicketProduct as AddTicketProduct, TicketVariant as AddTicketVariant } from "@/app/components/addons/addProduct";
import EditProduct, { TicketProduct as EditTicketProduct } from "@/app/components/addons/edit-product";

type TicketWithId = Omit<AddTicketProduct, "createdAt"> & {
  id: string;
  createdAt?: unknown;
};

const formatIDR = (n: number) => n.toLocaleString("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

const TicketingPage: React.FC = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [items, setItems] = useState<TicketWithId[]>([]);
  const [search, setSearch] = useState("");

  const [openEdit, setOpenEdit] = useState(false);
  const [editingProduct, setEditingProduct] = useState<EditTicketProduct | null>(null);

  const [deleting, setDeleting] = useState<{ open: boolean; id?: string; title?: string }>({
    open: false,
  });

  useEffect(() => {
    const q = query(collection(db, "ticketing_products"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const list: TicketWithId[] = snap.docs.map((d) => {
        const raw = d.data() as any;
        const variants: AddTicketVariant[] = Array.isArray(raw.variants)
          ? raw.variants.map((v: any) => ({
              variantId: v.variantId,
              destinationCity: v.destinationCity,
              price: Number(v.price ?? 0),
              active: !!v.active,
              ...(v.notes ? { notes: v.notes } : {}),
            }))
          : [];
        return {
          id: d.id,
          title: raw.title || "Tanpa Nama",
          operatorName: raw.operatorName || "-",
          originCity: raw.originCity || "-",
          busClass: raw.busClass || "Executive",
          status: (raw.status === "inactive" ? "inactive" : "active") as "active" | "inactive",
          seatsTotal: Number(raw.seatsTotal ?? 0),
          seatsAvailable: Number(raw.seatsAvailable ?? 0),
          variants,
          createdAt: raw.createdAt,
        };
      });
      setItems(list);
    });
    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    const kw = search.trim().toLowerCase();
    if (!kw) return items;
    return items.filter((x) => {
      const hay = `${x.title} ${x.operatorName} ${x.originCity} ${x.busClass} ${x.variants?.map((v) => v.destinationCity).join(" ")}`.toLowerCase();
      return hay.includes(kw);
    });
  }, [items, search]);

  const openEditFor = (p: TicketWithId) => {
    setEditingProduct({
      id: p.id,
      title: p.title,
      operatorName: p.operatorName,
      originCity: p.originCity,
      busClass: p.busClass,
      status: p.status,
      seatsTotal: p.seatsTotal,
      seatsAvailable: p.seatsAvailable,
      variants: p.variants as any,
      createdAt: p.createdAt,
    });
    setOpenEdit(true);
  };

  const confirmDelete = (p: TicketWithId) => setDeleting({ open: true, id: p.id, title: p.title });

  const doDelete = async () => {
    if (!deleting.id) return;
    const pid = deleting.id;
    try {
      // Optional: hapus subkoleksi variant_counters bila ada
      const subCol = collection(db, "ticketing_products", pid, "variant_counters");
      const subDocs = await getDocs(subCol);
      await Promise.all(subDocs.docs.map((sd) => deleteDoc(doc(db, "ticketing_products", pid, "variant_counters", sd.id))));
      await deleteDoc(doc(db, "ticketing_products", pid));
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting({ open: false });
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
      {/* Hero / Header */}
      <div className="rounded-3xl bg-gradient-to-r from-black to-gray-800 text-white p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Ticketing Bus</h1>
            <p className="text-sm text-white/70">Kelola produk multi-destinasi, kapasitas kursi, harga, dan status.</p>
          </div>
          <div className="block md:flex items-center gap-3">
            <input
              type="text"
              placeholder="Cari: operator, produk, destinasi, kelas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full lg:w-72 rounded-xl bg-white/10 text-white placeholder-white/70 px-3 py-2 outline-none focus:bg-white/15"
            />
            <button onClick={() => setOpenAdd(true)} className="rounded-xl bg-white text-black px-4 py-2 hover:bg-white/90 mt-3 md:mt-0">
              + Tambah Produk
            </button>
          </div>
        </div>
      </div>

      {/* Popups */}
      <AddProduct open={openAdd} onClose={() => setOpenAdd(false)} onCreated={() => {}} />
      <EditProduct open={openEdit} onClose={() => setOpenEdit(false)} product={editingProduct} onSaved={() => setOpenEdit(false)} />

      {/* ======= LIST VERTIKAL (ke bawah) ======= */}
      <div className="mt-6 space-y-5">
        {filtered.map((p) => {
          const priceMin = p.variants.length ? Math.min(...p.variants.filter((v) => v.active).map((v) => Number(v.price) || Infinity)) : 0;
          const isFullOrOff = p.seatsAvailable <= 0 || p.status !== "active";

          return (
            <article key={p.id} className="w-full rounded-2xl bg-white/80 backdrop-blur-xl shadow-xl p-5 hover:shadow-2xl transition-shadow">
              {/* ======= LAYOUT HORIZONTAL DI DALAM ARTICLE ======= */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                {/* KIRI: nama produk + meta */}
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold truncate">{p.title}</h3>
                  <div className="text-xs text-gray-600 mt-1">
                    <span className="font-medium">{p.operatorName}</span> • {p.originCity} • {p.busClass}
                  </div>
                  {/* chips destinasi */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.variants.length ? (
                      p.variants.map((v) => (
                        <span
                          key={v.variantId}
                          className={`px-3 py-1 rounded-full text-[12px] ${v.active ? "bg-black/5 text-gray-900" : "bg-gray-100 text-gray-500"}`}
                          title={`Harga: ${formatIDR(v.price)}${v.notes ? ` • ${v.notes}` : ""}`}
                        >
                          {p.originCity} → {v.destinationCity} • {formatIDR(v.price)}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">Belum ada destinasi.</span>
                    )}
                  </div>
                </div>

                {/* TENGAH: (opsional) info tambahan — biarkan kosong jika tak perlu */}
                <div className="flex-1" />

                {/* KANAN: status, harga mulai, kapasitas, aksi */}
                <div className="shrink-0 w-full md:w-auto">
                  <div className="flex items-center justify-between md:justify-end gap-2">
                    <span className={`text-[11px] px-2 py-1 rounded-full ${p.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>{p.status}</span>
                    <span className={`text-[11px] px-2 py-1 rounded-full ${isFullOrOff ? "bg-red-100 text-red-700" : "bg-blue-50 text-blue-700"}`}>
                      {p.seatsAvailable}/{p.seatsTotal} kursi
                    </span>
                  </div>

                  <div className="mt-3 text-right">
                    <div className="text-xs text-gray-600">Harga mulai</div>
                    <div className="text-sm font-semibold">{priceMin && priceMin !== Infinity ? formatIDR(priceMin) : "-"}</div>
                  </div>

                  <div className="mt-4 flex items-center justify-end gap-2">
                    <button onClick={() => openEditFor(p)} className="rounded-xl px-3 py-2 text-sm bg-black/5 hover:bg-black/10">
                      Edit
                    </button>
                    <button onClick={() => confirmDelete(p)} className="rounded-xl px-3 py-2 text-sm bg-red-600 text-white hover:bg-red-700">
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}

        {filtered.length === 0 && (
          <div className="mt-12 text-center text-gray-500">
            Belum ada produk. Klik <span className="font-semibold">+ Tambah Produk</span> untuk membuat.
          </div>
        )}
      </div>

      {/* Confirm Delete (tanpa border) */}
      {deleting.open && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <h4 className="text-lg font-semibold">Hapus Produk</h4>
            <p className="text-sm text-gray-600 mt-2">
              Hapus <b>{deleting.title}</b>? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button className="rounded-xl px-4 py-2 text-sm bg-black/5 hover:bg-black/10" onClick={() => setDeleting({ open: false })}>
                Batal
              </button>
              <button className="rounded-xl bg-red-600 text-white px-4 py-2 text-sm hover:bg-red-700" onClick={doDelete}>
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default TicketingPage;
