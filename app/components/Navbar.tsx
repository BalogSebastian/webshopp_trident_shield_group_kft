// app/components/Navbar.tsx
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full h-[90px] flex items-center justify-between px-8 bg-white text-black border-b border-gray-100 relative">
      
      {/* 1. BAL OLDAL - LOGO */}
      <div className="text-2xl font-black tracking-tighter uppercase z-20">
        <Link href="/">
          MUNKAVÉDELEM<span className="text-blue-600">.</span>
        </Link>
      </div>

      {/* 2. KÖZÉP - MENÜPONTOK */}
      {/* Absolute center: Így biztosan középen lesznek */}
      <div className="hidden md:flex items-center gap-10 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Link href="#" className="text-sm font-black tracking-widest uppercase hover:text-blue-600 transition-colors">
          Újdonságok
        </Link>
        <Link href="#" className="text-sm font-black tracking-widest uppercase hover:text-blue-600 transition-colors">
          Védőruházat
        </Link>
        <Link href="#" className="text-sm font-black tracking-widest uppercase hover:text-blue-600 transition-colors">
          Eszközök
        </Link>
        <Link href="#" className="text-sm font-black tracking-widest uppercase hover:text-blue-600 transition-colors">
          Rólunk
        </Link>
      </div>

      {/* 3. JOBB OLDAL - KERESŐ ÉS GOMB */}
      <div className="hidden md:flex items-center gap-6 z-20">
        {/* Kereső ikon */}
        <button className="hover:scale-110 transition-transform text-lg" aria-label="Keresés">
            🔍
        </button>
        
        {/* Bejelentkezés gomb - Most már rá van húzva a Link */}
        <Link href="/login">
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-widest px-6 py-3 transition-all hover:shadow-lg">
            Bejelentkezés
          </button>
        </Link>
      </div>
    </nav>
  );
}