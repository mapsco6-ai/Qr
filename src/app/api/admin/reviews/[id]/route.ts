import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { approved } = await request.json();
  try {
    const review = await prisma.review.update({
      where: { id },
      data: { approved: Boolean(approved) },
    });
    return NextResponse.json(review);
  } catch {
    return NextResponse.json({ error: "التقييم غير موجود" }, { status: 404 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.review.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "التقييم غير موجود" }, { status: 404 });
  }
}
