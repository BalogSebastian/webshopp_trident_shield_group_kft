"use client";

import Link from "next/link";
import { useState } from "react";

export default function StickyCtaBar() {
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-black text-white rounded-full shadow-lg flex items-center gap-3 px-4 py-2">
        <Link href="/contact" className="bg-white text-black px-4 py-2 text-xs font-black uppercase rounded-full">
          Kapcsolat
        </Link>
        <Link href="/products" className="bg-blue-600 text-white px-4 py-2 text-xs font-black uppercase rounded-full">
          Termékek
        </Link>
        <button onClick={() => setHidden(true)} className="text-xs text-gray-300 hover:text-white px-2">
          Bezárás
        </button>
      </div>
    </div>
  );
}
