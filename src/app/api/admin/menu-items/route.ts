import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const items = await prisma.menuItem.findMany({
    include: { category: true },
    orderBy: [{ category: { order: "asc" } }, { order: "asc" }, { createdAt: "asc" }],
  });
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
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

  if (typeof name !== "string" || !name.trim() || typeof categoryId !== "string") {
    return NextResponse.json({ error: "الاسم والتصنيف مطلوبان" }, { status: 400 });
  }

  const item = await prisma.menuItem.create({
    data: {
      name: name.trim(),
      description: typeof description === "string" ? description : null,
      image: typeof image === "string" ? image : null,
      categoryId,
      productCost: Number(productCost) || 0,
      saladCost: Number(saladCost) || 0,
      oldPrice: Number(oldPrice) || 0,
      newPrice: Number(newPrice) || 0,
      isOffer: Boolean(isOffer),
      offerNote: typeof offerNote === "string" ? offerNote : null,
      active: active === undefined ? true : Boolean(active),
      order: Number(order) || 0,
    },
  });

  return NextResponse.json(item, { status: 201 });
}
