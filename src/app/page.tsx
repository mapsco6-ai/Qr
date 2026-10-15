import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import MenuBrowser from "@/components/MenuBrowser";
import { SettingsDto } from "@/lib/types";

export const dynamic = "force-dynamic";

const DEFAULT_SETTINGS: SettingsDto = {
  siteName: "خان الجمر",
  tagline: "سيّد المشويات التركية",
  logoUrl: null,
};

const getMenuData = unstable_cache(
  async () => {
    const [categories, items, settings] = await Promise.all([
      prisma.category.findMany({ orderBy: { order: "asc" } }),
      prisma.menuItem.findMany({
        where: { active: true },
        include: { category: true },
        orderBy: [{ category: { order: "asc" } }, { order: "asc" }, { createdAt: "asc" }],
      }),
      prisma.settings.findUnique({ where: { id: "main" } }),
    ]);
    return { categories, items, settings };
  },
  ["public-menu-data"],
  { revalidate: 30, tags: ["menu"] }
);

export default async function HomePage() {
  let categories: Awaited<ReturnType<typeof prisma.category.findMany>> = [];
  let items: Awaited<
    ReturnType<typeof prisma.menuItem.findMany<{ include: { category: true } }>>
  > = [];
  let settings: SettingsDto = DEFAULT_SETTINGS;

  try {
    const data = await getMenuData();
    categories = data.categories;
    items = data.items;
    if (data.settings) settings = data.settings;
  } catch (error) {
    console.error("Failed to load menu data:", error);
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-charcoal-900 p-6 text-center">
        <h1 className="text-2xl font-bold text-cream-50">القائمة غير متوفرة حالياً</h1>
        <p className="max-w-md text-charcoal-300">
          يتعذر الاتصال بقاعدة البيانات حالياً. الرجاء المحاولة لاحقاً أو إبلاغ الإدارة.
        </p>
      </main>
    );
  }

  return (
    <MenuBrowser
      settings={{
        ...settings,
        logoUrl: settings.logoUrl ? "/api/settings/logo" : null,
      }}
      categories={categories.map((c) => ({ id: c.id, name: c.name, order: c.order }))}
      items={items.map((i) => ({
        id: i.id,
        name: i.name,
        description: i.description,
        image: i.image ? `/api/menu-items/${i.id}/image` : null,
        categoryId: i.categoryId,
        category: { id: i.category.id, name: i.category.name, order: i.category.order },
        productCost: i.productCost,
        saladCost: i.saladCost,
        oldPrice: i.oldPrice,
        newPrice: i.newPrice,
        isOffer: i.isOffer,
        offerNote: i.offerNote,
        isNew: i.isNew,
        active: i.active,
        order: i.order,
      }))}
    />
  );
}
