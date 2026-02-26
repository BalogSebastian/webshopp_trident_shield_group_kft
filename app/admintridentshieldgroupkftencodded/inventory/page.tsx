"use client";

import React, { useEffect, useState } from "react";

type SummaryRow = { sku: string; currentQty: number; avgCost: number; valuation: number; unit: string };

export default function InventoryPage() {
  const [rows, setRows] = useState<SummaryRow[]>([]);
  const [msg, setMsg] = useState<string>("");
  const [adjustSku, setAdjustSku] = useState<string>("");
  const [adjustQty, setAdjustQty] = useState<number>(0);

  const load = async () => {
    const res = await fetch("/api/inventory/summary");
    const json = await res.json();
    const data: SummaryRow[] = json.data || [];
    setTimeout(() => {
      setRows(data);
    }, 0);
  };

  useEffect(() => {
    load();
  }, []);

  const manualOut = async () => {
    if (!adjustSku || !adjustQty || adjustQty <= 0) return;
    const calc = await fetch("/api/inventory/fifo-calc", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sku: adjustSku, quantity: adjustQty }),
    });
    const cjson = await calc.json();
    if (!cjson.success) {
      setMsg(cjson.error || "Hiba");
      return;
    }
    const prodRes = await fetch("/api/products");
    const prods: Array<{ _id: string; sku?: string; name: string }> = await prodRes.json();
    const prod = prods.find((p) => p.sku === adjustSku);
    if (!prod) {
      setMsg("Nincs termék ehhez az SKU-hoz");
      return;
    }
    const payload = {
      transactionId: `ADJ-OUT-${adjustSku}-${Date.now()}`,
      productId: prod._id,
      saleDate: new Date().toISOString().split("T")[0],
      productName: prod.name,
      customerName: "Készlet korrekció",
      quantity: adjustQty,
      calculatedPurchaseUnitPrice: cjson.data.unitCost,
      totalPurchaseValue: cjson.data.totalCost,
      netUnitPrice: 0,
      profit: -cjson.data.totalCost,
      vatRate: 0,
      grossUnitPrice: 0,
      totalGrossPrice: 0,
    };
    const res = await fetch("/api/sales", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (json.success) {
      setMsg("Kivét rögzítve");
      setAdjustSku("");
      setAdjustQty(0);
      await load();
    } else {
      setMsg(json.error || "Hiba");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Készlet</h1>
          <p className="text-gray-500 text-sm">FIFO összesítő és korrekció</p>
        </div>
        <a href="/admintridentshieldgroupkftencodded" className="text-blue-600 font-bold">Vissza az Admin főoldalra</a>
      </div>

      <div className="max-w-7xl mx-auto px-8">
        {msg && <div className="mb-4 text-sm text-blue-700">{msg}</div>}

        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-8">
          <h2 className="text-xl font-black mb-4">Kézi kivét</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input placeholder="SKU" value={adjustSku} onChange={(e) => setAdjustSku(e.target.value)} className="border rounded px-3 py-2 text-sm" />
            <input type="number" placeholder="Mennyiség" value={adjustQty} onChange={(e) => setAdjustQty(Number(e.target.value))} className="border rounded px-3 py-2 text-sm" />
            <button onClick={manualOut} className="px-4 py-2 bg-blue-600 text-white rounded font-bold">Kivét rögzítése</button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-bold">SKU</th>
                <th className="px-3 py-2 text-right text-xs font-bold">Aktuális készlet</th>
                <th className="px-3 py-2 text-right text-xs font-bold">FIFO egységköltség</th>
                <th className="px-3 py-2 text-right text-xs font-bold">FIFO érték</th>
                <th className="px-3 py-2 text-center text-xs font-bold">M.e.</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.sku} className="hover:bg-blue-50">
                  <td className="px-3 py-2">{r.sku}</td>
                  <td className="px-3 py-2 text-right">{r.currentQty}</td>
                  <td className="px-3 py-2 text-right">{r.avgCost}</td>
                  <td className="px-3 py-2 text-right">{r.valuation}</td>
                  <td className="px-3 py-2 text-center">{r.unit}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td className="px-3 py-6 text-center text-gray-400" colSpan={5}>Nincs adat</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
