import Link from "next/link";

export default function ContactStrip() {
  return (
    <section className="px-8 py-10 bg-black text-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-xl font-black uppercase tracking-tight">Kérdése van? Segítünk.</div>
        <div className="flex items-center gap-3">
          <Link href="/contact" className="bg-white text-black px-6 py-3 text-xs font-black uppercase rounded-md">Kapcsolat</Link>
          <Link href="/products" className="bg-blue-600 text-white px-6 py-3 text-xs font-black uppercase rounded-md">Termékek</Link>
        </div>
      </div>
    </section>
  );
}
