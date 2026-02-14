import mongoose from 'mongoose';

const PurchaseSchema = new mongoose.Schema({
  purchaseDate: {
    type: Date,
    required: true
  },
  supplierName: {
    type: String,
    required: true
  },
  invoiceNumber: {
    type: String,
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  sku: {
    type: String,
    required: false
  },
  quantity: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true
  },
  netUnitPrice: {
    type: Number,
    required: true
  },
  netTotalPrice: {
    type: Number,
    required: true
  },
  vatRate: {
    type: Number,
    required: true,
    min: 0,
    max: 27
  },
  grossTotalPrice: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexek a jobb kereséshez
PurchaseSchema.index({ purchaseDate: -1 });
PurchaseSchema.index({ supplierName: 1 });
PurchaseSchema.index({ invoiceNumber: 1 });
PurchaseSchema.index({ productName: 1 });
PurchaseSchema.index({ sku: 1 });

export default mongoose.models.Purchase || mongoose.model('Purchase', PurchaseSchema);
