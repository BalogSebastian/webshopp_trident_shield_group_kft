export default function TrustBadges() {
  return (
    <section className="px-8 py-12 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-black">ISO</div>
          <div className="text-sm font-bold">Tanúsított minőség</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-black">CE</div>
          <div className="text-sm font-bold">Európai megfelelőség</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-black">24h</div>
          <div className="text-sm font-bold">Gyors kiszállítás</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-black">PRO</div>
          <div className="text-sm font-bold">Szakértő támogatás</div>
        </div>
      </div>
    </section>
  );
}
