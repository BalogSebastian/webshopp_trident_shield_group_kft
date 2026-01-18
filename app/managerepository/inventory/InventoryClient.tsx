"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Ikonok
const SaveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v13a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;

function StockCard({ product, onUpdate, onDelete }: any) {
  const [stock, setStock] = useState<number | string>(product.stock ?? 0);
  const [isChanged, setIsChanged] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "") setStock("");
    else setStock(parseInt(val));
    setIsChanged(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const finalStock = stock === "" ? 0 : Number(stock);
    await onUpdate(product._id, { stock: finalStock });
    setStock(finalStock);
    setIsSaving(false);
    setIsChanged(false);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center justify-between group hover:border-blue-200 transition-all">
      <div className="flex items-center gap-4 flex-1">
        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden relative">
           {product.image && <img src={product.image} className="w-full h-full object-cover" />}
        </div>
        <div>
           <h3 className="text-sm font-bold text-gray-900">{product.name}</h3>
           <p className="text-[10px] text-gray-400 uppercase tracking-wider">{product.sku}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
         <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg p-1 pr-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <input type="number" value={stock} onChange={handleChange} className="w-16 bg-transparent text-right font-bold text-sm outline-none p-1" />
            <span className="text-[10px] text-gray-400 font-bold uppercase">db</span>
         </div>
         
         {isChanged && (
             <button onClick={handleSave} disabled={isSaving} className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-all shadow-md">
                {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <SaveIcon />}
             </button>
         )}

         <button onClick={() => onDelete(product._id)} className="text-gray-300 hover:text-red-500 transition-colors p-2">
            <TrashIcon />
         </button>
      </div>
    </div>
  );
}

export default function InventoryClient({ initialProducts }: any) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", category: "Tűzvédelem", price: 0, stock: 0, sku: "", image: "" });

  const handleUpdate = async (id: string, data: any) => {
    await fetch(`/api/products/${id}`, { method: "PUT", body: JSON.stringify(data) });
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Biztos törlöd?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    router.refresh();
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/products", { method: "POST", body: JSON.stringify(newProduct) });
    setIsModalOpen(false);
    setNewProduct({ name: "", category: "Tűzvédelem", price: 0, stock: 0, sku: "", image: "" });
    router.refresh();
  };

  return (
    <>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tight text-gray-900">Raktárkészlet</h2>
          <p className="text-gray-500 text-sm mt-2">Készlet darabszámok kezelése.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-black text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-500/30">
          + Új Termék
        </button>
      </div>

      <div className="space-y-3">
        {initialProducts.map((p: any) => (
          <StockCard key={p._id} product={p} onUpdate={handleUpdate} onDelete={handleDelete} />
        ))}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
           <div className="bg-white w-full max-w-lg p-8 rounded-3xl shadow-2xl relative">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-black">✕</button>
              <h2 className="text-2xl font-black uppercase mb-6">Új Termék</h2>
              <form onSubmit={handleAdd} className="space-y-4">
                  <input required placeholder="Termék neve" className="w-full p-3 bg-gray-50 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                  <div className="flex gap-4">
                    <input required placeholder="Cikkszám (SKU)" className="w-full p-3 bg-gray-50 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500" value={newProduct.sku} onChange={e => setNewProduct({...newProduct, sku: e.target.value})} />
                    <select className="w-full p-3 bg-gray-50 rounded-xl font-bold text-sm outline-none" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                        <option>Tűzvédelem</option><option>Munkaruha</option><option>Eszköz</option><option>Kiegészítő</option>
                    </select>
                  </div>
                  <div className="flex gap-4">
                     <input type="number" required placeholder="Ár" className="w-full p-3 bg-gray-50 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500" value={newProduct.price || ''} onChange={e => setNewProduct({...newProduct, price: parseInt(e.target.value)})} />
                     <input type="number" required placeholder="Készlet" className="w-full p-3 bg-gray-50 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500" value={newProduct.stock || ''} onChange={e => setNewProduct({...newProduct, stock: parseInt(e.target.value)})} />
                  </div>
                  <button className="w-full bg-black text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all">Hozzáadás</button>
              </form>
           </div>
        </div>
      )}
    </>
  );
}