import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Sale from '@/models/Sale';

// PUT - Értékesítés módosítása
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
      calculatedPurchaseUnitPrice,
      totalPurchaseValue,
      netUnitPrice,
      profit,
      vatRate,
      grossUnitPrice,
      totalGrossPrice
    } = body;

    if (!transactionId || !productId || !saleDate || !productName || !customerName || 
        !quantity || !calculatedPurchaseUnitPrice || !totalPurchaseValue || 
        !netUnitPrice || !profit || vatRate === undefined || !grossUnitPrice || !totalGrossPrice) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Minden kötelező mezőt ki kell tölteni' 
        },
        { status: 400 }
      );
    }

    if (quantity <= 0 || calculatedPurchaseUnitPrice <= 0 || totalPurchaseValue <= 0 || 
        netUnitPrice <= 0 || profit <= 0 || grossUnitPrice <= 0 || totalGrossPrice <= 0) {
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

    const sale = await Sale.findByIdAndUpdate(
      id,
      {
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
        calculatedPurchaseUnitPrice: Number(calculatedPurchaseUnitPrice),
        totalPurchaseValue: Number(totalPurchaseValue),
        netUnitPrice: Number(netUnitPrice),
        profit: Number(profit),
        vatRate: Number(vatRate),
        grossUnitPrice: Number(grossUnitPrice),
        totalGrossPrice: Number(totalGrossPrice),
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!sale) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Az értékesítés nem található' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: sale,
      message: 'Értékesítés sikeresen módosítva'
    });
  } catch (error) {
    console.error('Hiba az értékesítés módosításakor:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Hiba az értékesítés módosításakor' 
      },
      { status: 500 }
    );
  }
}

// DELETE - Értékesítés törlése
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    
    const { id } = await context.params;
    
    const sale = await Sale.findByIdAndDelete(id);
    
    if (!sale) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Az értékesítés nem található' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: sale,
      message: 'Értékesítés sikeresen törölve'
    });
  } catch (error) {
    console.error('Hiba az értékesítés törlésekor:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Hiba az értékesítés törlésekor' 
      },
      { status: 500 }
    );
  }
}
