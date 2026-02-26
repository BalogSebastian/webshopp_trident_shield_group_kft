import Link from "next/link";

export default function BannerGrid() {
  const items = [
    {
      title: "Tűzoltó Berendezések",
      desc: "Porral oltók, tűztakarók, professzionális megoldások.",
      href: `/products/${encodeURIComponent("Tűzvédelem")}`,
      image: "url('/tuz1.jpg')",
    },
    {
      title: "Biztonsági Táblák",
      desc: "Szabványos jelölések, magas láthatóság.",
      href: `/products/${encodeURIComponent("Tábla")}`,
      image: "url('/tuz2.jpg')",
    },
    {
      title: "Kiegészítők",
      desc: "Fali tartók, konzolok, védőfelszerelések.",
      href: `/products/${encodeURIComponent("Kiegészítő")}`,
      image: "url('/tuz3.jpg')",
    },
  ];
  return (
    <section className="px-8 py-16 bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((it) => (
          <div key={it.title} className="relative h-[220px] md:h-[280px] rounded-2xl overflow-hidden border border-gray-200 group">
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: it.image }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent group-hover:from-blue-700/40 transition-colors" />
            <div className="relative z-10 h-full p-6 flex flex-col justify-end">
              <h3 className="text-white text-2xl font-black uppercase tracking-tight">{it.title}</h3>
              <p className="text-white/80 text-sm mt-1">{it.desc}</p>
              <Link href={it.href} className="mt-4 inline-block bg-white text-black hover:bg-blue-600 hover:text-white text-xs font-black uppercase tracking-widest px-5 py-2 rounded-md transition-colors">
                Megnézem
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
