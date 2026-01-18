"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// --- IKONOK ---
const Icons = {
  Trash: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 hover:text-red-600 transition-colors"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>,
  Save: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  Plus: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Eye: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>,
  EyeOff: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>,
};

// --- 1. TERMÉK KÁRTYA (Raktárkészlet fülhöz) ---
function StockCard({ product, onUpdate, onDelete }: any) {
  // JAVÍTVA: Biztosítjuk, hogy szám legyen, vagy üres string
  const [stock, setStock] = useState<number | string>(product.stock ?? 0);
  const [isChanged, setIsChanged] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "") {
      setStock("");
    } else {
      setStock(parseInt(val));
    }
    setIsChanged(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Ha üresen maradt, 0-t mentünk
    const finalStock = stock === "" ? 0 : Number(stock);
    await onUpdate(product._id, { stock: finalStock });
    
    setStock(finalStock);
    setIsSaving(false);
    setIsChanged(false);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex items-center justify-between gap-4 group">
      
      {/* Termék Infó */}
      <div className="flex items-center gap-4 flex-1">
        <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden shrink-0 relative">
           {product.image && <img src={product.image} className="w-full h-full object-cover" alt="" />}
           <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900 leading-tight">{product.name}</h3>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">{product.sku} • {product.category}</p>
        </div>
      </div>

      {/* Készlet Kezelő */}
      <div className="flex items-center gap-3 bg-gray-50 p-1 rounded-lg border border-gray-200 focus-within:border-blue-500 focus-within:bg-blue-50/30 transition-all relative">
         <span className="text-[10px] font-bold text-gray-400 uppercase pl-2">Db:</span>
         <input
            type="number"
            value={stock}
            onChange={handleChange}
            className="w-16 p-2 bg-transparent text-sm font-bold text-gray-900 outline-none text-right"
          />
          
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full pl-3">
             {isChanged && !isSaving && (
                <button onClick={handleSave} className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors animate-in fade-in zoom-in">
                   <Icons.Save />
                </button>
             )}
             {isSaving && <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>}
             {!isChanged && !isSaving && stock !== product.stock && <span className="text-green-500 text-xs font-bold">OK</span>}
          </div>
      </div>

      {/* Műveletek */}
      <div className="flex items-center gap-4 pl-4 border-l border-gray-100">
         <span className="text-sm font-bold font-mono">{product.price.toLocaleString()} Ft</span>
         <button onClick={() => onDelete(product._id)} className="p-2 hover:bg-red-50 rounded-full transition-colors" title="Törlés">
            <Icons.Trash />
         </button>
      </div>
    </div>
  );
}

// --- 2. TERMÉK SOR (Webshop Megjelenés fülhöz) ---
function VisibilityRow({ product, onToggleActive }: any) {
  // JAVÍTÁS: Csak inicializáljuk, nem szinkronizáljuk kényszeresen a useEffect-tel
  // Így nem "ugrik vissza", ha a szerver lassú.
  const [isActive, setIsActive] = useState(!!product.isActive);

  const handleToggle = async () => {
    const newState = !isActive;
    
    // 1. Azonnal átállítjuk a UI-t (Optimista update)
    setIsActive(newState);
    
    // 2. Elküldjük a szervernek
    await onToggleActive(product._id, newState);
  };

  return (
    <div className={`flex items-center justify-between p-4 rounded-xl border transition-all ${isActive ? 'bg-white border-gray-100 shadow-sm' : 'bg-gray-50 border-gray-100 opacity-75'}`}>
      
      {/* Termék Infó */}
      <div className="flex items-center gap-4 flex-1">
         <div className={`w-2 h-2 rounded-full shrink-0 ${isActive ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-gray-300'}`}></div>
         <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden shrink-0">
             {product.image && <img src={product.image} className={`w-full h-full object-cover ${isActive ? '' : 'grayscale'}`} alt="" />}
         </div>
         <div>
            <h3 className="text-sm font-bold text-gray-900">{product.name}</h3>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">{product.category}</span>
         </div>
      </div>

       {/* Modern Kapcsoló */}
      <div className="flex items-center gap-6">
         <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
            {isActive ? 'Megjelenik' : 'Rejtett'}
         </span>
         
         <button 
            onClick={handleToggle}
            className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${
                isActive ? "bg-blue-600" : "bg-gray-200"
            }`}
        >
            <span 
                className={`absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-300 shadow-sm flex items-center justify-center ${
                    isActive ? "translate-x-6" : "translate-x-0"
                }`}
            >
               {isActive ? <Icons.Eye /> : <Icons.EyeOff />}
            </span>
        </button>
      </div>
    </div>
  );
}

// --- FŐ DASHBOARD ---
export default function AdminDashboard({ initialOrders, initialProducts }: any) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("products");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", category: "Tűzvédelem", price: 0, stock: 0, sku: "", image: "" });

  const handleUpdate = async (id: string, data: any) => {
    await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Biztosan törölni szeretnéd?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    router.refresh();
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/products", { method: "POST", body: JSON.stringify(newProduct) });
    setIsModalOpen(false);
    setNewProduct({ name: "", category: "Tűzvédelem", price: 0, stock: 0, sku: "", image: "" });
    router.refresh();
  };

  const tabs = [
    { id: "orders", label: "Rendelések" },
    { id: "products", label: "Raktárkészlet" },
    { id: "visibility", label: "Webshop Megjelenés" },
  ];

  return (
    <div className="bg-white border border-gray-100 shadow-2xl rounded-2xl overflow-hidden min-h-[700px] flex flex-col">
      
      {/* --- FEJLÉC --- */}
      <div className="px-8 pt-8 pb-4 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
         
         <div className="flex gap-2 bg-gray-50/50 p-1 rounded-xl">
            {tabs.map(tab => (
               <button 
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`py-2.5 px-5 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${
                    activeTab === tab.id 
                       ? "bg-white text-blue-600 shadow-sm" 
                       : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                 }`}
               >
                 {tab.label}
               </button>
            ))}
         </div>

         {(activeTab === "products" || activeTab === "visibility") && (
           <button 
             onClick={() => setIsModalOpen(true)} 
             className="flex items-center gap-2 bg-black text-white text-xs font-black uppercase tracking-widest px-5 py-3 rounded-xl hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-600/20 transform hover:-translate-y-0.5"
           >
             <Icons.Plus />
             <span>Új Termék</span>
           </button>
         )}
      </div>

      {/* --- TARTALOM --- */}
      <div className="p-8 flex-1 bg-gray-50/30">
        
        {/* Rendelések */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
             <table className="w-full text-left">
                <thead className="text-[10px] uppercase font-black tracking-widest text-gray-400 bg-gray-50/50 border-b border-gray-100">
                  <tr><th className="py-4 pl-6">ID</th><th className="py-4">Vevő</th><th className="py-4">Termék</th><th className="py-4 text-center">Db</th><th className="py-4 text-right pr-6">Összeg</th></tr>
                </thead>
                <tbody className="text-sm font-bold text-gray-700 divide-y divide-gray-50">
                  {initialOrders.map((order: any) => (
                    <tr key={order._id} className="hover:bg-blue-50/20 transition-colors">
                      <td className="py-4 pl-6 font-mono text-blue-600 text-xs">{order.transactionId}</td><td>{order.customerName}</td><td>{order.productName}</td><td className="text-center">{order.quantity}</td><td className="text-right pr-6 font-mono">{order.totalPrice.toLocaleString()} Ft</td>
                    </tr>
                  ))}
                  {initialOrders.length === 0 && <tr><td colSpan={5} className="py-12 text-center text-gray-400 uppercase tracking-widest text-xs">Nincs aktív rendelés</td></tr>}
                </tbody>
             </table>
          </div>
        )}

        {/* Készlet */}
        {activeTab === "products" && (
          <div className="space-y-4">
            {initialProducts.map((product: any) => (
               <StockCard 
                 key={product._id} 
                 product={product} 
                 onUpdate={handleUpdate} 
                 onDelete={handleDelete} 
               />
            ))}
            {initialProducts.length === 0 && <div className="text-center py-12 text-gray-400 uppercase tracking-widest text-xs">A raktár üres</div>}
          </div>
        )}

        {/* Láthatóság */}
        {activeTab === "visibility" && (
          <div className="space-y-3 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            {initialProducts.map((product: any) => (
               <VisibilityRow 
                 key={product._id} 
                 product={product} 
                 onToggleActive={(id: string, state: boolean) => handleUpdate(id, { isActive: state })}
               />
            ))}
             {initialProducts.length === 0 && <div className="text-center py-6 text-gray-400 uppercase tracking-widest text-xs">Nincs megjeleníthető termék</div>}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
           <div className="bg-white w-full max-w-lg p-8 rounded-2xl shadow-2xl relative animate-in fade-in zoom-in duration-200 border border-gray-100">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-all">✕</button>
              <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Új Termék Felvétele</h2>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-8">Töltse ki az adatokat a raktárba vételhez.</p>
              
              <form onSubmit={handleAddProduct} className="flex flex-col gap-4">
                 <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Termék Neve</label>
                    <input required className="w-full border border-gray-200 bg-gray-50/50 p-3 rounded-xl text-sm font-bold outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-gray-300" placeholder="Pl. Prémium Porral Oltó" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                 </div>
                 
                 <div className="flex gap-4">
                    <div className="space-y-1 flex-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Cikkszám (SKU)</label>
                        <input required className="w-full border border-gray-200 bg-gray-50/50 p-3 rounded-xl text-sm font-bold outline-none focus:border-blue-500 focus:bg-white transition-all font-mono" placeholder="ABC-001" value={newProduct.sku} onChange={e => setNewProduct({...newProduct, sku: e.target.value})} />
                    </div>
                    <div className="space-y-1 flex-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Kategória</label>
                         <select className="w-full border border-gray-200 bg-gray-50/50 p-3 rounded-xl text-sm font-bold outline-none focus:border-blue-500 focus:bg-white transition-all"
                           value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                             <option>Tűzvédelem</option><option>Munkaruha</option><option>Eszköz</option><option>Tábla</option><option>Kiegészítő</option>
                        </select>
                    </div>
                 </div>

                 <div className="flex gap-4">
                    <div className="space-y-1 flex-1">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Bruttó Ár (Ft)</label>
                        <input type="number" required className="w-full border border-gray-200 bg-gray-50/50 p-3 rounded-xl text-sm font-bold outline-none focus:border-blue-500 focus:bg-white transition-all text-right font-mono" placeholder="0" value={newProduct.price || ''} onChange={e => setNewProduct({...newProduct, price: parseInt(e.target.value) || 0})} />
                    </div>
                    <div className="space-y-1 flex-1">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Kezdő Készlet (Db)</label>
                        <input type="number" required className="w-full border border-gray-200 bg-gray-50/50 p-3 rounded-xl text-sm font-bold outline-none focus:border-blue-500 focus:bg-white transition-all text-center" placeholder="0" value={newProduct.stock || ''} onChange={e => setNewProduct({...newProduct, stock: parseInt(e.target.value) || 0})} />
                    </div>
                 </div>
                 
                 <button className="bg-black text-white font-black uppercase tracking-widest py-4 rounded-xl mt-4 hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-600/20 flex items-center justify-center gap-2">
                    <Icons.Plus /> Hozzáadás a Raktárhoz
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}