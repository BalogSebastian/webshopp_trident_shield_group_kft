export default function FeaturesGrid() {
  const items = [
    { title: "Minősített termékek", desc: "Hitelesített tűz- és munkavédelmi eszközök." },
    { title: "Gyors szállítás", desc: "Raktárról, akár másnapi kézbesítéssel." },
    { title: "Szakértő segítség", desc: "Valódi tanácsadás és ügyfélszolgálat." },
  ];
  return (
    <section className="px-8 py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((it) => (
          <div key={it.title} className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-xl font-black">{it.title}</h3>
            <p className="text-sm text-gray-600 mt-2">{it.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
