"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    setIsLoading(false);

    if (data.success) {
      // SIKERES BELÉPÉS -> IRÁNY A FŐOLDAL!
      router.push("/");
      router.refresh(); 
    } else {
      setError(data.error || "Hiba a belépéskor.");
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-gray-900 items-center justify-center p-4">
       <div className="bg-white w-full max-w-md p-10 rounded-3xl shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-cyan-400"></div>

          <h2 className="text-4xl font-black uppercase tracking-tighter mb-2 text-gray-900">Bejelentkezés</h2>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-8">Kezelje rendeléseit egy helyen.</p>

          {error && <div className="bg-red-50 text-red-600 p-3 mb-6 text-xs font-bold text-center rounded border border-red-100">{error}</div>}

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
             <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Email Cím</label>
                <input required type="email" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm outline-none focus:border-blue-600 transition-all" 
                  value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
             </div>
             
             <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Jelszó</label>
                <input required type="password" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm outline-none focus:border-blue-600 transition-all"
                  value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
             </div>

             <button disabled={isLoading} className="bg-black text-white py-5 rounded-xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all mt-4 shadow-lg hover:shadow-blue-500/30">
                {isLoading ? "Betöltés..." : "Belépés"}
             </button>
          </form>

          <div className="mt-8 text-center border-t border-gray-100 pt-6">
             <Link href="/register" className="text-xs font-bold text-gray-400 hover:text-black uppercase tracking-wide">
                Nincs még fiókja? <span className="text-blue-600">Regisztráció.</span>
             </Link>
          </div>
       </div>
    </div>
  );
}