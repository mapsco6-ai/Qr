import { prisma } from "@/lib/prisma";
import MenuBrowser from "@/components/MenuBrowser";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let categories: Awaited<ReturnType<typeof prisma.category.findMany>> = [];
  let items: Awaited<
    ReturnType<typeof prisma.menuItem.findMany<{ include: { category: true } }>>
  > = [];

  try {
    [categories, items] = await Promise.all([
      prisma.category.findMany({ orderBy: { order: "asc" } }),
      prisma.menuItem.findMany({
        where: { active: true },
        include: { category: true },
        orderBy: [{ category: { order: "asc" } }, { order: "asc" }, { createdAt: "asc" }],
      }),
    ]);
  } catch (error) {
    console.error("Failed to load menu data:", error);
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-3 p-6 text-center">
        <h1 className="text-2xl font-bold text-stone-800">القائمة غير متوفرة حالياً</h1>
        <p className="max-w-md text-stone-500">
          يتعذر الاتصال بقاعدة البيانات حالياً. الرجاء المحاولة لاحقاً أو إبلاغ الإدارة.
        </p>
      </main>
    );
  }

  return (
    <MenuBrowser
      categories={categories.map((c) => ({ id: c.id, name: c.name, order: c.order }))}
      items={items.map((i) => ({
        id: i.id,
        name: i.name,
        description: i.description,
        image: i.image,
        categoryId: i.categoryId,
        category: { id: i.category.id, name: i.category.name, order: i.category.order },
        productCost: i.productCost,
        saladCost: i.saladCost,
        oldPrice: i.oldPrice,
        newPrice: i.newPrice,
        isOffer: i.isOffer,
        offerNote: i.offerNote,
        active: i.active,
        order: i.order,
      }))}
    />
  );
}
