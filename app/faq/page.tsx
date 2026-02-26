import Link from "next/link";
import FaqAccordion from "@/app/components/FaqAccordion";

export default function FAQPage() {
  const items = [
    { q: "Szállítási idők és díjak?", a: "Országosan szállítunk, 50 000 Ft felett ingyen. A kézbesítés általában 1–3 munkanap." },
    { q: "Fizetési módok?", a: "Bankkártya és átutalás elérhető. Vállalati ügyfeleknek díjbekérő is kérhető." },
    { q: "Garancia és csere?", a: "Minden termékre garanciát vállalunk. Méret- és típuscsere 30 napon belül lehetséges." },
    { q: "Tanúsítványok?", a: "Kizárólag minősített, CE/ISO megfelelőséggel rendelkező eszközöket forgalmazunk. Igény esetén dokumentációt biztosítunk." },
    { q: "Kapcsolat és ügyfélszolgálat?", a: "Elérhető hétköznap 9–17 között. Írjon a Kapcsolat oldalon vagy hívjon minket." },
    { q: "Készletinformációk?", a: "A termékeknél jelöljük a raktárkészletet. Elfogyás esetén a visszaérkezés dátumát is megjelenítjük, ha elérhető." },
  ];
  return (
    <div className="min-h-screen bg-white">
      <nav className="w-full h-[90px] flex items-center justify-between px-8 bg-white text-black border-b border-gray-100">
        <div className="text-2xl font-black tracking-tighter uppercase">
          <Link href="/">MUNKAVÉDELEM<span className="text-blue-600">.</span></Link>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <Link href="/contact" className="text-sm font-black uppercase tracking-widest hover:text-blue-600">Kapcsolat</Link>
          <Link href="/products" className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-widest px-6 py-3">Termékek</Link>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-8 py-16">
        <div className="mb-10">
          <span className="text-blue-600 text-xs font-bold uppercase tracking-widest">GYIK</span>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight">Gyakran Ismételt Kérdések</h1>
          <p className="text-gray-600 mt-2 text-sm">Minden fontos információ egy helyen a vásárláshoz.</p>
        </div>
        <FaqAccordion items={items} />
      </section>
    </div>
  );
}
