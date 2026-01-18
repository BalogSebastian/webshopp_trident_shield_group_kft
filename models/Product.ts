import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  image: { type: String },
  sku: { type: String, unique: true },
  // EZ AZ ÚJ MEZŐ:
  isActive: { type: Boolean, default: true }, // Alapból minden termék aktív
});

const Product = models.Product || model("Product", ProductSchema);

export default Product;