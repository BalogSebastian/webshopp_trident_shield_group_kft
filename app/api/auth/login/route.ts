import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    await connectDB();

    const user = await User.findOne({ email });

    if (!user || !user.isVerified) {
       // Ha nincs user, vagy nincs verifikálva
       return NextResponse.json({ success: false, error: "Hibás adatok vagy nem hitelesített fiók." }, { status: 401 });
    }

    // Jelszó ellenőrzés
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
       return NextResponse.json({ success: false, error: "Hibás jelszó." }, { status: 401 });
    }

    // JWT Token készítése
    const token = jwt.sign(
      { userId: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    // Süti beállítása (Next.js 15+ kompatibilis)
    // Megjegyzés: Next 15-ben a cookies() await-elendő lehet, de Route Handlerben így működik:
    (await cookies()).set("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 86400, // 1 nap
        path: "/",
    });

    return NextResponse.json({ success: true, user: { name: user.name, email: user.email } });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Bejelentkezési hiba" }, { status: 500 });
  }
}