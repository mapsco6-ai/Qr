import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { CATEGORIES } from "./seed-data";

const prisma = new PrismaClient();

async function main() {
  for (let i = 0; i < CATEGORIES.length; i++) {
    const cat = CATEGORIES[i];
    const category = await prisma.category.upsert({
      where: { name: cat.name },
      update: { order: i },
      create: { name: cat.name, order: i },
    });

    for (let j = 0; j < cat.items.length; j++) {
      const item = cat.items[j];
      const existing = await prisma.menuItem.findFirst({
        where: { name: item.name, categoryId: category.id },
      });

      if (existing) {
        await prisma.menuItem.update({ where: { id: existing.id }, data: { order: j } });
        continue;
      }

      await prisma.menuItem.create({
        data: {
          name: item.name,
          description: item.description ?? null,
          categoryId: category.id,
          productCost: item.productCost,
          saladCost: item.saladCost,
          oldPrice: item.oldPrice,
          newPrice: item.newPrice,
          isOffer: item.isOffer ?? false,
          offerNote: item.offerNote ?? null,
          order: j,
        },
      });
    }
  }

  await prisma.settings.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      siteName: "خان الجمر",
      tagline: "سيّد المشويات التركية",
    },
  });

  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "changeme123";

  const existingAdmin = await prisma.adminUser.findUnique({
    where: { username: adminUsername },
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await prisma.adminUser.create({
      data: { username: adminUsername, passwordHash },
    });
    console.log(`Admin user created: ${adminUsername}`);
    if (!process.env.ADMIN_PASSWORD) {
      console.warn(
        "WARNING: using default admin password 'changeme123'. Set ADMIN_PASSWORD env var and re-seed for production."
      );
    }
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
