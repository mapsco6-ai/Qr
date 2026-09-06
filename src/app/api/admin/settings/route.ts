import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const prisma = await getPrisma();
  const settings = await prisma.settings.upsert({
    where: { id: "main" },
    update: {},
    create: { id: "main" },
  });
  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  const { siteName, tagline, logoUrl } = (await request.json()) as any;

  const prisma = await getPrisma();
  const settings = await prisma.settings.upsert({
    where: { id: "main" },
    update: {
      ...(siteName !== undefined ? { siteName } : {}),
      ...(tagline !== undefined ? { tagline } : {}),
      ...(logoUrl !== undefined ? { logoUrl } : {}),
    },
    create: {
      id: "main",
      siteName: siteName || "خان الجمر",
      tagline: tagline || "سيّد المشويات التركية",
      logoUrl: logoUrl || null,
    },
  });

  return NextResponse.json(settings);
}
