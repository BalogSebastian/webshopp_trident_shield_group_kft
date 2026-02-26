import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Purchase from "@/models/Purchase";
import Sale from "@/models/Sale";
import Product from "@/models/Product";
import { toFixedNumber } from "@/lib/utils";

type Lot = { qty: number; unitPrice: number };
type SummaryRow = {
  sku: string;
  currentQty: number;
  avgCost: number;
  valuation: number;
  unit: string;
};

export async function GET() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    const purchases = await Purchase.find().sort({ purchaseDate: 1 }).lean();
    const sales = await Sale.find().sort({ saleDate: 1 }).lean();
    const products = await Product.find().select({ _id: 1, sku: 1 }).lean();
    const skuByProductId: Record<string, string> = {};
    for (const p of products) {
      const key = (p as unknown as { _id: { toString(): string } })._id.toString();
      const val = (p as unknown as { sku?: string }).sku || "";
      skuByProductId[key] = val;
    }
    const lotsBySku: Record<string, Lot[]> = {};
    for (const p of purchases) {
      const sku = p.sku || "";
      if (!sku) continue;
      if (!lotsBySku[sku]) lotsBySku[sku] = [];
      lotsBySku[sku].push({ qty: p.quantity, unitPrice: p.netUnitPrice });
    }
    function allocate(lots: Lot[], qty: number) {
      let remaining = qty;
      for (const lot of lots) {
        if (remaining <= 0) break;
        const take = Math.min(lot.qty, remaining);
        lot.qty -= take;
        remaining -= take;
      }
    }
    const summary: SummaryRow[] = [];
    for (const [sku, lots] of Object.entries(lotsBySku)) {
      const qtySold = sales
        .filter((s) => {
          const pid = (s as unknown as { productId?: { toString(): string } }).productId;
          const sk = pid ? skuByProductId[pid.toString()] : "";
          return sk === sku;
        })
        .reduce((acc, s) => acc + s.quantity, 0);
      allocate(lots, qtySold);
      const currentQty = lots.reduce((acc, l) => acc + l.qty, 0);
      const valuation = toFixedNumber(lots.reduce((acc, l) => acc + l.qty * l.unitPrice, 0));
      const avgCost = currentQty > 0 ? toFixedNumber(valuation / currentQty) : 0;
      summary.push({
        sku,
        currentQty,
        avgCost,
        valuation,
        unit: "db",
      });
    }
    return NextResponse.json({ success: true, data: summary });
  } catch (_err: unknown) {
    return NextResponse.json({ success: false, error: "Összesítő hiba" }, { status: 500 });
  }
}
