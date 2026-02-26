export default function GalleryStrip() {
  const images = ["/tuz1.jpg", "/tuz2.jpg", "/tuz3.jpg", "/tuz2.jpg", "/tuz1.jpg"];
  return (
    <section className="px-8 py-10 bg-white">
      <div className="max-w-7xl mx-auto overflow-x-auto">
        <div className="flex gap-4 min-w-[900px]">
          {images.map((src, idx) => (
            <div key={`${src}-${idx}`} className="relative w-[260px] h-[160px] rounded-2xl overflow-hidden border border-gray-200 flex-shrink-0 group">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url('${src}')` }} />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
