"use client";

export default function BrandsMarquee() {
  const brands = ["MAXIMA", "TRIDENT", "SAFETECH", "FIREPRO", "INDUSTRIAL", "PROTECTA", "GUARDIAN"];
  return (
    <section className="px-8 py-6 bg-white border-t border-gray-100 overflow-hidden">
      <div className="whitespace-nowrap flex gap-12 animate-[marquee_20s_linear_infinite]">
        {brands.concat(brands).map((b, i) => (
          <div key={`${b}-${i}`} className="text-gray-400 text-2xl font-black uppercase tracking-widest">{b}</div>
        ))}
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
