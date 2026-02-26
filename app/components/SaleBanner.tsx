import Link from "next/link";

export default function SaleBanner() {
  return (
    <section
      className="w-full h-[340px] md:h-[420px] bg-cover bg-center relative"
      style={{ backgroundImage: "url('/tuz1.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/60 transition-colors hover:bg-black/50" />
      <div className="relative z-10 max-w-7xl mx-auto px-8 h-full flex flex-col justify-center">
        <span className="inline-block text-xs font-black uppercase tracking-widest text-blue-300 mb-4">
          Téli vásár
        </span>
        <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">
          Ipari Biztonság <span className="text-blue-400">25% OFF</span>
        </h2>
        <p className="text-white/80 text-sm md:text-base mt-3 max-w-xl">
          Szerelkezzen fel a legmodernebb tűz- és munkavédelmi eszközökkel.
          Prémium minőség, maximális védelem a munkahelyen.
        </p>
        <div className="mt-6">
          <Link
            href="/products"
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md text-xs font-black uppercase tracking-widest"
          >
            Vásárlás most
          </Link>
        </div>
      </div>
    </section>
  );
}
