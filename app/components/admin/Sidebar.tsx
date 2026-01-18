"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Ikonok
const Icons = {
  Box: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  List: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  Eye: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>,
  Home: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
};

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Rendelések", href: "/managerepository", icon: Icons.List },
    { name: "Raktárkészlet", href: "/managerepository/inventory", icon: Icons.Box },
    { name: "Webshop Megjelenés", href: "/managerepository/visibility", icon: Icons.Eye },
  ];

  return (
    <aside className="w-64 bg-black text-white flex flex-col h-screen fixed left-0 top-0 border-r border-gray-800 z-50">
      
      {/* LOGO */}
      <div className="p-8 border-b border-gray-800">
        <h1 className="text-xl font-black uppercase tracking-widest leading-none">
          Munkavédelem<br/>
          <span className="text-blue-600">Manager.</span>
        </h1>
      </div>

      {/* MENÜ */}
      <nav className="flex-1 py-8 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-4 px-4 py-4 rounded-xl transition-all group ${
                isActive 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50" 
                  : "text-gray-400 hover:bg-gray-900 hover:text-white"
              }`}
            >
              <item.icon />
              <span className="text-xs font-bold uppercase tracking-widest">{item.name}</span>
              {isActive && <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></div>}
            </Link>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className="p-8 border-t border-gray-800">
         <Link href="/" className="flex items-center gap-3 text-gray-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
            <Icons.Home /> Vissza a Shopba
         </Link>
      </div>
    </aside>
  );
}