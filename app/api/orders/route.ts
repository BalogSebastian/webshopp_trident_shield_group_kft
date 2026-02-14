// app/api/orders/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

// RENDELÉSEK LEKÉRÉSE (GET)
export async function GET() {
  try {
    await connectDB();
    
    // Összes rendelés lekérése időrendben (legújabb elöl)
    const orders = await Order.find().sort({ createdAt: -1 });
    
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ success: false, error: "Hiba a rendelések lekérésekor" }, { status: 500 });
  }
}

// ÚJ RENDELÉS HOZZÁADÁSA (POST)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectDB();

    // Létrehozzuk az új rendelést
    const newOrder = await Order.create({
      transactionId: body.transactionId,
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      customerPhone: body.customerPhone,
      customerAddress: body.customerAddress,
      productName: body.productName,
      productSku: body.productSku,
      quantity: body.quantity,
      unitPrice: body.unitPrice,
      totalPrice: body.totalPrice,
      status: body.status || "pending"
    });

    return NextResponse.json({ success: true, order: newOrder });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Hiba a rendelés létrehozásakor" }, { status: 500 });
  }
}
