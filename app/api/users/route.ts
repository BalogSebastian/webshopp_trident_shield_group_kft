import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    // Eltávolítottuk az admin jogosultság ellenőrzését
    /*
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token");

    if (!token) {
      return NextResponse.json({ message: "Nem vagy bejelentkezve" }, { status: 401 });
    }

    try {
      jwt.verify(token.value, process.env.JWT_SECRET!);
    } catch (err) {
      return NextResponse.json({ message: "Érvénytelen token" }, { status: 401 });
    }
    */

    await connectDB();
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Hiba a felhasználók lekérdezésekor:", error);
    return NextResponse.json(
      { message: "Hiba történt a felhasználók lekérdezésekor" },
      { status: 500 }
    );
  }
}
