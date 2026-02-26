import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await connectDB();

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json(
        { message: "Felhasználó nem található" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Felhasználó sikeresen törölve" });
  } catch (error) {
    console.error("Hiba a felhasználó törlésekor:", error);
    return NextResponse.json(
      { message: "Hiba történt a felhasználó törlésekor" },
      { status: 500 }
    );
  }
}
