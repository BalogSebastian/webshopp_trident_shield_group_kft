// app/components/ProductList.tsx
import Link from "next/link";

export default function ProductList({ products }: { products: any[] }) {
  // Debuggolás: Nézd meg a böngésző konzolban (F12), hogy mi érkezik ide!
  console.log("Webshopba érkező termékek:", products);

  // Ellenőrzés: Ha undefined, null, vagy üres tömb
  if (!products || products.length === 0) {
    return (
      <section className="px-8 py-24 bg-white border-b border-gray-100 text-center">
        <h2 className="text-2xl font-black uppercase text-gray-300 mb-4">Jelenleg nincs elérhető termék.</h2>
        <p className="text-gray-400 text-sm">Nézz vissza később, vagy állítsd be a termékeket "Aktív"-ra az adminban.</p>
      </section>
    )
  }

  return (
    <section className="px-8 py-24 bg-white border-b border-gray-100">
      
      {/* Fejléc */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 pb-6 border-b border-gray-200">
        <div>
           <span className="text-xs font-bold text-blue-600 tracking-widest uppercase mb-2 block">Webshop</span>
           <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-black">Kiemelt Ajánlatok</h2>
        </div>
        <Link href="/products" className="hidden md:inline-block border-2 border-black px-8 py-3 text-xs font-bold uppercase hover:bg-black hover:text-white transition-all tracking-widest">Összes termék</Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {products.map((product) => (
          <div key={product._id} className="group cursor-pointer">
            
            <div className="relative w-full aspect-[4/5] bg-gray-100 overflow-hidden mb-6">
                {/* Elfogyott címke */}
                {product.stock <= 0 && (
                  <div className="absolute top-4 right-4 z-10 bg-red-600 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">ELFOGYOTT</div>
                )}

                <img 
                  src={product.image || "https://via.placeholder.com/400x500"} 
                  alt={product.name} 
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-in-out grayscale group-hover:grayscale-0"
                />
                
                {/* Kosárba gomb - Csak ha van készlet */}
                {product.stock > 0 && (
                   <div className="absolute bottom-0 left-0 w-full bg-blue-600 text-white py-4 text-center font-bold uppercase text-xs tracking-widest translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                     Kosárba teszem +
                   </div>
                )}
            </div>
            
            <div className="flex flex-col items-start">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{product.category}</span>
                <h3 className="text-xl font-black text-gray-900 uppercase leading-none mb-2 group-hover:text-blue-600 transition-colors">{product.name}</h3>
                <span className="font-mono font-bold text-lg">{product.price.toLocaleString()} Ft</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}