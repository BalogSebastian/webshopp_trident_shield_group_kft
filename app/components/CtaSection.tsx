import Link from "next/link";

export default function CtaSection() {
  return (
    <section className="px-8 py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-black text-white p-8 rounded-xl flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest">Vásárlás</span>
            <h3 className="text-2xl font-black mt-2">Böngéssze a termékeket</h3>
            <p className="text-sm text-gray-300 mt-2">Azonnal elérhető készletek és akciók.</p>
          </div>
          <Link href="/products" className="mt-6 inline-block bg-white text-black font-black px-5 py-3 rounded-md text-xs uppercase tracking-widest">
            Összes termék
          </Link>
        </div>
        <div className="bg-blue-600 text-white p-8 rounded-xl flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest">Ajánlatkérés</span>
            <h3 className="text-2xl font-black mt-2">Kapcsolatfelvétel</h3>
            <p className="text-sm text-blue-100 mt-2">Pár adat és felvesszük a kapcsolatot.</p>
          </div>
          <Link href="/contact" className="mt-6 inline-block bg-white text-blue-700 font-black px-5 py-3 rounded-md text-xs uppercase tracking-widest">
            Kapcsolat
          </Link>
        </div>
        <div className="bg-white border border-gray-200 p-8 rounded-xl flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Tájékozódás</span>
            <h3 className="text-2xl font-black mt-2">Gyakori kérdések</h3>
            <p className="text-sm text-gray-600 mt-2">Szállítás, garancia, tanúsítványok, ügyfélszolgálat.</p>
          </div>
          <Link href="/faq" className="mt-6 inline-block bg-black text-white font-black px-5 py-3 rounded-md text-xs uppercase tracking-widest">
            GYIK
          </Link>
        </div>
      </div>
    </section>
  );
}
