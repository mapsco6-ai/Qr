import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

interface SeedItem {
  name: string;
  description?: string;
  productCost: number;
  saladCost: number;
  oldPrice: number;
  newPrice: number;
  isOffer?: boolean;
  offerNote?: string;
}

interface SeedCategory {
  name: string;
  items: SeedItem[];
}

const CATEGORIES: SeedCategory[] = [
  {
    name: "المشاوي",
    items: [
      { name: "اورفا", productCost: 2800, saladCost: 1700, oldPrice: 6750, newPrice: 7250 },
      { name: "ادانا", productCost: 2800, saladCost: 1700, oldPrice: 6750, newPrice: 7250 },
      { name: "بذنجان", productCost: 3200, saladCost: 1700, oldPrice: 6750, newPrice: 7750 },
      { name: "كوفتة مشوية", productCost: 2650, saladCost: 1700, oldPrice: 7250, newPrice: 7750 },
      { name: "تكة لحم", productCost: 4500, saladCost: 1700, oldPrice: 6750, newPrice: 8750 },
      { name: "معلاك", productCost: 2500, saladCost: 1700, oldPrice: 6750, newPrice: 7250 },
      { name: "ستيك دجاج", productCost: 2500, saladCost: 1700, oldPrice: 5750, newPrice: 6250 },
      { name: "تكة دجاج", productCost: 1500, saladCost: 1700, oldPrice: 5250, newPrice: 5750 },
      { name: "جناح", productCost: 1800, saladCost: 1700, oldPrice: 5250, newPrice: 5750 },
      {
        name: "وجبة لحم بالعجين",
        productCost: 1800,
        saladCost: 1700,
        oldPrice: 4500,
        newPrice: 5250,
      },
      {
        name: "كباب باللحم بالعجين",
        productCost: 4600,
        saladCost: 1700,
        oldPrice: 8750,
        newPrice: 9750,
      },
      {
        name: "إسكندر كباب",
        productCost: 8500,
        saladCost: 1700,
        oldPrice: 14750,
        newPrice: 14750,
      },
      { name: "كوفتة الجمر", productCost: 3750, saladCost: 1700, oldPrice: 9750, newPrice: 9750 },
    ],
  },
  {
    name: "الدوروم",
    items: [
      { name: "دوروم كباب ادنا", productCost: 3000, saladCost: 0, oldPrice: 4500, newPrice: 4500 },
      {
        name: "دوروم كباب اورفا",
        productCost: 3000,
        saladCost: 0,
        oldPrice: 4500,
        newPrice: 4500,
      },
      { name: "دوروم معلاك", productCost: 2400, saladCost: 0, oldPrice: 4000, newPrice: 4000 },
      { name: "دوروم كوفته", productCost: 2500, saladCost: 0, oldPrice: 4000, newPrice: 4000 },
    ],
  },
  {
    name: "مقبلات وشوربات",
    items: [
      { name: "شوربة", productCost: 500, saladCost: 0, oldPrice: 1000, newPrice: 1000 },
      {
        name: "مقبلات طبق عائلي",
        productCost: 2000,
        saladCost: 0,
        oldPrice: 4000,
        newPrice: 4000,
      },
      { name: "مقبلات طبق وسط", productCost: 1500, saladCost: 0, oldPrice: 3000, newPrice: 3000 },
      { name: "طبق برغل", productCost: 500, saladCost: 0, oldPrice: 1250, newPrice: 1000 },
    ],
  },
  {
    name: "حلويات ومشروبات",
    items: [
      { name: "حلويات", productCost: 1500, saladCost: 0, oldPrice: 2500, newPrice: 1500 },
      {
        name: "بطل عصير شلغم (حار أو بارد)",
        productCost: 1250,
        saladCost: 0,
        oldPrice: 2000,
        newPrice: 2000,
      },
      { name: "مشروب غازي / لبن", productCost: 400, saladCost: 0, oldPrice: 750, newPrice: 750 },
      { name: "ماء", productCost: 100, saladCost: 0, oldPrice: 500, newPrice: 500 },
    ],
  },
  {
    name: "عروض فردية",
    items: [
      {
        name: "عرض كباب + دجاج",
        productCost: 4300,
        saladCost: 1700,
        oldPrice: 11500,
        newPrice: 12000,
        isOffer: true,
        offerNote: "بدلاً من 13 ألف، ادفع 12 ألف",
      },
      {
        name: "عرض دجاج + دجاج",
        productCost: 3300,
        saladCost: 1700,
        oldPrice: 10000,
        newPrice: 10500,
        isOffer: true,
        offerNote: "بدلاً من 11.5 ألف، ادفع 10.5 ألف",
      },
      {
        name: "عرض كباب + كباب",
        productCost: 5600,
        saladCost: 1700,
        oldPrice: 12500,
        newPrice: 13000,
        isOffer: true,
        offerNote: "بدلاً من 14.5 ألف، ادفع 13 ألف",
      },
    ],
  },
  {
    name: "عروض العائلة (4 أشخاص)",
    items: [
      {
        name: "عرض رقم 1 لأربعة أشخاص",
        description: "2 ادانا + 2 اورفا + جناح + دجاج + كوفتة + معلاك",
        productCost: 19650,
        saladCost: 10200,
        oldPrice: 50000,
        newPrice: 50000,
        isOffer: true,
        offerNote: "بدلاً من 55.5 ألف، ادفع 50 ألف",
      },
      {
        name: "عرض رقم 2 لأربعة أشخاص",
        description: "ادانا + كباب بذنجان + 2 اورفا + كوفتة الجمر + معلاك + جناح + دجاج",
        productCost: 21150,
        saladCost: 10200,
        oldPrice: 53000,
        newPrice: 53000,
        isOffer: true,
        offerNote: "بدلاً من 58 ألف، ادفع 53 ألف",
      },
      {
        name: "عرض رقم 3 لأربعة أشخاص",
        description: "ادانا + اورفا + تكة لحم + كوفتة + كوفتة الجمر + معلاك + جناح + دجاج",
        productCost: 22300,
        saladCost: 10200,
        oldPrice: 54500,
        newPrice: 54500,
        isOffer: true,
        offerNote: "بدلاً من 59.5 ألف، ادفع 54.5 ألف",
      },
      {
        name: "عرض رقم 4 لأربعة أشخاص",
        description: "2 اورفا + 2 ادانا + 2 جناح + 2 دجاج",
        productCost: 17800,
        saladCost: 10200,
        oldPrice: 47000,
        newPrice: 47000,
        isOffer: true,
        offerNote: "بدلاً من 52 ألف، ادفع 47 ألف",
      },
      {
        name: "العرض الملكي",
        description:
          "وجبة لحم بالعجين + ادانا + اورفا + كوفتة الخان + معلاك، ووجبة لحم بالعجين + كباب بذنجان + كوفتة + تكة لحم + ادانا",
        productCost: 28600,
        saladCost: 10200,
        oldPrice: 65000,
        newPrice: 65000,
        isOffer: true,
        offerNote: "بدلاً من 73.5 ألف، ادفع 65 ألف",
      },
    ],
  },
  {
    name: "عروض الشخصين",
    items: [
      {
        name: "عرض شخصين 1",
        description: "2 شيش دجاج + 1 شيش جناح + اورفا + ادانا",
        productCost: 10400,
        saladCost: 6800,
        oldPrice: 28500,
        newPrice: 28500,
        isOffer: true,
        offerNote: "بدلاً من 31750، ادفع 28500",
      },
      {
        name: "عرض شخصين 2",
        description: "2 شيش دجاج + 1 شيش جناح + كباب بذنجان + كوفتة مشوية",
        productCost: 10650,
        saladCost: 6800,
        oldPrice: 35000,
        newPrice: 35000,
        isOffer: true,
        offerNote: "بدلاً من 32750، ادفع 29750",
      },
      {
        name: "عرض شخصين 3",
        description: "3 شيش دجاج + 2 شيش جناح",
        productCost: 8100,
        saladCost: 6800,
        oldPrice: 25750,
        newPrice: 25750,
        isOffer: true,
        offerNote: "بدلاً من 28750، ادفع 25750",
      },
      {
        name: "عرض شخصين 4",
        description: "شيش دجاج + شيش جناح + معلاك + كوفتة مشوية + اورفا",
        productCost: 11250,
        saladCost: 6800,
        oldPrice: 30750,
        newPrice: 30750,
        isOffer: true,
        offerNote: "بدلاً من 33750، ادفع 30750",
      },
      {
        name: "عرض شخصين 5",
        description: "3 اورفا + 2 ادانا",
        productCost: 14000,
        saladCost: 6800,
        oldPrice: 33250,
        newPrice: 33250,
        isOffer: true,
        offerNote: "بدلاً من 36250، ادفع 33250",
      },
    ],
  },
];

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
