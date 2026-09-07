import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Exact ids of the duplicate rows created by a stale seed run on 2026-09-07
// (seed.ts re-created its short hardcoded names because the admin had since
// renamed the live items to longer combo descriptions). Identified from a
// full production data dump - see prisma/list-items.ts history.
const DUPLICATE_IDS = [
  // المشاوي
  "cmtr4gk2c000a4gs6u0djdos8",
  "cmtr4gk2e000c4gs6w41pz052",
  "cmtr4gk2100024gs6yt33xd3m",
  "cmtr4gk2500044gs6vgzrwsxk",
  "cmtr4gk2700064gs6hn8cttv0",
  "cmtr4gk2a00084gs6w90p5xe3",
  "cmtr4gk2g000e4gs6hi1nzmae",
  "cmtr4gk2i000g4gs619dq99w0",
  "cmtr4gk2k000i4gs61g9o5htw",
  "cmtr4gk2m000k4gs6hzj4km5g",
  "cmtr4gk2o000m4gs6lmgn4wks",
  "cmtr4gk2r000o4gs6o3yqrdy0",
  "cmtr4gk2t000q4gs6oki0bce2",
  // الدوروم
  "cmtr4gk2x000t4gs6o371gsio",
  "cmtr4gk2y000v4gs6jjzwtxg1",
  "cmtr4gk34000x4gs6d2eo721i",
  "cmtr4gk36000z4gs6stegx3ug",
  // عروض فردية
  "cmtr4gk4000144gs6x2byxkot",
  "cmtr4gk4300164gs6xn6pboy9",
  "cmtr4gk4500184gs6bbinuhnn",
  // عروض العائلة (4 أشخاص)
  "cmtr4gk49001b4gs6bmfkjym6",
  "cmtr4gk4a001d4gs6dvfhwazo",
  "cmtr4gk4d001f4gs61kivjruh",
  "cmtr4gk4f001h4gs6k2kevdkh",
  "cmtr4gk4h001j4gs6fbtu74do",
  // عروض الشخصين
  "cmtr4gk4k001m4gs6up8xyqz6",
  "cmtr4gk4m001o4gs6g15jqnne",
  "cmtr4gk4q001q4gs6euk5tizz",
  "cmtr4gk4s001s4gs636qgean3",
  "cmtr4gk4v001u4gs68ft7nycb",
];

async function main() {
  const result = await prisma.menuItem.deleteMany({
    where: { id: { in: DUPLICATE_IDS } },
  });
  console.log(`تم حذف ${result.count} عنصر مكرر (من أصل ${DUPLICATE_IDS.length} متوقع).`);

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
  console.log("تم إعادة ترقيم الترتيب داخل كل تصنيف.");
}

main()
  .catch((err) => {
    console.error("Cleanup failed:", err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
