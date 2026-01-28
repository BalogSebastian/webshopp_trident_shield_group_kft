// app/components/Hero.tsx
export default function Hero() {
  return (
    <section className="relative w-full h-[80vh] bg-gray-900 overflow-hidden text-white">
      {/* Háttérkép - Ide majd egy igazi munkavédelmi kép kell */}
      {/* Most egy sötétített placeholder-t használok, hogy látszódjon a szöveg */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-60"></div>
      
      {/* Tartalom a képen */}
      <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16">
        
        {/* A kék csík helyett itt pirosat vagy kéket használunk 'SALE' jelzőnek */}
        <div className="mb-4">
           <span className="bg-blue-600 text-white px-3 py-1 text-xs font-bold uppercase tracking-widest">
             Téli Vásár
           </span>
        </div>

        {/* Főcím - Hatalmas betűkkel, mint a 'BLOCKHAUS' */}
        <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-6">
          IPARI <br />
          BIZTONSÁG <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">25% OFF</span>
        </h1>

        <p className="max-w-md text-gray-200 text-sm md:text-base mb-8">
          Szerelkezzen fel a legmodernebb tűz- és munkavédelmi eszközökkel. 
          Prémium minőség, maximális védelem a munkahelyen.
        </p>

        {/* Gomb - Az a kék gomb a képről */}
        <button className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-4 px-10 w-fit flex items-center gap-2 transition-all">
          Vásárlás Most <span>↗</span>
        </button>
      </div>
    </section>
  );
}