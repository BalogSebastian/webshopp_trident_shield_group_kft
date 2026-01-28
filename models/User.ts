import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  // Verifikációhoz kellő adatok
  isVerified: { type: Boolean, default: false },
  verifyToken: { type: String }, // A 6 jegyű kód
  verifyTokenExpiry: { type: Date }, // Mikor jár le
  
  createdAt: { type: Date, default: Date.now },
});

const User = models.User || model("User", UserSchema);

export default User;