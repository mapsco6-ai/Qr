import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
  const { name, order } = await request.json();
  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "اسم التصنيف مطلوب" }, { status: 400 });
  }
  const category = await prisma.category.create({
    data: { name: name.trim(), order: Number(order) || 0 },
  });
  return NextResponse.json(category, { status: 201 });
}
