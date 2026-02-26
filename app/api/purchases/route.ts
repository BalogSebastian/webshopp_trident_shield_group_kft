import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Purchase from '@/models/Purchase';
import Product from '@/models/Product';

// GET - Összes beszerzés lekérése
export async function GET() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    
    const purchases = await Purchase.find()
      .sort({ purchaseDate: -1 })
      .lean();
    
    return NextResponse.json({
      success: true,
      data: purchases
    });
  } catch (error) {
    console.error('Hiba a beszerzések lekérésekor:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Hiba a beszerzések lekérésekor' 
      },
      { status: 500 }
    );
  }
}

// POST - Új beszerzés hozzáadása
export async function POST(request: NextRequest) {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    
    const body = await request.json();
    
    // Validáció
    const {
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
      grossTotalPrice
    } = body;

    if (!purchaseDate || !supplierName || !invoiceNumber || !productName || 
        !quantity || !unit || !netUnitPrice || !netTotalPrice || 
        vatRate === undefined || !grossTotalPrice) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Minden kötelező mezőt ki kell tölteni' 
        },
        { status: 400 }
      );
    }

    if (quantity <= 0 || netUnitPrice <= 0 || netTotalPrice <= 0 || grossTotalPrice <= 0) {
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

    const purchase = new Purchase({
      purchaseDate: new Date(purchaseDate),
      supplierName,
      invoiceNumber,
      productName,
      sku: sku || '',
      quantity: Number(quantity),
      unit,
      netUnitPrice: Number(netUnitPrice),
      netTotalPrice: Number(netTotalPrice),
      vatRate: Number(vatRate),
      grossTotalPrice: Number(grossTotalPrice)
    });

    await purchase.save();
    if (sku) {
      const product = await Product.findOne({ sku }).lean();
      if (product) {
        await Product.findByIdAndUpdate(
          (product as unknown as { _id: { toString(): string } })._id,
          { $inc: { stock: Number(quantity) } }
        );
      } else {
        await Product.create({
          name: productName,
          category: 'Import',
          price: Number(netUnitPrice),
          stock: Number(quantity),
          sku,
          image: 'https://via.placeholder.com/150',
          isActive: true,
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: purchase,
      message: 'Beszerzés sikeresen hozzáadva'
    });
  } catch (error) {
    console.error('Hiba a beszerzés hozzáadásakor:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Hiba a beszerzés hozzáadásakor' 
      },
      { status: 500 }
    );
  }
}
