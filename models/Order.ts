// models/Order.ts
import mongoose, { Schema, model, models } from "mongoose";

const OrderSchema = new Schema({
  // TRDNT-XXX azonosító
  transactionId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  
  // Termék adatok
  productName: { type: String, required: true },
  
  // Vásárló adatok
  customerName: { type: String, required: true },
  email: { type: String }, // Opcionális, de jó ha van
  
  // Számok
  quantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true }, // Bruttó végösszeg
  
  // Státusz (hogy tudd követni, hol tart a rendelés)
  status: { 
    type: String, 
    default: "Feldolgozás alatt", 
    enum: ["Feldolgozás alatt", "Csomagolás", "Szállítás", "Teljesítve", "Törölve"] 
  },
  
  // Dátum (automatikus)
  createdAt: { type: Date, default: Date.now },
});

// Ez a trükk kell Next.js-hez, hogy ne akarja 2x létrehozni a modellt:
const Order = models.Order || model("Order", OrderSchema);

export default Order;