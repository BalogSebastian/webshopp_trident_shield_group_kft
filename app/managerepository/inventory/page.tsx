import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import InventoryClient from "./InventoryClient"; // Ezt mindjárt megcsináljuk!

export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  await connectDB();
  const products = await Product.find().sort({ name: 1 });

  return (
    <div>
      <InventoryClient initialProducts={JSON.parse(JSON.stringify(products))} />
    </div>
  );
}