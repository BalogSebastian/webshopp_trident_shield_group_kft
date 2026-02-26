import Link from "next/link";

export default function ContactHero() {
  return (
    <section className="bg-white px-8 py-12 border-b border-gray-100">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <span className="text-blue-600 text-xs font-bold uppercase tracking-widest">Kapcsolat</span>
          <h1 className="text-4xl font-black uppercase tracking-tight">Lépjen kapcsolatba velünk</h1>
          <p className="text-gray-600 mt-2 text-sm">Munkavédelmi szakértő csapat, gyors válasz és pontos ajánlat.</p>
          <div className="mt-6 flex gap-3">
            <Link href="/products" className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-widest px-5 py-3 rounded-md">
              Termékek
            </Link>
            <Link href="/faq" className="border border-gray-300 text-black text-xs font-bold uppercase tracking-widest px-5 py-3 rounded-md hover:bg-gray-50">
              GYIK
            </Link>
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="text-xs font-bold uppercase tracking-widest text-gray-500">Telefon</div>
            <div className="text-lg font-black">+36 1 234 5678</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="text-xs font-bold uppercase tracking-widest text-gray-500">Email</div>
            <div className="text-lg font-black">info@munkavedelmi-kft.hu</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="text-xs font-bold uppercase tracking-widest text-gray-500">Iroda</div>
            <div className="text-lg font-black">Budapest, Ipari út 1.</div>
          </div>
        </div>
      </div>
    </section>
  );
}
