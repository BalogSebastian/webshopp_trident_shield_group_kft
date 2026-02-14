import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Purchase from '@/models/Purchase';

// PUT - Beszerzés módosítása
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    
    const body = await request.json();
    const { id } = await context.params;
    
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

    const purchase = await Purchase.findByIdAndUpdate(
      id,
      {
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
        grossTotalPrice: Number(grossTotalPrice),
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!purchase) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'A beszerzés nem található' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: purchase,
      message: 'Beszerzés sikeresen módosítva'
    });
  } catch (error) {
    console.error('Hiba a beszerzés módosításakor:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Hiba a beszerzés módosításakor' 
      },
      { status: 500 }
    );
  }
}

// DELETE - Beszerzés törlése
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    
    const { id } = await context.params;
    
    const purchase = await Purchase.findByIdAndDelete(id);
    
    if (!purchase) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'A beszerzés nem található' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: purchase,
      message: 'Beszerzés sikeresen törölve'
    });
  } catch (error) {
    console.error('Hiba a beszerzés törlésekor:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Hiba a beszerzés törlésekor' 
      },
      { status: 500 }
    );
  }
}
