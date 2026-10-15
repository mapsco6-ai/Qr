import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const settings = await prisma.settings.findUnique({
    where: { id: "main" },
    select: { logoUrl: true, updatedAt: true },
  });

  if (!settings?.logoUrl) {
    return new NextResponse(null, { status: 404 });
  }

  const match = settings.logoUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) {
    return new NextResponse(null, { status: 404 });
  }

  const etag = `"${settings.updatedAt.getTime()}"`;
  if (request.headers.get("if-none-match") === etag) {
    return new NextResponse(null, { status: 304 });
  }

  const [, contentType, base64] = match;
  return new NextResponse(Buffer.from(base64, "base64"), {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600, must-revalidate",
      ETag: etag,
    },
  });
}
