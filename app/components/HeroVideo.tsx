// app/components/HeroVideo.tsx
import Link from "next/link";

export default function HeroVideo() {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* HÁTTÉR VIDEÓ */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      >
        {/* Placeholder ipari videó (hegesztés/gyártás) */}
        <source src="https://assets.mixkit.co/videos/preview/mixkit-welder-working-in-a-metal-factory-with-sparks-flying-43863-large.mp4" type="video/mp4" />
      </video>

      {/* Sötét overlay, hogy olvasható legyen a szöveg */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>

      {/* TARTALOM */}
      <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-24 max-w-4xl">
        
        {/* Kék "badge" */}
        <div className="mb-6">
           <span className="bg-blue-700 text-white px-4 py-2 text-xs font-black uppercase tracking-[0.2em]">
             2026-os Szabványok
           </span>
        </div>

        {/* Főcím - Még nagyobb, még vastagabb */}
        <h1 className="text-6xl md:text-[7rem] font-black uppercase tracking-tighter leading-none mb-8 text-white">
          MAXIMÁLIS <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-white">VÉDELEM.</span>
          <br />
          MINIMÁLIS KOCKÁZAT.
        </h1>

        <p className="text-gray-300 text-lg md:text-xl mb-12 max-w-2xl leading-relaxed font-medium">
          Professzionális tűzvédelmi rendszerek és hitelesített munkavédelmi eszközök egy helyen. 
          Ne bízza a véletlenre vállalkozása biztonságát.
        </p>

        {/* Gombok */}
        <div className="flex flex-col md:flex-row gap-6">
            <Link href="/products" className="bg-blue-700 hover:bg-blue-600 text-white font-black py-5 px-12 uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]">
              Termékek Böngészése <span>↗</span>
            </Link>
            <Link href="/contact" className="border-2 border-white text-white font-black py-5 px-12 uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-all flex items-center justify-center">
              Ajánlatkérés Cégeknek
            </Link>
        </div>
      </div>
    </section>
  );
}