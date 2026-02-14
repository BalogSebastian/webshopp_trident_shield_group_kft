"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminTridentLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: "", password: "", code: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Ellenőrizzük a bejelentkezési adatokat
    if (formData.username === "admin" && formData.password === "admin" && formData.code === "0000") {
      // Sikeres bejelentkezés - navigálás az admin dashboardra
      router.push("/admintridentshieldgroupkftencodded");
    } else {
      setError("Hibás felhasználónév, jelszó vagy kód!");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex bg-white items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-10 rounded-3xl shadow-2xl border border-gray-100 relative overflow-hidden">
        
        {/* Felső dekorációs sáv */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-blue-400"></div>

        {/* Admin ikon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter mb-2 text-gray-900">ADMIN TRIDENT</h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Biztonsági belépés</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 mb-6 text-xs font-bold text-center rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-gray-600">Felhasználónév</label>
            <input 
              required 
              type="text" 
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-600 focus:bg-white transition-all" 
              placeholder="admin"
              value={formData.username} 
              onChange={e => setFormData({...formData, username: e.target.value})} 
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-gray-600">Jelszó</label>
            <input 
              required 
              type="password" 
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-600 focus:bg-white transition-all"
              placeholder="••••••••"
              value={formData.password} 
              onChange={e => setFormData({...formData, password: e.target.value})} 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-gray-600">Biztonsági kód</label>
            <input 
              required 
              type="password" 
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-600 focus:bg-white transition-all"
              placeholder="0000"
              value={formData.code} 
              onChange={e => setFormData({...formData, code: e.target.value})} 
            />
          </div>

          <button 
            disabled={isLoading} 
            className="bg-blue-700 hover:bg-blue-600 text-white py-5 rounded-xl font-black uppercase tracking-widest transition-all mt-6 shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "BELÉPÉS..." : "BELÉPÉS"}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-gray-100 pt-6">
          <p className="text-xs text-gray-400 font-medium">
            Admin Trident V1.0 • Biztonsági hozzáférés
          </p>
        </div>
      </div>
    </div>
  );
}