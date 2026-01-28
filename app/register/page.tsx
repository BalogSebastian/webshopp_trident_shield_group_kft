"use client"; // Fontos, mert van useState!

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Adatok, 2: Token
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 1. Lépés: Regisztráció elküldése
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    setIsLoading(false);

    if (data.success) {
      setStep(2); // Átlépünk a token megadására
    } else {
      setError(data.error || "Hiba történt.");
    }
  };

  // 2. Lépés: Token ellenőrzése
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const res = await fetch("/api/auth/verify", {
      method: "POST",
      body: JSON.stringify({ email: formData.email, token }),
    });

    const data = await res.json();
    setIsLoading(false);

    if (data.success) {
      router.push("/login"); // Sikeres, mehet bejelentkezni
    } else {
      setError(data.error || "Hibás kód.");
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-gray-50 items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl border border-gray-100">
        
        <h2 className="text-3xl font-black uppercase tracking-tight mb-2 text-center">
          {step === 1 ? "Fiók Létrehozása" : "E-mail Ellenőrzés"}
        </h2>
        
        <p className="text-gray-500 text-xs mb-8 text-center uppercase tracking-widest">
           {step === 1 ? "Adja meg adatait a folytatáshoz." : `Küldtünk egy kódot a(z) ${formData.email} címre.`}
        </p>

        {error && <div className="bg-red-50 text-red-600 p-3 mb-4 text-xs font-bold text-center rounded">{error}</div>}

        {step === 1 ? (
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
             <input required type="text" placeholder="Teljes Név" className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold"
               value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
             <input required type="email" placeholder="Email Cím" className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold"
               value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
             <input required type="password" placeholder="Jelszó" className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold"
               value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
             
             <button disabled={isLoading} className="bg-black text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all mt-2">
               {isLoading ? "Küldés..." : "Regisztráció"}
             </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="flex flex-col gap-4">
             <input required type="text" placeholder="6 jegyű kód" maxLength={6} className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-2xl font-black text-center tracking-[1em]"
               value={token} onChange={e => setToken(e.target.value)} />
             
             <button disabled={isLoading} className="bg-blue-600 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all mt-2">
               {isLoading ? "Ellenőrzés..." : "Kód Beküldése"}
             </button>
          </form>
        )}
        
        <div className="mt-6 text-center">
            <Link href="/login" className="text-xs font-bold text-gray-400 hover:text-black uppercase">Már van fiókja? Belépés.</Link>
        </div>
      </div>
    </div>
  );
}