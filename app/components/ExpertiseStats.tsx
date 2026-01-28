// app/components/ExpertiseStats.tsx
export default function ExpertiseStats() {
    return (
      <section className="py-24 bg-white border-y border-gray-200">
        <div className="container mx-auto px-6 md:px-12">
          
          {/* Felső szöveges rész - Balra igazítva, ipari stílus */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-6 text-black">
                MEGBÍZHATÓSÁG <br/>
                <span className="text-gray-400">SZÁMOKBAN.</span>
              </h2>
              <p className="text-gray-600 text-sm md:text-base font-medium max-w-lg leading-relaxed">
                Nem csak webshop vagyunk. Szakértő partnerek vagyunk a biztonságban, 
                több mint egy évtizedes tapasztalattal az ipari szektorban.
              </p>
            </div>
            
            {/* Díszítő elem vagy gomb */}
            <div className="hidden md:block">
               <div className="w-32 h-32 border border-black rounded-full flex items-center justify-center animate-spin-slow">
                  <svg className="w-12 h-12 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 4v16m8-8H4"/>
                  </svg>
               </div>
            </div>
          </div>
  
          {/* STATISZTIKÁK RÁCS - Vonalakkal elválasztva */}
          <div className="grid grid-cols-1 md:grid-cols-4 border-t border-black">
            
            {/* 1. Stat */}
            <div className="py-12 md:pr-12 md:border-r border-gray-200">
              <span className="block text-6xl md:text-8xl font-black text-black tracking-tighter mb-2">
                15
              </span>
              <div className="h-1 w-12 bg-blue-600 mb-4"></div>
              <h3 className="text-sm font-black uppercase tracking-widest text-gray-500">Év Tapasztalat</h3>
              <p className="text-xs text-gray-400 mt-2">Folyamatos jelenlét a piacon.</p>
            </div>
  
            {/* 2. Stat */}
            <div className="py-12 md:px-12 md:border-r border-gray-200">
              <span className="block text-6xl md:text-8xl font-black text-black tracking-tighter mb-2">
                5K<span className="text-blue-600 text-4xl align-top">+</span>
              </span>
               <div className="h-1 w-12 bg-black mb-4"></div>
              <h3 className="text-sm font-black uppercase tracking-widest text-gray-500">Partner</h3>
              <p className="text-xs text-gray-400 mt-2">Kivitelezők és cégek.</p>
            </div>
  
            {/* 3. Stat */}
            <div className="py-12 md:px-12 md:border-r border-gray-200">
               <span className="block text-6xl md:text-8xl font-black text-black tracking-tighter mb-2">
                100<span className="text-4xl align-top">%</span>
              </span>
               <div className="h-1 w-12 bg-black mb-4"></div>
              <h3 className="text-sm font-black uppercase tracking-widest text-gray-500">Garancia</h3>
              <p className="text-xs text-gray-400 mt-2">Minden termékünkre.</p>
            </div>
  
            {/* 4. Stat - Kiemelt rész */}
            <div className="py-12 md:pl-12 flex flex-col justify-center">
               <div className="bg-gray-100 p-8">
                  <h4 className="font-black uppercase text-xl mb-2">Hivatalos Forgalmazó</h4>
                  <p className="text-xs text-gray-500 mb-4">
                    Kizárólag bevizsgált, eredeti tűzvédelmi eszközöket forgalmazunk.
                  </p>
                  <a href="#" className="text-blue-600 text-xs font-bold uppercase tracking-widest hover:underline">
                    Tanúsítványok megtekintése →
                  </a>
               </div>
            </div>
  
          </div>
        </div>
      </section>
    );
  }