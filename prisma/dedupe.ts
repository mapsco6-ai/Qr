import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function normalize(name: string) {
  return name.trim().replace(/\s+/g, " ");
}

async function main() {
  const items = await prisma.menuItem.findMany({
    include: { category: true },
    orderBy: [{ categoryId: "asc" }, { order: "asc" }, { createdAt: "asc" }],
  });

  const groups = new Map<string, typeof items>();
  for (const item of items) {
    const key = `${item.categoryId}::${normalize(item.name)}`;
    const group = groups.get(key);
    if (group) group.push(item);
    else groups.set(key, [item]);
  }

  let removedCount = 0;

  for (const group of groups.values()) {
    if (group.length < 2) continue;

    const keeper =
      group.find((i) => i.image) ??
      [...group].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())[0];

    console.log(
      `تكرار وُجد: "${keeper.name}" (${keeper.category.name}) - ${group.length} نسخ. الاحتفاظ بـ ${keeper.id}`
    );

    for (const item of group) {
      if (item.id === keeper.id) continue;
      await prisma.menuItem.deleteMany({ where: { id: item.id } });
      removedCount++;
      console.log(`  حذف نسخة مكررة: ${item.id}`);
    }
  }

  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });
  for (const category of categories) {
    const remaining = await prisma.menuItem.findMany({
      where: { categoryId: category.id },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
    for (let i = 0; i < remaining.length; i++) {
      if (remaining[i].order !== i) {
        await prisma.menuItem.update({ where: { id: remaining[i].id }, data: { order: i } });
      }
    }
  }

  console.log(`اكتمل التنظيف: تم حذف ${removedCount} عنصر مكرر.`);
}

main()
  .catch((err) => {
    console.error("Dedupe failed:", err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
