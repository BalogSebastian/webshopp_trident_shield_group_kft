import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { email, token } = await req.json();
    await connectDB();

    const user = await User.findOne({ 
      email, 
      verifyToken: token, 
      verifyTokenExpiry: { $gt: Date.now() } // Ellenőrizzük, hogy nem járt-e le
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "Érvénytelen vagy lejárt kód." }, { status: 400 });
    }

    // Sikeres verifikáció
    user.isVerified = true;
    user.verifyToken = undefined; // Töröljük a tokent
    user.verifyTokenExpiry = undefined;
    await user.save();

    return NextResponse.json({ success: true, message: "Sikeres hitelesítés!" });

  } catch (error) {
    return NextResponse.json({ success: false, error: "Hiba történt." }, { status: 500 });
  }
}