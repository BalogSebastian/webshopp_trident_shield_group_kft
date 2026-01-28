// app/managerepository/visibility/VisibilityClient.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Külön komponens egy sornak (hogy kezelje a saját állapotát)
function VisibilityRow({ product, onToggle }: any) {
  // Inicializálás: Ha nincs beállítva (régi termék), akkor true-nak vesszük
  const [isActive, setIsActive] = useState(product.isActive !== false);

  const handleToggle = async () => {
    const newState = !isActive;
    
    // 1. Azonnal átállítjuk a gombot (hogy gyorsnak érezd)
    setIsActive(newState);
    
    // 2. Elküldjük a szervernek a háttérben
    await onToggle(product._id, newState);
  };

  return (
    <div className={`flex items-center justify-between p-4 rounded-xl border mb-3 transition-all ${isActive ? 'bg-white border-gray-100 shadow-sm' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
       
       {/* Bal oldal: Termék infó */}
       <div className="flex items-center gap-4">
          {/* Státusz pötty */}
          <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-gray-300'}`}></div>
          
          {/* Kép */}
          <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden">
             {product.image && <img src={product.image} className={`w-full h-full object-cover ${isActive ? '' : 'grayscale'}`} alt="" />}
          </div>
          
          {/* Név */}
          <div>
             <h3 className="text-sm font-bold text-gray-900">{product.name}</h3>
             <p className="text-[10px] text-gray-400 uppercase tracking-wider">{product.category}</p>
          </div>
       </div>

       {/* Jobb oldal: Kapcsoló */}
       <div className="flex items-center gap-4">
          <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-green-600' : 'text-gray-400'}`}>
             {isActive ? 'Webshopon látható' : 'Rejtve'}
          </span>
          
          {/* A Kapcsoló Gomb */}
          <button 
            onClick={handleToggle} 
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${isActive ? 'bg-black' : 'bg-gray-300'}`}
          >
             <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 shadow-sm ${isActive ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
       </div>
    </div>
  );
}

// A Fő Komponens
export default function VisibilityClient({ initialProducts }: any) {
  const router = useRouter();

  // API hívás a frissítéshez
  const handleToggle = async (id: string, state: boolean) => {
    await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: state }),
    });
    // Nem frissítjük az oldalt (router.refresh), hogy ne villanjon a képernyő,
    // mert a VisibilityRow már helyben elintézte a kinézetet.
  };

  return (
    <>
      <header className="mb-8">
        <h2 className="text-3xl font-black uppercase tracking-tight text-gray-900">Megjelenés Kezelő</h2>
        <p className="text-gray-500 text-sm mt-2">Itt döntheted el, mely termékek látszódjanak a vásárlók számára.</p>
      </header>

      <div>
        {initialProducts.map((p: any) => (
          <VisibilityRow key={p._id} product={p} onToggle={handleToggle} />
        ))}
        
        {initialProducts.length === 0 && (
            <div className="text-center py-10 text-gray-400 uppercase text-xs tracking-widest">
                Nincs szerkeszthető termék.
            </div>
        )}
      </div>
    </>
  );
}