import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import VisibilityClient from "./VisibilityClient";

// Kikapcsoljuk a cache-t, hogy mindig a friss adatot lássuk
export const dynamic = "force-dynamic";

export default async function VisibilityPage() {
  await connectDB();
  
  // Lekérjük az összes terméket ABC sorrendben
  const products = await Product.find().sort({ name: 1 });

  return (
    <div>
      {/* Átadjuk az adatokat a Kliens komponensnek */}
      <VisibilityClient initialProducts={JSON.parse(JSON.stringify(products))} />
    </div>
  );
}