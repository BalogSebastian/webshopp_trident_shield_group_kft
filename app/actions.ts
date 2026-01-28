// app/actions.ts
"use server";

import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { revalidatePath } from "next/cache";

// Készlet frissítése
export async function updateStock(id: string, newStock: number) {
  await connectDB();
  await Product.findByIdAndUpdate(id, { stock: newStock });
  revalidatePath("/managerepository"); // Azonnal frissíti az oldalt
}

// Termék törlése
export async function deleteProduct(id: string) {
  await connectDB();
  await Product.findByIdAndDelete(id);
  revalidatePath("/managerepository");
}

// Kezdő adatok feltöltése (hogy ne legyen üres)
export async function seedProducts() {
  await connectDB();
  
  // Megnézzük, van-e már termék, ha nincs, létrehozzuk őket
  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.create([
      { name: "MAXIMA Porral Oltó 6kg (ABC)", category: "Tűzvédelem", price: 14990, stock: 50, sku: "MAX-006", image: "https://images.unsplash.com/photo-1596468137351-460d36746401?auto=format&fit=crop&w=800" },
      { name: "MAXIMA Porral Oltó 2kg (Autós)", category: "Tűzvédelem", price: 8990, stock: 20, sku: "MAX-002", image: "https://images.unsplash.com/photo-1596468137351-460d36746401?auto=format&fit=crop&w=800" },
      { name: "Tűzvédelmi Szabvány Tábla", category: "Tábla", price: 1500, stock: 100, sku: "TAB-001", image: "https://images.unsplash.com/photo-1615707548590-b3dfd2a50156?auto=format&fit=crop&w=800" },
      { name: "MAXIMA Tűztakaró 3m", category: "Kiegészítő", price: 5490, stock: 35, sku: "BLK-003", image: "https://images.unsplash.com/photo-1615707548590-b3dfd2a50156?auto=format&fit=crop&w=800" },
      { name: "Fali Tartó Konzol", category: "Kiegészítő", price: 2490, stock: 200, sku: "HLD-001", image: "https://images.unsplash.com/photo-1585834896773-41e974e64906?auto=format&fit=crop&w=800" },
    ]);
  }
}