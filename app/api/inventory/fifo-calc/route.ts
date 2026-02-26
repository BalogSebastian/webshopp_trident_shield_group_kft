import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Purchase from "@/models/Purchase";
import Sale from "@/models/Sale";
import Product from "@/models/Product";
import { toFixedNumber } from "@/lib/utils";

type Lot = { qty: number; unitPrice: number };

function allocate(lots: Lot[], qty: number) {
  let remaining = qty;
  let cost = 0;
  for (const lot of lots) {
    if (remaining <= 0) break;
    const take = Math.min(lot.qty, remaining);
    cost += take * lot.unitPrice;
    lot.qty -= take;
    remaining -= take;
  }
  return { cost, remaining };
}

export async function POST(req: NextRequest) {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    const body = await req.json();
    const sku: string = body.sku || "";
    const quantity: number = Number(body.quantity || 0);
    if (!sku || !quantity || quantity <= 0) {
      return NextResponse.json({ success: false, error: "SKU és mennyiség kötelező" }, { status: 400 });
    }
    const purchases = await Purchase.find({ sku }).sort({ purchaseDate: 1 }).lean();
    const lots: Lot[] = purchases.map((p) => ({
      qty: p.quantity,
      unitPrice: p.netUnitPrice,
    }));
    const product = await Product.findOne({ sku }).lean();
    if (product) {
      const existingSales = await Sale.find({ productId: product._id }).sort({ saleDate: 1 }).lean();
      for (const s of existingSales) {
        allocate(lots, s.quantity);
      }
    }
    const availableQty = lots.reduce((acc, l) => acc + l.qty, 0);
    const res = allocate(lots, quantity);
    const totalCost = toFixedNumber(res.cost);
    const unitCost = quantity > 0 ? toFixedNumber(totalCost / quantity) : 0;
    return NextResponse.json({
      success: true,
      data: {
        unitCost,
        totalCost,
        availableQty,
        shortage: res.remaining > 0,
        shortageQty: res.remaining,
      },
    });
  } catch (_err: unknown) {
    return NextResponse.json({ success: false, error: "FIFO kalkuláció hiba" }, { status: 500 });
  }
}
