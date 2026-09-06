import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { name, order } = (await request.json()) as any;
  const prisma = await getPrisma();
  try {
    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(order !== undefined ? { order: Number(order) || 0 } : {}),
      },
    });
    return NextResponse.json(category);
  } catch {
    return NextResponse.json({ error: "التصنيف غير موجود" }, { status: 404 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const prisma = await getPrisma();
  const itemCount = await prisma.menuItem.count({ where: { categoryId: id } });
  if (itemCount > 0) {
    return NextResponse.json(
      { error: "لا يمكن حذف تصنيف يحتوي على منتجات" },
      { status: 400 }
    );
  }
  try {
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "التصنيف غير موجود" }, { status: 404 });
  }
}
