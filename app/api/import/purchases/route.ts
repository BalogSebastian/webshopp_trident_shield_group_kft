import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Purchase from "@/models/Purchase";
import Product from "@/models/Product";
import { parseCsv, parseHungarianDate, parseHungarianNumber, toFixedNumber } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    const body = await req.json();
    const csv: string = body.csv || "";
    if (!csv || typeof csv !== "string") {
      return NextResponse.json({ success: false, error: "Hiányzó CSV tartalom" }, { status: 400 });
    }
    const rows = parseCsv(csv);
    if (rows.length < 2) {
      return NextResponse.json({ success: false, error: "Üres CSV" }, { status: 400 });
    }
    const dataRows = rows.slice(1);
    type PurchaseInput = {
      purchaseDate: Date;
      supplierName: string;
      invoiceNumber: string;
      productName: string;
      sku: string;
      quantity: number;
      unit: string;
      netUnitPrice: number;
      netTotalPrice: number;
      vatRate: number;
      grossTotalPrice: number;
    };
    const docs: PurchaseInput[] = [];
    for (const r of dataRows) {
      const purchaseDate = parseHungarianDate(r[0]);
      const supplierName = r[1] || "";
      const invoiceNumber = r[2] || "";
      const productName = r[3] || "";
      const sku = r[4] || "";
      const quantity = parseHungarianNumber(r[5]);
      const unit = (r[6] || "db").toLowerCase();
      const netUnitPrice = toFixedNumber(parseHungarianNumber(r[7]));
      const netTotalPrice = toFixedNumber(parseHungarianNumber(r[8]));
      const vatRate = parseHungarianNumber(r[9]);
      const grossTotalPrice = toFixedNumber(parseHungarianNumber(r[10]));
      if (!productName || !invoiceNumber || !supplierName) continue;
      if (quantity <= 0) continue;
      docs.push({
        purchaseDate,
        supplierName,
        invoiceNumber,
        productName,
        sku,
        quantity,
        unit,
        netUnitPrice,
        netTotalPrice,
        vatRate,
        grossTotalPrice,
      });
      if (sku) {
        const existing = await Product.findOne({ sku }).lean();
        if (!existing) {
          const priceForProduct = netUnitPrice;
          await Product.create({
            name: productName,
            category: "Import",
            price: priceForProduct,
            stock: 0,
            sku,
            image: "https://via.placeholder.com/150",
            isActive: true,
          });
        }
      }
    }
    if (docs.length === 0) {
      return NextResponse.json({ success: false, error: "Nincs importálható sor" }, { status: 400 });
    }
    const created = await Purchase.insertMany(docs, { ordered: false });
    const stockDelta: Record<string, number> = {};
    for (const d of docs) {
      if (d.sku) {
        stockDelta[d.sku] = (stockDelta[d.sku] || 0) + Number(d.quantity);
      }
    }
    const skus = Object.keys(stockDelta);
    for (const sku of skus) {
      const product = await Product.findOne({ sku }).lean();
      if (product) {
        await Product.findByIdAndUpdate(
          (product as unknown as { _id: { toString(): string } })._id,
          { $inc: { stock: stockDelta[sku] } }
        );
      } else {
        await Product.create({
          name: "Importált termék",
          category: "Import",
          price: 0,
          stock: stockDelta[sku],
          sku,
          image: "https://via.placeholder.com/150",
          isActive: true,
        });
      }
    }
    return NextResponse.json({ success: true, count: created.length });
  } catch (_err: unknown) {
    return NextResponse.json({ success: false, error: "Import hiba" }, { status: 500 });
  }
}
