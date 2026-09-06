import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

const VALID_STATUSES = ["new", "in_progress", "resolved"];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { status } = (await request.json()) as any;
  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "حالة غير صالحة" }, { status: 400 });
  }
  const prisma = await getPrisma();
  try {
    const complaint = await prisma.complaint.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json(complaint);
  } catch {
    return NextResponse.json({ error: "الشكوى غير موجودة" }, { status: 404 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const prisma = await getPrisma();
  try {
    await prisma.complaint.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "الشكوى غير موجودة" }, { status: 404 });
  }
}
