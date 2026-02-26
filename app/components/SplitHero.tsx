import Link from "next/link";

export default function SplitHero() {
  return (
    <section className="w-full grid grid-cols-1 md:grid-cols-2">
      <div className="relative h-[280px] md:h-[420px] group">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/tuz2.jpg')" }}
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
        <div className="relative z-10 h-full p-8 flex flex-col justify-end">
          <span className="text-xs font-black uppercase tracking-widest text-blue-200">Ipari védőfelszerelés</span>
          <h3 className="text-white text-3xl md:text-4xl font-black uppercase tracking-tight">Maximális védelem</h3>
          <div className="mt-4 flex gap-3">
            <Link href="/products" className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-widest px-5 py-2 rounded-md">Vásárlás</Link>
            <Link href="/contact" className="bg-white text-black text-xs font-black uppercase tracking-widest px-5 py-2 rounded-md">Ajánlatkérés</Link>
          </div>
        </div>
      </div>
      <div className="relative h-[280px] md:h-[420px] group">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/tuz3.jpg')" }}
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
        <div className="relative z-10 h-full p-8 flex flex-col justify-end">
          <span className="text-xs font-black uppercase tracking-widest text-blue-200">Tűzvédelem</span>
          <h3 className="text-white text-3xl md:text-4xl font-black uppercase tracking-tight">Tanúsított eszközök</h3>
          <div className="mt-4 flex gap-3">
            <Link href="/products/Tűzvédelem" className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-widest px-5 py-2 rounded-md">Megnézem</Link>
            <Link href="/faq" className="bg-white text-black text-xs font-black uppercase tracking-widest px-5 py-2 rounded-md">GYIK</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
