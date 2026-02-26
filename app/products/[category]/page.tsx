"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Product = { _id: string; name: string; category?: string; price: number; stock: number; image?: string; sku?: string; isActive?: boolean };

export default function ProductsByCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const [category, setCategory] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      const p = await params;
      setCategory(decodeURIComponent(p.category));
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data || []);
    })();
  }, [params]);

  const filtered = useMemo(() => {
    let arr = products.filter((p) => (p.isActive !== false) && p.category === category);
    if (q.trim()) {
      const s = q.toLowerCase();
      arr = arr.filter((p) => p.name.toLowerCase().includes(s) || (p.sku || "").toLowerCase().includes(s));
    }
    return arr;
  }, [products, q, category]);

  return (
    <div className="min-h-screen bg-white">
      <nav className="w-full h-[90px] flex items-center justify-between px-8 bg-white text-black border-b border-gray-100">
        <div className="text-2xl font-black tracking-tighter uppercase">
          <Link href="/">MUNKAVÉDELEM<span className="text-blue-600">.</span></Link>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <Link href="/contact" className="text-sm font-black uppercase tracking-widest hover:text-blue-600">Kapcsolat</Link>
          <Link href="/faq" className="text-sm font-black uppercase tracking-widest hover:text-blue-600">GYIK</Link>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-8 py-10">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Webshop</span>
            <h1 className="text-4xl font-black uppercase tracking-tight">{category}</h1>
          </div>
          <div className="flex items-center gap-3">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Keresés..." className="border border-gray-300 rounded-md px-3 py-2 text-sm" />
            <Link href="/products" className="border border-gray-300 rounded-md px-3 py-2 text-xs font-bold uppercase">Összes termék</Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filtered.map((p) => (
            <div key={p._id} className="group bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="h-44 bg-gray-100 flex items-center justify-center">
                <span className="text-5xl font-black text-gray-300">{p.name.slice(0,1)}</span>
              </div>
              <div className="p-5">
                <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">{p.category || "Termék"}</div>
                <h3 className="text-lg font-black">{p.name}</h3>
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm font-black">{p.price.toLocaleString("hu-HU")} Ft</div>
                  <Link href="/" className="bg-blue-600 text-white text-xs font-bold uppercase px-4 py-2 rounded-md">Megnézem</Link>
                </div>
                <div className="mt-2 text-xs text-gray-500">Készlet: {p.stock || 0} db</div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-3 text-center text-gray-400 text-xs uppercase tracking-widest py-20">
              Nincs találat
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
