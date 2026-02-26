import Link from "next/link";

export default function MosaicBanners() {
  const tiles = [
    { title: "Ipari védelem", href: "/products/Tűzvédelem", img: "/tuz1.jpg", size: "row-span-2" },
    { title: "Táblák", href: "/products/Tábla", img: "/tuz2.jpg", size: "" },
    { title: "Kiegészítők", href: "/products/Kiegészítő", img: "/tuz3.jpg", size: "" },
    { title: "Akciók", href: "/products", img: "/tuz2.jpg", size: "" },
  ];
  return (
    <section className="px-8 py-16 bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[160px] md:auto-rows-[200px]">
        {tiles.map((t) => (
          <Link key={t.title} href={t.href} className={`group relative rounded-2xl overflow-hidden border border-gray-200 ${t.size}`}>
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${t.img}')` }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent group-hover:from-blue-700/50 transition-colors" />
            <div className="relative z-10 h-full p-4 flex items-end">
              <div className="text-white font-black uppercase tracking-widest text-sm">{t.title}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
