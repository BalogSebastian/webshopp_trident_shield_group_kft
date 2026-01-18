import Link from "next/link";

export default function PromoSection() {
  return (
    <section className="flex flex-col md:flex-row w-full min-h-[600px]">
      {/* BAL OLDAL - SZÖVEG */}
      <div className="w-full md:w-1/2 bg-white flex flex-col justify-center px-8 md:px-20 py-16">
        <span className="text-gray-500 text-sm font-bold tracking-widest uppercase mb-4">
          Prémium Kollekció
        </span>
        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-6">
          EXTRÉM <br />
          HIDEG ELLEN
        </h2>
        <p className="text-gray-600 text-sm md:text-base mb-8 max-w-md leading-relaxed">
          Fedezze fel legújabb bélelt munkavédelmi kabátjainkat és thermo
          kiegészítőinket. Kifejezetten kültéri munkavégzéshez tervezve, 
          mínusz fokokban is garantált hőkomforttal.
        </p>
        
        {/* A kék gomb design a képről */}
        <Link href="#" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 w-fit flex items-center gap-2 transition-all">
          KOLLEKCIÓ MEGTEKINTÉSE <span>↗</span>
        </Link>
      </div>

      {/* JOBB OLDAL - KÉP */}
      <div className="w-full md:w-1/2 relative min-h-[400px]">
        {/* Munkavédelmi téli kép */}
        <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=1974&auto=format&fit=crop')" }}
        ></div>
      </div>
    </section>
  );
}