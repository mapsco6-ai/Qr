import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });
  for (const cat of categories) {
    console.log(`\n=== ${cat.name} (order=${cat.order}, id=${cat.id}) ===`);
    const items = await prisma.menuItem.findMany({
      where: { categoryId: cat.id },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
    for (const item of items) {
      console.log(
        `  order=${item.order} | "${item.name}" | old=${item.oldPrice} new=${item.newPrice} | active=${item.active} | id=${item.id} | createdAt=${item.createdAt.toISOString()}`
      );
    }
  }
}

main()
  .catch((err) => {
    console.error("List failed:", err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
