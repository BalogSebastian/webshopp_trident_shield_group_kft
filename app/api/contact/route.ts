import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, email, phone, company, message } = await req.json();
    if (!name || !email || !message) {
      return NextResponse.json({ success: false, error: "Név, email és üzenet kötelező" }, { status: 400 });
    }
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    const to = process.env.CONTACT_TO || process.env.SMTP_USER || "";
    const subject = `Kapcsolatfelvétel: ${name}`;
    const text = [
      `Név: ${name}`,
      `Email: ${email}`,
      `Telefon: ${phone || "-"}`,
      `Cég: ${company || "-"}`,
      "",
      message,
    ].join("\n");
    await transporter.sendMail({
      from: `"Webshop Kapcsolat" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
    });
    return NextResponse.json({ success: true });
  } catch (_err: unknown) {
    return NextResponse.json({ success: false, error: "Küldési hiba" }, { status: 500 });
  }
}
