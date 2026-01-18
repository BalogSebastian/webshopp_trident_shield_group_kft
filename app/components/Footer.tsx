import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#F4F4F4] text-black pt-20 border-t border-gray-200 relative overflow-hidden">
      
      {/* 1. SZOLGÁLTATÁS SÁV (Ikonokkal) */}
      <div className="container mx-auto px-6 md:px-12 mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          
          {/* Ikon 1: Szállítás */}
          <div className="flex flex-col items-center text-center group">
            <div className="mb-4 p-4 bg-white border border-gray-200 rounded-full group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"></path></svg>
            </div>
            <h4 className="font-black text-xs tracking-widest uppercase mb-1">Ingyenes Szállítás</h4>
            <p className="text-xs text-gray-500">50.000 Ft feletti rendelésnél</p>
          </div>

          {/* Ikon 2: Fizetés */}
          <div className="flex flex-col items-center text-center group">
            <div className="mb-4 p-4 bg-white border border-gray-200 rounded-full group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            </div>
            <h4 className="font-black text-xs tracking-widest uppercase mb-1">Biztonságos Fizetés</h4>
            <p className="text-xs text-gray-500">SSL titkosított kapcsolat</p>
          </div>

          {/* Ikon 3: Garancia */}
          <div className="flex flex-col items-center text-center group">
             <div className="mb-4 p-4 bg-white border border-gray-200 rounded-full group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            </div>
            <h4 className="font-black text-xs tracking-widest uppercase mb-1">30 Napos Csere</h4>
            <p className="text-xs text-gray-500">Ha nem jó a méret</p>
          </div>

          {/* Ikon 4: Support */}
          <div className="flex flex-col items-center text-center group">
             <div className="mb-4 p-4 bg-white border border-gray-200 rounded-full group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            </div>
            <h4 className="font-black text-xs tracking-widest uppercase mb-1">Szakértő Ügyfélszolgálat</h4>
            <p className="text-xs text-gray-500">Munkavédelmi tanácsadás</p>
          </div>

        </div>
      </div>

      <div className="border-t border-gray-300 mx-6 md:mx-12"></div>

      {/* 2. FŐ TARTALOM (Linkek & Hírlevél) */}
      <div className="container mx-auto px-6 md:px-12 py-16 grid grid-cols-1 md:grid-cols-12 gap-12">
        
        {/* BRAND INFO (3 oszlop széles) */}
        <div className="md:col-span-3 flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">
              MUNKAVÉDELEM<span className="text-blue-600">.</span>
            </h3>
            <p className="text-gray-500 text-xs leading-relaxed max-w-[200px] mb-6">
              A legkeményebb munkákhoz tervezve. Minőség, amire az életedet bízhatod.
            </p>
            <p className="text-xs font-bold text-gray-400">© 2026 Munkavédelem Kft.</p>
          </div>
        </div>

        {/* LINKEK (Középen - 5 oszlop széles) */}
        <div className="md:col-span-5 grid grid-cols-2 gap-8">
            <div>
                <h4 className="font-bold text-xs tracking-[0.2em] uppercase text-gray-400 mb-6">Webshop</h4>
                <ul className="flex flex-col gap-3">
                    {['Újdonságok', 'Férfi Ruházat', 'Női Ruházat', 'Bakancsok', 'Kiegészítők'].map((item) => (
                        <li key={item}>
                            <Link href="#" className="text-sm font-bold uppercase hover:text-blue-600 hover:pl-2 transition-all duration-300 block">
                                {item}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h4 className="font-bold text-xs tracking-[0.2em] uppercase text-gray-400 mb-6">Infó</h4>
                <ul className="flex flex-col gap-3">
                    {['Rólunk', 'Kapcsolat', 'Szállítási infók', 'Adatvédelem', 'Karrier'].map((item) => (
                        <li key={item}>
                            <Link href="#" className="text-sm font-bold uppercase hover:text-blue-600 hover:pl-2 transition-all duration-300 block">
                                {item}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>

        {/* HÍRLEVÉL (Jobbra - 4 oszlop széles) */}
        <div className="md:col-span-4 bg-white p-8 border border-gray-200 h-fit">
           <h4 className="text-xl font-black uppercase mb-2 leading-none">NE MARADJ LE!</h4>
           <p className="text-xs text-gray-500 mb-6">Iratkozz fel és azonnal küldünk egy <span className="text-black font-bold">15%-os kupont</span>.</p>
           
           <div className="flex flex-col gap-3">
             <input 
                type="email" 
                placeholder="EMAIL CÍMED..." 
                className="bg-gray-50 border border-gray-200 px-4 py-3 w-full text-xs font-bold uppercase placeholder:text-gray-400 outline-none focus:border-blue-600 focus:bg-white transition-colors"
             />
             <button className="bg-black text-white font-black px-6 py-3 uppercase text-xs tracking-widest hover:bg-blue-600 transition-colors w-full">
               Feliratkozás
             </button>
           </div>
           
           <p className="text-[10px] text-gray-400 mt-4 text-center">
               Nincs spam. Bármikor leiratkozhatsz.
           </p>
        </div>
      </div>

      {/* 3. HATALMAS ALSÓ SZÖVEG (Design elem) */}
      <div className="w-full flex justify-center overflow-hidden leading-none select-none pointer-events-none">
          {/* A szöveg direkt kilóg alul (translate-y-1/4), ahogy a design képen */}
          <h1 className="text-[13vw] md:text-[16vw] font-black text-white text-center uppercase tracking-tighter drop-shadow-sm translate-y-[20%]">
             <span className="text-transparent bg-clip-text bg-gradient-to-b from-gray-200 to-gray-100">
                MUNKAVÉDELEM
             </span>
          </h1>
      </div>
    </footer>
  );
}