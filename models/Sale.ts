import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema({
  // Alap adatok
  transactionId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  saleDate: {
    type: Date,
    required: true
  },
  productName: {
    type: String,
    required: true,
    trim: true
  },
  
  // Vásárló adatok
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  companyName: {
    type: String,
    trim: true
  },
  taxNumber: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  contactPerson: {
    type: String,
    trim: true
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  shippingAddress: {
    type: String,
    trim: true
  },
  
  // Mennyiségi adatok
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Beszerzési adatok
  calculatedPurchaseUnitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  totalPurchaseValue: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Eladási adatok
  netUnitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  profit: {
    type: Number,
    required: true,
    min: 0
  },
  vatRate: {
    type: Number,
    required: true,
    min: 0,
    max: 27
  },
  grossUnitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  totalGrossPrice: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

// Indexek a gyors kereséshez
saleSchema.index({ transactionId: 1 });
saleSchema.index({ saleDate: -1 });
saleSchema.index({ customerName: 1 });
saleSchema.index({ productName: 1 });

export default mongoose.models.Sale || mongoose.model('Sale', saleSchema);
