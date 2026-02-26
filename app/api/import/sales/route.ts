import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Sale from "@/models/Sale";
import Purchase from "@/models/Purchase";
import Product from "@/models/Product";
import { parseCsv, parseHungarianDate, parseHungarianNumber, toFixedNumber } from "@/lib/utils";

type Lot = { date: Date; qty: number; unitPrice: number };
type SalesItem = {
  transactionId: string;
  sku: string;
  saleDate: Date;
  productName: string;
  customerName: string;
  companyName: string;
  taxNumber: string;
  address: string;
  contactPerson: string;
  phoneNumber: string;
  shippingAddress: string;
  quantity: number;
  netUnitPrice: number;
  vatRate: number;
  grossUnitPrice: number;
  totalGrossPrice: number;
};

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
    const csv: string = body.csv || "";
    if (!csv || typeof csv !== "string") {
      return NextResponse.json({ success: false, error: "Hiányzó CSV tartalom" }, { status: 400 });
    }
    const rows = parseCsv(csv);
    if (rows.length < 2) {
      return NextResponse.json({ success: false, error: "Üres CSV" }, { status: 400 });
    }
    const header = rows[0].map((h) => h.trim());
    const idx = (name: string) => header.findIndex((h) => h.toLowerCase() === name.toLowerCase());
    const iTransactionId = idx("Tranzakció ID");
    const iSku = idx("Termék ID");
    const iSaleDate = idx("Értékesítési Dátum");
    const iProductName = idx("Terméknév");
    const iCustomerName = idx("Vásárló neve");
    const iQuantity = idx("Mennyiség");
    const iNetUnitPrice = idx("Nettó Eladási ár / db");
    const iVatRate = idx("Áfa kulcs");
    const iCompanyName = idx("Cégnév");
    const iTaxNumber = idx("Adószám");
    const iAddress = idx("Cím");
    const iContactPerson = idx("Kapcsolattartó neve");
    const iPhoneNumber = idx("Telefonszám");
    const iShippingAddress = idx("Szállítási cím");

    const dataRows = rows.slice(1);
    const salesBySku: Record<string, SalesItem[]> = {};
    for (const r of dataRows) {
      const sku = r[iSku] || "";
      if (!sku) continue;
      const saleDate = parseHungarianDate(r[iSaleDate]);
      const productName = r[iProductName] || "";
      const customerName = r[iCustomerName] || "";
      const quantity = parseHungarianNumber(r[iQuantity]);
      const netUnitPrice = toFixedNumber(parseHungarianNumber(r[iNetUnitPrice]));
      const vatRate = parseHungarianNumber(r[iVatRate]);
      const companyName = iCompanyName >= 0 ? r[iCompanyName] || "" : "";
      const taxNumber = iTaxNumber >= 0 ? r[iTaxNumber] || "" : "";
      const address = iAddress >= 0 ? r[iAddress] || "" : "";
      const contactPerson = iContactPerson >= 0 ? r[iContactPerson] || "" : "";
      const phoneNumber = iPhoneNumber >= 0 ? r[iPhoneNumber] || "" : "";
      const shippingAddress = iShippingAddress >= 0 ? r[iShippingAddress] || "" : "";
      let transactionId = iTransactionId >= 0 ? (r[iTransactionId] || "") : "";
      if (!transactionId || transactionId.trim() === "") {
        transactionId = `CSV-${sku}-${saleDate.getTime()}`;
      }
      if (quantity <= 0) continue;
      const grossUnitPrice = toFixedNumber(netUnitPrice * (1 + vatRate / 100));
      const totalGrossPrice = toFixedNumber(grossUnitPrice * quantity);
      const item: SalesItem = {
        transactionId,
        sku,
        saleDate,
        productName,
        customerName,
        companyName,
        taxNumber,
        address,
        contactPerson,
        phoneNumber,
        shippingAddress,
        quantity,
        netUnitPrice,
        vatRate,
        grossUnitPrice,
        totalGrossPrice,
      };
      if (!salesBySku[sku]) salesBySku[sku] = [];
      salesBySku[sku].push(item);
    }
    const createdDocs: {
      transactionId: string;
      productId: mongoose.Types.ObjectId;
      saleDate: Date;
      productName: string;
      customerName: string;
      companyName: string;
      taxNumber: string;
      address: string;
      contactPerson: string;
      phoneNumber: string;
      shippingAddress: string;
      quantity: number;
      calculatedPurchaseUnitPrice: number;
      totalPurchaseValue: number;
      netUnitPrice: number;
      profit: number;
      vatRate: number;
      grossUnitPrice: number;
      totalGrossPrice: number;
    }[] = [];
    for (const [sku, items] of Object.entries(salesBySku)) {
      items.sort((a, b) => a.saleDate.getTime() - b.saleDate.getTime());
      const purchases = await Purchase.find({ sku }).sort({ purchaseDate: 1 }).lean();
      const lots: Lot[] = purchases.map((p) => ({
        date: new Date(p.purchaseDate),
        qty: p.quantity,
        unitPrice: p.netUnitPrice,
      }));
      const product = await Product.findOne({ sku });
      let productId: mongoose.Types.ObjectId | undefined = product?._id;
      if (!productId) {
        const name = items[0]?.productName || sku;
        const priceForProduct = items[0]?.netUnitPrice || 0;
        const newProduct = await Product.create({
          name,
          category: "Import",
          price: priceForProduct,
          stock: 0,
          sku,
          image: "https://via.placeholder.com/150",
          isActive: true,
        });
        productId = newProduct._id;
      }
      const existingForSku = await Sale.find({ productId }).sort({ saleDate: 1 }).lean();
      for (const s of existingForSku) {
        allocate(lots, s.quantity);
      }
      for (const item of items) {
        const res = allocate(lots, item.quantity);
        const totalCost = toFixedNumber(res.cost);
        const calcUnit = item.quantity > 0 ? toFixedNumber(totalCost / item.quantity) : 0;
        const profit = toFixedNumber(item.netUnitPrice * item.quantity - totalCost);
        createdDocs.push({
          transactionId: item.transactionId,
          productId: productId!,
          saleDate: item.saleDate,
          productName: item.productName,
          customerName: item.customerName,
          companyName: item.companyName,
          taxNumber: item.taxNumber,
          address: item.address,
          contactPerson: item.contactPerson,
          phoneNumber: item.phoneNumber,
          shippingAddress: item.shippingAddress,
          quantity: item.quantity,
          calculatedPurchaseUnitPrice: calcUnit,
          totalPurchaseValue: totalCost,
          netUnitPrice: item.netUnitPrice,
          profit,
          vatRate: item.vatRate,
          grossUnitPrice: item.grossUnitPrice,
          totalGrossPrice: item.totalGrossPrice,
        });
      }
    }
    if (createdDocs.length === 0) {
      return NextResponse.json({ success: false, error: "Nincs importálható sor" }, { status: 400 });
    }
    const created = await Sale.insertMany(createdDocs, { ordered: false });
    const stockDelta: Record<string, number> = {};
    for (const doc of createdDocs) {
      const p = await Product.findById(doc.productId).lean();
      const sku = (p as unknown as { sku?: string })?.sku || "";
      if (sku) {
        stockDelta[sku] = (stockDelta[sku] || 0) - Number(doc.quantity);
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
      }
    }
    return NextResponse.json({ success: true, count: created.length });
  } catch (_err: unknown) {
    return NextResponse.json({ success: false, error: "Import hiba" }, { status: 500 });
  }
}
