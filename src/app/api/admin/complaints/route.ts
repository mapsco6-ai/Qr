import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const prisma = await getPrisma();
  const complaints = await prisma.complaint.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(complaints);
}
