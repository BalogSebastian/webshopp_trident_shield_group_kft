"use client";

import React, { useEffect, useMemo, useState } from "react";

type PurchaseItem = {
  _id?: string;
  purchaseDate: string;
  supplierName: string;
  invoiceNumber: string;
  productName: string;
  sku?: string;
  quantity: number;
  unit: string;
  netUnitPrice: number;
  netTotalPrice: number;
  vatRate: number;
  grossTotalPrice: number;
};

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<PurchaseItem[]>([]);
  const [form, setForm] = useState<PurchaseItem>({
    purchaseDate: "",
    supplierName: "",
    invoiceNumber: "",
    productName: "",
    sku: "",
    quantity: 0,
    unit: "db",
    netUnitPrice: 0,
    netTotalPrice: 0,
    vatRate: 27,
    grossTotalPrice: 0,
  });
  const [msg, setMsg] = useState<string>("");
  const grossFromNet = useMemo(() => {
    const netTotal = form.netUnitPrice * form.quantity;
    const gross = netTotal * (1 + form.vatRate / 100);
    return { netTotal, gross };
  }, [form.netUnitPrice, form.quantity, form.vatRate]);

  const load = async () => {
    const res = await fetch("/api/purchases");
    const json = await res.json();
    const data: PurchaseItem[] = json.data || [];
    setTimeout(() => {
      setPurchases(data);
    }, 0);
  };

  useEffect(() => {
    load();
  }, []);

  // Származtatott mezők megjelenítése, állapot frissítés nélkül

  const add = async () => {
    const payload = {
      ...form,
      netTotalPrice: Math.round(grossFromNet.netTotal * 100) / 100,
      grossTotalPrice: Math.round(grossFromNet.gross * 100) / 100,
    };
    const res = await fetch("/api/purchases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (json.success) {
      setMsg("Beszerzés hozzáadva");
      setForm({
        purchaseDate: "",
        supplierName: "",
        invoiceNumber: "",
        productName: "",
        sku: "",
        quantity: 0,
        unit: "db",
        netUnitPrice: 0,
        netTotalPrice: 0,
        vatRate: 27,
        grossTotalPrice: 0,
      });
      await load();
    } else {
      setMsg(json.error || "Hiba");
    }
  };

  const update = async (id: string, item: PurchaseItem) => {
    const res = await fetch(`/api/purchases/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    const json = await res.json();
    if (json.success) {
      setMsg("Módosítva");
      await load();
    } else {
      setMsg(json.error || "Hiba");
    }
  };

  const remove = async (id: string) => {
    const res = await fetch(`/api/purchases/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.success) {
      setMsg("Törölve");
      await load();
    } else {
      setMsg(json.error || "Hiba");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Beszerzés</h1>
          <p className="text-gray-500 text-sm">FIFO bevét kezelése</p>
        </div>
        <a href="/admintridentshieldgroupkftencodded" className="text-blue-600 font-bold">Vissza az Admin főoldalra</a>
      </div>

      <div className="max-w-7xl mx-auto px-8">
        {msg && <div className="mb-4 text-sm text-blue-700">{msg}</div>}

        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-8">
          <h2 className="text-xl font-black mb-4">Új beszerzés</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input type="date" value={form.purchaseDate} onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })} className="border rounded px-3 py-2 text-sm" />
            <input placeholder="Beszállító" value={form.supplierName} onChange={(e) => setForm({ ...form, supplierName: e.target.value })} className="border rounded px-3 py-2 text-sm" />
            <input placeholder="Számla" value={form.invoiceNumber} onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })} className="border rounded px-3 py-2 text-sm" />
            <input placeholder="Terméknév" value={form.productName} onChange={(e) => setForm({ ...form, productName: e.target.value })} className="border rounded px-3 py-2 text-sm" />
            <input placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="border rounded px-3 py-2 text-sm" />
            <input type="number" placeholder="Mennyiség" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} className="border rounded px-3 py-2 text-sm" />
            <input placeholder="M.e." value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="border rounded px-3 py-2 text-sm" />
            <input type="number" placeholder="Nettó egységár" value={form.netUnitPrice} onChange={(e) => setForm({ ...form, netUnitPrice: Number(e.target.value) })} className="border rounded px-3 py-2 text-sm" />
            <input type="number" placeholder="ÁFA %" value={form.vatRate} onChange={(e) => setForm({ ...form, vatRate: Number(e.target.value) })} className="border rounded px-3 py-2 text-sm" />
            <input type="number" placeholder="Nettó össz" value={Math.round(grossFromNet.netTotal * 100) / 100} readOnly className="border rounded px-3 py-2 text-sm bg-gray-50" />
            <input type="number" placeholder="Bruttó össz" value={Math.round(grossFromNet.gross * 100) / 100} readOnly className="border rounded px-3 py-2 text-sm bg-gray-50" />
          </div>
          <div className="mt-4">
            <button onClick={add} className="px-4 py-2 bg-green-600 text-white rounded font-bold">Hozzáadás</button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-bold">Dátum</th>
                <th className="px-3 py-2 text-left text-xs font-bold">Beszállító</th>
                <th className="px-3 py-2 text-left text-xs font-bold">Számla</th>
                <th className="px-3 py-2 text-left text-xs font-bold">Termék</th>
                <th className="px-3 py-2 text-left text-xs font-bold">SKU</th>
                <th className="px-3 py-2 text-right text-xs font-bold">Mennyiség</th>
                <th className="px-3 py-2 text-left text-xs font-bold">M.e.</th>
                <th className="px-3 py-2 text-right text-xs font-bold">Nettó egységár</th>
                <th className="px-3 py-2 text-right text-xs font-bold">ÁFA %</th>
                <th className="px-3 py-2 text-right text-xs font-bold">Nettó össz</th>
                <th className="px-3 py-2 text-right text-xs font-bold">Bruttó össz</th>
                <th className="px-3 py-2 text-center text-xs font-bold">Művelet</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((p) => (
                <tr key={p._id} className="hover:bg-blue-50">
                  <td className="px-3 py-2"><input type="date" value={new Date(p.purchaseDate).toISOString().split("T")[0]} onChange={(e) => update(p._id!, { ...p, purchaseDate: e.target.value })} className="border rounded px-2 py-1 text-xs" /></td>
                  <td className="px-3 py-2"><input value={p.supplierName} onChange={(e) => update(p._id!, { ...p, supplierName: e.target.value })} className="border rounded px-2 py-1 text-xs" /></td>
                  <td className="px-3 py-2"><input value={p.invoiceNumber} onChange={(e) => update(p._id!, { ...p, invoiceNumber: e.target.value })} className="border rounded px-2 py-1 text-xs" /></td>
                  <td className="px-3 py-2"><input value={p.productName} onChange={(e) => update(p._id!, { ...p, productName: e.target.value })} className="border rounded px-2 py-1 text-xs" /></td>
                  <td className="px-3 py-2"><input value={p.sku || ""} onChange={(e) => update(p._id!, { ...p, sku: e.target.value })} className="border rounded px-2 py-1 text-xs" /></td>
                  <td className="px-3 py-2 text-right"><input type="number" value={p.quantity} onChange={(e) => update(p._id!, { ...p, quantity: Number(e.target.value) })} className="border rounded px-2 py-1 text-xs text-right" /></td>
                  <td className="px-3 py-2"><input value={p.unit} onChange={(e) => update(p._id!, { ...p, unit: e.target.value })} className="border rounded px-2 py-1 text-xs" /></td>
                  <td className="px-3 py-2 text-right"><input type="number" value={p.netUnitPrice} onChange={(e) => update(p._id!, { ...p, netUnitPrice: Number(e.target.value) })} className="border rounded px-2 py-1 text-xs text-right" /></td>
                  <td className="px-3 py-2 text-right"><input type="number" value={p.vatRate} onChange={(e) => update(p._id!, { ...p, vatRate: Number(e.target.value) })} className="border rounded px-2 py-1 text-xs text-right" /></td>
                  <td className="px-3 py-2 text-right"><input type="number" value={p.netTotalPrice} onChange={(e) => update(p._id!, { ...p, netTotalPrice: Number(e.target.value) })} className="border rounded px-2 py-1 text-xs text-right" /></td>
                  <td className="px-3 py-2 text-right"><input type="number" value={p.grossTotalPrice} onChange={(e) => update(p._id!, { ...p, grossTotalPrice: Number(e.target.value) })} className="border rounded px-2 py-1 text-xs text-right" /></td>
                  <td className="px-3 py-2 text-center"><button onClick={() => remove(p._id!)} className="px-3 py-1 bg-red-600 text-white rounded text-xs">Törlés</button></td>
                </tr>
              ))}
              {purchases.length === 0 && (
                <tr>
                  <td className="px-3 py-6 text-center text-gray-400" colSpan={12}>Nincs adat</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
