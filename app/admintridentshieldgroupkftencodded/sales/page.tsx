"use client";

import React, { useEffect, useMemo, useState } from "react";

type SaleForm = {
  transactionId: string;
  sku: string;
  saleDate: string;
  productName: string;
  customerName: string;
  quantity: number;
  netUnitPrice: number;
  vatRate: number;
  grossUnitPrice: number;
  totalGrossPrice: number;
  calculatedPurchaseUnitPrice: number;
  totalPurchaseValue: number;
  profit: number;
};

type SaleItem = {
  _id: string;
  transactionId: string;
  productId: string;
  saleDate: string;
  productName: string;
  customerName: string;
  quantity: number;
  netUnitPrice: number;
  vatRate: number;
  grossUnitPrice: number;
  totalGrossPrice: number;
  calculatedPurchaseUnitPrice: number;
  totalPurchaseValue: number;
  profit: number;
};

export default function SalesPage() {
  const [sales, setSales] = useState<SaleItem[]>([]);
  const [form, setForm] = useState<SaleForm>({
    transactionId: "",
    sku: "",
    saleDate: "",
    productName: "",
    customerName: "",
    quantity: 0,
    netUnitPrice: 0,
    vatRate: 27,
    grossUnitPrice: 0,
    totalGrossPrice: 0,
    calculatedPurchaseUnitPrice: 0,
    totalPurchaseValue: 0,
    profit: 0,
  });
  const [msg, setMsg] = useState<string>("");
  const grossCalc = useMemo(() => {
    const grossUnit = form.netUnitPrice * (1 + form.vatRate / 100);
    const totalGross = grossUnit * form.quantity;
    return { grossUnit, totalGross };
  }, [form.netUnitPrice, form.vatRate, form.quantity]);

  useEffect(() => {
    setForm((f) => ({
      ...f,
      grossUnitPrice: Math.round(grossCalc.grossUnit * 100) / 100,
      totalGrossPrice: Math.round(grossCalc.totalGross * 100) / 100,
    }));
  }, [grossCalc.grossUnit, grossCalc.totalGross]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await fetch("/api/sales");
    const json = await res.json();
    setSales(json.data || []);
  };

  const calcFifo = async () => {
    if (!form.sku || !form.quantity || form.quantity <= 0) return;
    const res = await fetch("/api/inventory/fifo-calc", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sku: form.sku, quantity: form.quantity }),
    });
    const json = await res.json();
    if (json.success) {
      const unit = json.data.unitCost;
      const total = json.data.totalCost;
      setForm((f) => ({
        ...f,
        calculatedPurchaseUnitPrice: unit,
        totalPurchaseValue: total,
        profit: Math.round((f.netUnitPrice * f.quantity - total) * 100) / 100,
      }));
      setMsg(json.data.shortage ? "Figyelem: készlethiány" : "");
    }
  };

  useEffect(() => {
    calcFifo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.sku, form.quantity]);

  const add = async () => {
    const prodRes = await fetch("/api/products");
    const prods: Array<{ _id: string; sku?: string; name: string }> = await prodRes.json();
    const prod = prods.find((p) => p.sku === form.sku);
    if (!prod) {
      setMsg("Nincs termék ehhez az SKU-hoz");
      return;
    }
    const payload = {
      transactionId: form.transactionId || `MAN-${form.sku}-${Date.now()}`,
      productId: prod._id,
      saleDate: form.saleDate,
      productName: form.productName || prod.name,
      customerName: form.customerName || "Ismeretlen",
      quantity: form.quantity,
      calculatedPurchaseUnitPrice: form.calculatedPurchaseUnitPrice,
      totalPurchaseValue: form.totalPurchaseValue,
      netUnitPrice: form.netUnitPrice,
      profit: form.profit,
      vatRate: form.vatRate,
      grossUnitPrice: form.grossUnitPrice,
      totalGrossPrice: form.totalGrossPrice,
    };
    const res = await fetch("/api/sales", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (json.success) {
      setMsg("Értékesítés hozzáadva");
      setForm({
        transactionId: "",
        sku: "",
        saleDate: "",
        productName: "",
        customerName: "",
        quantity: 0,
        netUnitPrice: 0,
        vatRate: 27,
        grossUnitPrice: 0,
        totalGrossPrice: 0,
        calculatedPurchaseUnitPrice: 0,
        totalPurchaseValue: 0,
        profit: 0,
      });
      await load();
    } else {
      setMsg(json.error || "Hiba");
    }
  };

  const remove = async (id: string) => {
    const res = await fetch(`/api/sales/${id}`, { method: "DELETE" });
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
          <h1 className="text-2xl font-black">Értékesítés</h1>
          <p className="text-gray-500 text-sm">FIFO kivét kezelése</p>
        </div>
        <a href="/admintridentshieldgroupkftencodded" className="text-blue-600 font-bold">Vissza az Admin főoldalra</a>
      </div>

      <div className="max-w-7xl mx-auto px-8">
        {msg && <div className="mb-4 text-sm text-blue-700">{msg}</div>}

        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-8">
          <h2 className="text-xl font-black mb-4">Új értékesítés</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="border rounded px-3 py-2 text-sm" />
            <input type="date" value={form.saleDate} onChange={(e) => setForm({ ...form, saleDate: e.target.value })} className="border rounded px-3 py-2 text-sm" />
            <input placeholder="Terméknév" value={form.productName} onChange={(e) => setForm({ ...form, productName: e.target.value })} className="border rounded px-3 py-2 text-sm" />
            <input placeholder="Vevő" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} className="border rounded px-3 py-2 text-sm" />
            <input type="number" placeholder="Mennyiség" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} className="border rounded px-3 py-2 text-sm" />
            <input type="number" placeholder="Nettó ár/db" value={form.netUnitPrice} onChange={(e) => setForm({ ...form, netUnitPrice: Number(e.target.value) })} className="border rounded px-3 py-2 text-sm" />
            <input type="number" placeholder="ÁFA %" value={form.vatRate} onChange={(e) => setForm({ ...form, vatRate: Number(e.target.value) })} className="border rounded px-3 py-2 text-sm" />
            <input type="number" placeholder="Bruttó ár/db" value={form.grossUnitPrice} onChange={(e) => setForm({ ...form, grossUnitPrice: Number(e.target.value) })} className="border rounded px-3 py-2 text-sm" />
            <input type="number" placeholder="Bruttó össz" value={form.totalGrossPrice} onChange={(e) => setForm({ ...form, totalGrossPrice: Number(e.target.value) })} className="border rounded px-3 py-2 text-sm" />
            <input type="number" placeholder="FIFO egységköltség" value={form.calculatedPurchaseUnitPrice} onChange={(e) => setForm({ ...form, calculatedPurchaseUnitPrice: Number(e.target.value) })} className="border rounded px-3 py-2 text-sm" />
            <input type="number" placeholder="FIFO összköltség" value={form.totalPurchaseValue} onChange={(e) => setForm({ ...form, totalPurchaseValue: Number(e.target.value) })} className="border rounded px-3 py-2 text-sm" />
            <input type="number" placeholder="Profit" value={form.profit} onChange={(e) => setForm({ ...form, profit: Number(e.target.value) })} className="border rounded px-3 py-2 text-sm" />
          </div>
          <div className="mt-4">
            <button onClick={add} className="px-4 py-2 bg-green-600 text-white rounded font-bold">Hozzáadás</button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-bold">Tranzakció</th>
                <th className="px-3 py-2 text-left text-xs font-bold">Dátum</th>
                <th className="px-3 py-2 text-left text-xs font-bold">Termék</th>
                <th className="px-3 py-2 text-left text-xs font-bold">Vevő</th>
                <th className="px-3 py-2 text-right text-xs font-bold">Mennyiség</th>
                <th className="px-3 py-2 text-right text-xs font-bold">Nettó ár/db</th>
                <th className="px-3 py-2 text-right text-xs font-bold">ÁFA %</th>
                <th className="px-3 py-2 text-right text-xs font-bold">FIFO egység</th>
                <th className="px-3 py-2 text-right text-xs font-bold">Profit</th>
                <th className="px-3 py-2 text-center text-xs font-bold">Művelet</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((s) => (
                <tr key={s._id} className="hover:bg-blue-50">
                  <td className="px-3 py-2">{s.transactionId}</td>
                  <td className="px-3 py-2">{new Date(s.saleDate).toISOString().split("T")[0]}</td>
                  <td className="px-3 py-2">{s.productName}</td>
                  <td className="px-3 py-2">{s.customerName}</td>
                  <td className="px-3 py-2 text-right">{s.quantity}</td>
                  <td className="px-3 py-2 text-right">{s.netUnitPrice}</td>
                  <td className="px-3 py-2 text-right">{s.vatRate}</td>
                  <td className="px-3 py-2 text-right">{s.calculatedPurchaseUnitPrice}</td>
                  <td className="px-3 py-2 text-right">{s.profit}</td>
                  <td className="px-3 py-2 text-center">
                    <button onClick={() => remove(s._id)} className="px-3 py-1 bg-red-600 text-white rounded text-xs">Törlés</button>
                  </td>
                </tr>
              ))}
              {sales.length === 0 && (
                <tr>
                  <td className="px-3 py-6 text-center text-gray-400" colSpan={10}>Nincs adat</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
