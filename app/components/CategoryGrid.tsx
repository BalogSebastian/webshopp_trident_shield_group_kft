// app/components/CategoryGrid.tsx
import Link from "next/link";

const categories = [
  {
    id: 1,
    name: "TŰZVÉDELEM",
    description: "Porral oltók, tűztakarók és kiegészítők.",
    image: "https://images.unsplash.com/photo-1615707548590-b3dfd2a50156?q=80&w=1000&auto=format&fit=crop", // Tűzoltó készülékes kép
    link: "/products/fire-safety"
  },
  {
    id: 2,
    name: "VÉDŐRUHÁZAT",
    description: "Lángálló és jól láthatósági munkaruhák.",
    image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=2070&auto=format&fit=crop", // Ipari ruházatos kép
    link: "/products/workwear"
  },
  {
    id: 3,
    name: "LÉGZÉSVÉDELEM",
    description: "Félálarcok, teljes álarcok és szűrőbetétek.",
    image: "https://images.unsplash.com/photo-1584634731339-252c581abfc5?q=80&w=1000&auto=format&fit=crop", // Maszkos kép
    link: "/products/respiratory"
  }
];

export default function CategoryGrid() {
  return (
    <section className="py-24 px-4 bg-black">
      
      {/* Fejléc */}
      <div className="text-center mb-16">
         <span className="text-blue-500 text-sm font-black tracking-[0.3em] uppercase">
             Fedezze fel kínálatunkat
         </span>
         <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tight text-white mt-4">
             Kategóriák
         </h2>
      </div>

      {/* Grid - 3 oszlopos, látványos kártyák */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 max-w-[1600px] mx-auto">
        {categories.map((cat) => (
          <Link key={cat.id} href={cat.link} className="group relative h-[500px] overflow-hidden block">
            
            {/* Háttérkép - Hoverre ráközelít */}
            <div 
               className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0"
               style={{ backgroundImage: `url('${cat.image}')` }}
            ></div>
            
            {/* Sötét overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
            
            {/* Tartalom - Bal alsó sarokban */}
            <div className="absolute bottom-0 left-0 p-8 md:p-12">
               <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter mb-2 relative z-10">
                  {cat.name}
               </h3>
               <p className="text-gray-300 text-sm font-bold tracking-wider uppercase opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                  {cat.description} ↗
               </p>
               
               {/* Dekorációs vonal */}
               <div className="h-1 w-12 bg-blue-600 mt-4 transition-all duration-500 group-hover:w-full"></div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}