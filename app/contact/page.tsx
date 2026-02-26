"use client";

import { useState } from "react";
import Link from "next/link";
import ContactHero from "@/app/components/ContactHero";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", message: "" });
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    setStatus("");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    if (json.success) {
      setStatus("Üzenet elküldve, hamarosan felvesszük a kapcsolatot.");
      setForm({ name: "", email: "", phone: "", company: "", message: "" });
    } else {
      setStatus(json.error || "Hiba történt.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="w-full h-[90px] flex items-center justify-between px-8 bg-white text-black border-b border-gray-100">
        <div className="text-2xl font-black tracking-tighter uppercase">
          <Link href="/">MUNKAVÉDELEM<span className="text-blue-600">.</span></Link>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <Link href="/faq" className="text-sm font-black uppercase tracking-widest hover:text-blue-600">FAQ</Link>
          <Link href="/products" className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-widest px-6 py-3">Termékek</Link>
        </div>
      </nav>

      <ContactHero />

      <section className="max-w-5xl mx-auto px-8 py-16">
        <div className="mb-10">
          <span className="text-blue-600 text-xs font-bold uppercase tracking-widest">Kapcsolat</span>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight">Lépjen kapcsolatba velünk</h1>
          <p className="text-gray-600 mt-2 text-sm">Töltse ki az űrlapot és 24 órán belül válaszolunk.</p>
        </div>

        {status && <div className="mb-6 text-sm font-bold text-blue-700">{status}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <input placeholder="Név" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm outline-none focus:border-blue-600" />
            <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm outline-none focus:border-blue-600" />
            <input placeholder="Telefon" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm outline-none focus:border-blue-600" />
            <input placeholder="Cég" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm outline-none focus:border-blue-600" />
          </div>
          <div className="space-y-4">
            <textarea placeholder="Üzenet" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full h-48 p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm outline-none focus:border-blue-600" />
            <button onClick={submit} disabled={loading} className="bg-blue-700 hover:bg-blue-600 text-white py-4 rounded-xl font-black uppercase tracking-widest transition-all">
              {loading ? "Küldés..." : "Üzenet küldése"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
