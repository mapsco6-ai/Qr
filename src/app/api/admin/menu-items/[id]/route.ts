import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = (await request.json()) as any;
  const {
    name,
    description,
    image,
    categoryId,
    productCost,
    saladCost,
    oldPrice,
    newPrice,
    isOffer,
    offerNote,
    active,
    order,
  } = body ?? {};

  const prisma = await getPrisma();
  try {
    const item = await prisma.menuItem.update({
      where: { id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(image !== undefined ? { image } : {}),
        ...(categoryId !== undefined ? { categoryId } : {}),
        ...(productCost !== undefined ? { productCost: Number(productCost) || 0 } : {}),
        ...(saladCost !== undefined ? { saladCost: Number(saladCost) || 0 } : {}),
        ...(oldPrice !== undefined ? { oldPrice: Number(oldPrice) || 0 } : {}),
        ...(newPrice !== undefined ? { newPrice: Number(newPrice) || 0 } : {}),
        ...(isOffer !== undefined ? { isOffer: Boolean(isOffer) } : {}),
        ...(offerNote !== undefined ? { offerNote } : {}),
        ...(active !== undefined ? { active: Boolean(active) } : {}),
        ...(order !== undefined ? { order: Number(order) || 0 } : {}),
      },
    });
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "العنصر غير موجود" }, { status: 404 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const prisma = await getPrisma();
  try {
    await prisma.menuItem.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "العنصر غير موجود" }, { status: 404 });
  }
}
