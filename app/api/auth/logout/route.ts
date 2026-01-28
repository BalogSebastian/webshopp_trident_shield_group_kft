import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  // Töröljük a sütit (üresre állítjuk és azonnal lejáratjuk)
  (await cookies()).delete("auth_token");

  return NextResponse.json({ success: true });
}