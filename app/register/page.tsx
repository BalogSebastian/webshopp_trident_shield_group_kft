// app/register/page.tsx
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="min-h-screen w-full flex">
      
      {/* 1. BAL OLDAL - KÉP (Másik kép, mint a belépésnél) */}
      <div className="hidden lg:flex w-1/2 bg-gray-900 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-overlay"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1581092921461-eab62e97a783?q=80&w=2070&auto=format&fit=crop')" }}
        ></div>
        
        <div className="relative z-10 w-full h-full flex flex-col justify-between p-12 text-white">
          <div className="text-2xl font-black tracking-tighter uppercase">
            MUNKAVÉDELEM<span className="text-blue-600">.</span>
          </div>
          
          <div>
             <h1 className="text-6xl font-black uppercase tracking-tighter leading-none mb-6">
               CSATLAKOZZON <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-white">A PROFIKHOZ.</span>
             </h1>
             <p className="max-w-md text-gray-300 text-sm">
               Hozzon létre fiókot percek alatt, és élvezze az ingyenes szállítást az első rendelésénél.
             </p>
          </div>

          <div className="text-xs font-bold tracking-widest text-gray-500 uppercase">
            © 2026 Munkavédelem Kft.
          </div>
        </div>
      </div>

      {/* 2. JOBB OLDAL - REGISZTRÁCIÓS ŰRLAP */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center items-center p-8 lg:p-24 relative">
        
        <Link href="/" className="absolute top-8 left-8 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors flex items-center gap-2">
           ← Vissza a főoldalra
        </Link>

        <div className="w-full max-w-md">
           <h2 className="text-4xl font-black uppercase tracking-tight mb-2">Fiók létrehozása</h2>
           <p className="text-gray-500 text-sm mb-10">Adja meg adatait a regisztrációhoz.</p>

           <form className="flex flex-col gap-5">
              
              {/* Név */}
              <div className="group">
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-700">Teljes Név</label>
                <input 
                  type="text" 
                  className="w-full border-2 border-gray-200 p-4 font-bold text-black outline-none focus:border-blue-600 focus:bg-gray-50 transition-all placeholder:text-gray-300"
                  placeholder="Kovács János"
                />
              </div>

              {/* Email */}
              <div className="group">
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-700">Email cím</label>
                <input 
                  type="email" 
                  className="w-full border-2 border-gray-200 p-4 font-bold text-black outline-none focus:border-blue-600 focus:bg-gray-50 transition-all placeholder:text-gray-300"
                  placeholder="pelda@ceg.hu"
                />
              </div>

              {/* Jelszó */}
              <div className="group">
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-700">Jelszó</label>
                <input 
                  type="password" 
                  className="w-full border-2 border-gray-200 p-4 font-bold text-black outline-none focus:border-blue-600 focus:bg-gray-50 transition-all placeholder:text-gray-300"
                  placeholder="Min. 8 karakter"
                />
              </div>

              {/* Checkbox (ÁSZF) - Fontos a designban */}
              <div className="flex items-start gap-3 my-2">
                  <input type="checkbox" className="mt-1 w-4 h-4 text-blue-600 border-2 border-gray-300 rounded-none focus:ring-0 cursor-pointer" />
                  <p className="text-xs text-gray-500 leading-relaxed">
                      Elfogadom az <a href="#" className="text-black font-bold underline">Általános Szerződési Feltételeket</a> és az Adatkezelési Tájékoztatót.
                  </p>
              </div>

              {/* Regisztráció Gomb */}
              <button className="w-full bg-blue-600 text-white font-black py-5 uppercase tracking-widest hover:bg-blue-700 transition-colors mt-2 text-sm shadow-xl shadow-blue-200">
                Regisztráció
              </button>
           </form>

           {/* Vissza a belépéshez */}
           <div className="mt-8 text-center border-t border-gray-100 pt-8">
             <p className="text-sm text-gray-500 mb-4">Már van fiókja?</p>
             <Link href="/login" className="inline-block border-2 border-transparent text-black font-bold uppercase text-xs tracking-widest hover:underline">
               Jelentkezzen be itt
             </Link>
           </div>

        </div>
      </div>
    </div>
  );
}