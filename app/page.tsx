import AnnouncementBar from "./components/AnnouncementBar";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero"; 
import CategoryGrid from "./components/CategoryGrid"; 
import ProductList from "./components/ProductList";
import CtaSection from "./components/CtaSection";
import TrustBadges from "./components/TrustBadges";
import FeaturesGrid from "./components/FeaturesGrid";
import StickyCtaBar from "./components/StickyCtaBar";
import BrandsMarquee from "./components/BrandsMarquee";
import BestSellers from "./components/BestSellers";
import ContactStrip from "./components/ContactStrip";
import SaleBanner from "./components/SaleBanner";
import SplitHero from "./components/SplitHero";
import BannerGrid from "./components/BannerGrid";
import GalleryStrip from "./components/GalleryStrip";
import MosaicBanners from "./components/MosaicBanners";
import PromoSection from "./components/PromoSection";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";

// BEKÖTJÜK A MONGODB-T ÉS AZ AUTH-OT
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// Cache kikapcsolása
export const dynamic = "force-dynamic";

// SEGEDFÜGGVÉNY: User lekérése a Tokenből
async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token");

  if (!token) return null;

  try {
    return jwt.verify(token.value, process.env.JWT_SECRET!) as { name: string; email: string };
  } catch (error) {
    return null;
  }
}

export default async function Home() {
  // 1. Kapcsolódás
  await connectDB();

  // 2. Termékek lekérése
  const activeProducts = await Product.find({ 
    $or: [
      { isActive: true },
      { isActive: { $exists: false } }
    ]
  }).sort({ _id: -1 });

  // 3. User lekérése (Ez dönti el, hogy be vagy-e lépve)
  const user = await getUser();

  return (
    <main className="min-h-screen bg-white">
      <AnnouncementBar />
      <Navbar user={user} />
      
      <CategoryGrid />
      <Hero /> 
      <SaleBanner />
      <TrustBadges />
      <BrandsMarquee />
      <SplitHero />
      <CtaSection />
      <FeaturesGrid />
      <BannerGrid />
      <MosaicBanners />
      <GalleryStrip />
      <BestSellers products={JSON.parse(JSON.stringify(activeProducts))} />
      <ProductList products={JSON.parse(JSON.stringify(activeProducts))} />
      <PromoSection />
      <ContactStrip />
      <Testimonials />
      <Footer />
      <StickyCtaBar />
    </main>
  );
}
