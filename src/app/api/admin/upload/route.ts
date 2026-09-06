import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

const MAX_SIZE_BYTES = 4 * 1024 * 1024; // 4MB

function extensionFor(mimeType: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/svg+xml": "svg",
  };
  return map[mimeType] ?? "bin";
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "لم يتم إرفاق ملف" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "الملف يجب أن يكون صورة" }, { status: 400 });
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: "حجم الصورة كبير جداً (الحد الأقصى 4 ميجابايت)" },
      { status: 400 }
    );
  }

  const { env } = await getCloudflareContext({ async: true });
  const key = `${crypto.randomUUID()}.${extensionFor(file.type)}`;

  await env.MENU_IMAGES.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type },
  });

  return NextResponse.json({ url: `/api/images/${key}` });
}
