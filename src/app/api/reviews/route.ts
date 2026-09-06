import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const menuItemId = request.nextUrl.searchParams.get("menuItemId");
  const prisma = await getPrisma();

  const reviews = await prisma.review.findMany({
    where: {
      approved: true,
      ...(menuItemId ? { menuItemId } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json(reviews);
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as any;
  const { customerName, rating, comment, menuItemId } = body ?? {};

  if (
    typeof customerName !== "string" ||
    !customerName.trim() ||
    typeof rating !== "number" ||
    rating < 1 ||
    rating > 5
  ) {
    return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });
  }

  const prisma = await getPrisma();
  const review = await prisma.review.create({
    data: {
      customerName: customerName.trim().slice(0, 100),
      rating: Math.round(rating),
      comment: typeof comment === "string" ? comment.trim().slice(0, 1000) : null,
      menuItemId: typeof menuItemId === "string" && menuItemId ? menuItemId : null,
      approved: false,
    },
  });

  return NextResponse.json({ ok: true, id: review.id }, { status: 201 });
}
