import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

// PUT: Adatok frissítése (Bármilyen mezőt frissít: stock, isActive, price, stb.)
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. ID kinyerése (Next.js 15 kompatibilis módon)
    const { id } = await params;
    
    // 2. A küldött adatok beolvasása (pl. { isActive: false } vagy { stock: 50 })
    const body = await req.json();
    
    await connectDB();

    // 3. Frissítés
    // A { ...body } azt jelenti: "Vedd az összes beérkező adatot, és írd felül azokat az adatbázisban"
    const updatedProduct = await Product.findByIdAndUpdate(
      id, 
      { ...body }, 
      { new: true } // Visszaadja a frissített, új állapotot
    );

    if (!updatedProduct) {
      return NextResponse.json({ success: false, error: "Termék nem található" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updatedProduct });

  } catch (error) {
    console.error("Hiba a frissítéskor:", error);
    return NextResponse.json({ success: false, error: "Szerver hiba" }, { status: 500 });
  }
}

// DELETE: Termék végleges törlése
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await connectDB();

    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ success: false, error: "Termék nem található" }, { status: 404 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Hiba a törléskor:", error);
    return NextResponse.json({ success: false, error: "Szerver hiba" }, { status: 500 });
  }
}