import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Sale from '@/models/Sale';
import Purchase from '@/models/Purchase';
import Product from '@/models/Product';
import { toFixedNumber } from '@/lib/utils';

// ÖSSZES ÉRTÉKESÍTÉS LEKÉRÉSE (GET)
export async function GET() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    
    // Összes értékesítés lekérése dátum szerint csökkenő sorrendben
    const sales = await Sale.find().sort({ saleDate: -1 });
    
    return NextResponse.json({
      success: true,
      data: sales
    });
  } catch (error) {
    console.error('Hiba az értékesítések lekérésekor:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Hiba az értékesítések lekérésekor' 
      },
      { status: 500 }
    );
  }
}

// ÚJ ÉRTÉKESÍTÉS HOZZÁADÁSA (POST)
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
  return { remaining, cost };
}

export async function POST(req: Request) {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    
    const body = await req.json();
    
    // Validáció
    const {
      transactionId,
      productId,
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
      totalGrossPrice
    } = body;

    if (!transactionId || !productId || !saleDate || !productName || !customerName || 
        !quantity || !netUnitPrice || vatRate === undefined || !grossUnitPrice || !totalGrossPrice) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Minden kötelező mezőt ki kell tölteni' 
        },
        { status: 400 }
      );
    }

    if (quantity <= 0 || netUnitPrice <= 0 || grossUnitPrice <= 0 || totalGrossPrice <= 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'A számoknak pozitívnak kell lenniük' 
        },
        { status: 400 }
      );
    }

    if (vatRate < 0 || vatRate > 27) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Az ÁFA 0% és 27% között lehet' 
        },
        { status: 400 }
      );
    }

    // Ellenőrizzük, hogy a tranzakció ID egyedi-e
    const existingSale = await Sale.findOne({ transactionId });
    if (existingSale) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Ez a tranzakció ID már létezik' 
        },
        { status: 400 }
      );
    }

    const product = await Product.findById(productId).lean();
    if (!product) {
      return NextResponse.json({ success: false, error: 'Termék nem található' }, { status: 404 });
    }
    const sku = (product as unknown as { sku?: string }).sku || '';
    const purchases = await Purchase.find({ sku }).sort({ purchaseDate: 1 }).lean();
    const lots: Lot[] = purchases.map((p) => ({ qty: p.quantity, unitPrice: p.netUnitPrice }));
    const existingSales = await Sale.find({ productId }).sort({ saleDate: 1 }).lean();
    for (const s of existingSales) {
      allocate(lots, s.quantity);
    }
    const availableQty = lots.reduce((acc, l) => acc + l.qty, 0);
    if (availableQty < Number(quantity)) {
      return NextResponse.json({ success: false, error: 'Nincs elegendő készlet' }, { status: 400 });
    }
    const allocation = allocate(lots, Number(quantity));
    const totalCost = toFixedNumber(allocation.cost);
    const unitCost = Number(quantity) > 0 ? toFixedNumber(totalCost / Number(quantity)) : 0;
    const profit = toFixedNumber(Number(netUnitPrice) * Number(quantity) - totalCost);

    const newSale = await Sale.create({
      transactionId,
      productId,
      saleDate: new Date(saleDate),
      productName,
      customerName,
      companyName: companyName || '',
      taxNumber: taxNumber || '',
      address: address || '',
      contactPerson: contactPerson || '',
      phoneNumber: phoneNumber || '',
      shippingAddress: shippingAddress || '',
      quantity: Number(quantity),
      calculatedPurchaseUnitPrice: unitCost,
      totalPurchaseValue: totalCost,
      netUnitPrice: Number(netUnitPrice),
      profit,
      vatRate: Number(vatRate),
      grossUnitPrice: Number(grossUnitPrice),
      totalGrossPrice: Number(totalGrossPrice)
    });

    await Product.findByIdAndUpdate((product as unknown as { _id: { toString(): string } })._id, {
      $inc: { stock: -Number(quantity) },
    });

    return NextResponse.json({
      success: true,
      data: newSale,
      message: 'Értékesítés sikeresen hozzáadva'
    });
  } catch (error) {
    console.error('Hiba az értékesítés létrehozásakor:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Hiba az értékesítés létrehozásakor' 
      },
      { status: 500 }
    );
  }
}
