import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const settings = await prisma.settings.findUnique({ where: { id: "main" } });

  return NextResponse.json({
    siteName: settings?.siteName ?? "خان الجمر",
    tagline: settings?.tagline ?? "سيّد المشويات التركية",
    logoUrl: settings?.logoUrl ?? null,
  });
}
