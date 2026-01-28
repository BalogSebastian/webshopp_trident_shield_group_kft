// app/page.tsx
import Navbar from "./components/Navbar";
import Hero from "./components/Hero"; 
import CategoryGrid from "./components/CategoryGrid"; 
import ProductList from "./components/ProductList";
import PromoSection from "./components/PromoSection";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";

// BEKÖTJÜK A MONGODB-T A FŐOLDALRA
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

// Cache kikapcsolása, hogy ha adminban átírod, itt is azonnal változzon
export const dynamic = "force-dynamic";

export default async function Home() {
  // 1. Kapcsolódás
  await connectDB();

  // 2. LEKÉRDEZÉS JAVÍTÁSE:
  // Kérjük azokat, amik "true"-ra vannak állítva, VAGY amiknél még hiányzik a mező (régi termékek)
  const activeProducts = await Product.find({ 
    $or: [
      { isActive: true },
      { isActive: { $exists: false } } // Ez a kulcs a régi termékekhez!
    ]
  }).sort({ _id: -1 });

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <CategoryGrid />
      <Hero /> 

      
      {/* Átadjuk a valódi, aktív termékeket a listának */}
      <ProductList products={JSON.parse(JSON.stringify(activeProducts))} />
      
      <PromoSection />
      <Testimonials />
      <Footer />
    </main>
  );
}