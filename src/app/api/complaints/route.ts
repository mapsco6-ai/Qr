import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as any;
  const { customerName, phone, message } = body ?? {};

  if (
    typeof customerName !== "string" ||
    !customerName.trim() ||
    typeof message !== "string" ||
    !message.trim()
  ) {
    return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });
  }

  const prisma = await getPrisma();
  const complaint = await prisma.complaint.create({
    data: {
      customerName: customerName.trim().slice(0, 100),
      phone: typeof phone === "string" ? phone.trim().slice(0, 30) : null,
      message: message.trim().slice(0, 2000),
    },
  });

  return NextResponse.json({ ok: true, id: complaint.id }, { status: 201 });
}
