// app/api/products/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

// TERMÉKEK LEKÉRÉSE (GET)
export async function GET() {
  try {
    await connectDB();
    
    // Összes termék lekérése
    const products = await Product.find().sort({ _id: -1 });
    
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ success: false, error: "Hiba a termékek lekérésekor" }, { status: 500 });
  }
}

// ÚJ TERMÉK HOZZÁADÁSA (POST)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectDB();

    // Létrehozzuk az új terméket
    const newProduct = await Product.create({
      name: body.name,
      category: body.category,
      price: body.price,
      stock: body.stock,
      sku: body.sku, // Cikkszám
      image: body.image || "https://via.placeholder.com/150" // Ha nincs kép, placeholder
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Hiba a létrehozáskor" }, { status: 500 });
  }
}