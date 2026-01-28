import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    await connectDB();

    // 1. Megnézzük, létezik-e már
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ success: false, error: "Ez az email már foglalt." }, { status: 400 });
    }

    // 2. Jelszó titkosítása
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. 6 jegyű token generálása és lejárat (10 perc)
    const verifyToken = Math.floor(100000 + Math.random() * 900000).toString();
    const verifyTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // Most + 10 perc

    // 4. Felhasználó mentése (még NEM aktív)
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      verifyToken,
      verifyTokenExpiry,
      isVerified: false
    });

    // 5. Email küldése Nodemailerrel
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: '"Munkavédelem Manager" <no-reply@munkavedelem.hu>',
      to: email,
      subject: "Fiók hitelesítése - Munkavédelem",
      html: `
        <h1>Üdvözöljük, ${name}!</h1>
        <p>A regisztráció véglegesítéséhez kérjük adja meg az alábbi kódot:</p>
        <h2 style="color: blue; letter-spacing: 5px;">${verifyToken}</h2>
        <p>A kód 10 percig érvényes.</p>
      `,
    });

    return NextResponse.json({ success: true, message: "Kód elküldve!" });

  } catch (error) {
    console.error("Regisztrációs hiba:", error);
    return NextResponse.json({ success: false, error: "Szerver hiba" }, { status: 500 });
  }
}