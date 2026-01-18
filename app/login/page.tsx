import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex">
      
      {/* 1. BAL OLDAL - KÉP ÉS BRANDING (Csak asztali nézeten látszik) */}
      <div className="hidden lg:flex w-1/2 bg-gray-900 relative overflow-hidden">
        {/* Háttérkép */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-overlay"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2070&auto=format&fit=crop')" }}
        ></div>
        
        {/* Dekorációs szöveg */}
        <div className="relative z-10 w-full h-full flex flex-col justify-between p-12 text-white">
          <div className="text-2xl font-black tracking-tighter uppercase">
            MUNKAVÉDELEM<span className="text-blue-600">.</span>
          </div>
          
          <div>
             <h1 className="text-6xl font-black uppercase tracking-tighter leading-none mb-6">
               A BIZTONSÁG <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-white">NEM JÁTÉK.</span>
             </h1>
             <p className="max-w-md text-gray-300 text-sm">
               Lépjen be fiókjába, hogy nyomon követhesse rendeléseit és hozzáférjen a prémium ajánlatokhoz.
             </p>
          </div>

          <div className="text-xs font-bold tracking-widest text-gray-500 uppercase">
            © 2026 Munkavédelem Kft.
          </div>
        </div>
      </div>

      {/* 2. JOBB OLDAL - ŰRLAP */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center items-center p-8 lg:p-24 relative">
        
        {/* Vissza gomb */}
        <Link href="/" className="absolute top-8 left-8 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors flex items-center gap-2">
           ← Vissza a főoldalra
        </Link>

        <div className="w-full max-w-md">
           <h2 className="text-4xl font-black uppercase tracking-tight mb-2">Üdvözlünk!</h2>
           <p className="text-gray-500 text-sm mb-10">Kérjük, adja meg a belépési adatait.</p>

           <form className="flex flex-col gap-6">
              
              {/* Email mező */}
              <div className="group">
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-700">Email cím</label>
                <input 
                  type="email" 
                  className="w-full border-2 border-gray-200 p-4 font-bold text-black outline-none focus:border-blue-600 focus:bg-gray-50 transition-all placeholder:text-gray-300"
                  placeholder="pelda@ceg.hu"
                />
              </div>

              {/* Jelszó mező */}
              <div className="group">
                <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-700">Jelszó</label>
                    <a href="#" className="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase">Elfelejtett jelszó?</a>
                </div>
                <input 
                  type="password" 
                  className="w-full border-2 border-gray-200 p-4 font-bold text-black outline-none focus:border-blue-600 focus:bg-gray-50 transition-all placeholder:text-gray-300"
                  placeholder="••••••••"
                />
              </div>

              {/* Belépés Gomb */}
              <button className="w-full bg-black text-white font-black py-5 uppercase tracking-widest hover:bg-blue-600 transition-colors mt-2 text-sm">
                Belépés
              </button>
           </form>

           {/* Regisztráció link */}
           <div className="mt-8 text-center border-t border-gray-100 pt-8">
             <p className="text-sm text-gray-500 mb-4">Még nincs felhasználói fiókja?</p>
             <Link href="/register" className="inline-block border-2 border-black text-black font-bold py-3 px-8 uppercase text-xs tracking-widest hover:bg-black hover:text-white transition-all">
               Regisztráció létrehozása
             </Link>
           </div>

        </div>
      </div>
    </div>
  );
}