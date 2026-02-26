"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface NavbarProps {
  user?: {
    name: string;
    email: string;
  } | null;
}

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    // 1. Meghívjuk a kijelentkező API-t
    await fetch("/api/auth/logout", { method: "POST" });
    
    // 2. Frissítjük az oldalt, hogy eltűnjön a név
    router.refresh(); 
    // Biztonsági okból teljes újratöltést is csinálhatunk:
    window.location.reload();
  };

  return (
    <nav className="w-full h-[90px] flex items-center justify-between px-8 bg-white text-black border-b border-gray-100 relative">
      
      {/* 1. BAL OLDAL - LOGO */}
      <div className="text-2xl font-black tracking-tighter uppercase z-20">
        <Link href="/">
          MUNKAVÉDELEM<span className="text-blue-600">.</span>
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-10 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Link href="/products" className="text-sm font-black tracking-widest uppercase hover:text-blue-600 transition-colors">
          Termékek
        </Link>
        <Link href="/faq" className="text-sm font-black tracking-widest uppercase hover:text-blue-600 transition-colors">
          FAQ
        </Link>
        <Link href="/contact" className="text-sm font-black tracking-widest uppercase hover:text-blue-600 transition-colors">
          Kapcsolat
        </Link>
      </div>

      {/* 3. JOBB OLDAL */}
      <div className="hidden md:flex items-center gap-6 z-20">
        <button className="hover:scale-110 transition-transform text-lg" aria-label="Keresés">
            🔍
        </button>
        
        {/* LOGIKA: Ha van user -> Név + Kilépés. Ha nincs -> Belépés gomb. */}
        {user ? (
          <div className="flex items-center gap-4 bg-gray-50 py-2 px-4 rounded-full border border-gray-100">
             
             {/* Üdvözlő szöveg és Név */}
             <div className="text-right hidden lg:block">
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Üdvözöllek,</span>
                <span className="block text-sm font-black uppercase text-blue-600 leading-none">{user.name}</span>
             </div>
             
             {/* Avatar (Kezdőbetű) */}
             <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs shadow-md">
                {user.name.charAt(0)}
             </div>

             {/* Elválasztó vonal */}
             <div className="h-6 w-px bg-gray-300 mx-1"></div>

             {/* KILÉPÉS GOMB */}
             <button 
                onClick={handleLogout}
                className="text-xs font-bold text-gray-500 hover:text-red-600 uppercase tracking-widest transition-colors"
             >
                KILÉPÉS
             </button>
          </div>
        ) : (
          <Link href="/login">
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-widest px-6 py-3 transition-all hover:shadow-lg">
              Bejelentkezés
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
}
