"use client";

import Link from "next/link";

type Product = { _id: string; name: string; category?: string; price: number; stock: number; image?: string; sku?: string };

export default function BestSellers({ products }: { products: Product[] }) {
  const sorted = [...products].sort((a, b) => (b.stock || 0) - (a.stock || 0)).slice(0, 6);
  return (
    <section className="px-8 py-16 bg-white">
      <div className="flex items-end justify-between mb-8">
        <div>
          <span className="text-xs font-bold text-blue-600 tracking-widest uppercase">Legnépszerűbb</span>
          <h2 className="text-4xl font-black uppercase tracking-tight">Top Ajánlatok</h2>
        </div>
        <Link href="/products" className="border-2 border-black px-6 py-3 text-xs font-bold uppercase hover:bg-black hover:text-white transition-all">Összes termék</Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sorted.map((p) => (
          <div key={p._id} className="group bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="h-40 bg-gray-100 flex items-center justify-center">
              <span className="text-5xl font-black text-gray-300">{p.name.slice(0,1)}</span>
            </div>
            <div className="p-5">
              <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">{p.category || "Termék"}</div>
              <h3 className="text-lg font-black">{p.name}</h3>
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm font-black">{p.price.toLocaleString("hu-HU")} Ft</div>
                <Link href="/products" className="bg-blue-600 text-white text-xs font-bold uppercase px-4 py-2 rounded-md">Megnézem</Link>
              </div>
              <div className="mt-2 text-xs text-gray-500">Készlet: {p.stock || 0} db</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
