import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const items = await prisma.menuItem.findMany({
    where: { active: true },
    include: { category: true },
    orderBy: [{ category: { order: "asc" } }, { order: "asc" }, { createdAt: "asc" }],
  });

  return NextResponse.json(items);
}
