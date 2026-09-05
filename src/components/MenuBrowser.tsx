"use client";

import { useMemo, useState } from "react";
import { CategoryDto, MenuItemDto, SettingsDto } from "@/lib/types";
import MenuItemCard from "./MenuItemCard";
import ItemDetailModal from "./ItemDetailModal";
import ComplaintModal from "./ComplaintModal";
import FlameLogo from "./FlameLogo";

interface MenuBrowserProps {
  settings: SettingsDto;
  categories: CategoryDto[];
  items: MenuItemDto[];
}

export default function MenuBrowser({ settings, categories, items }: MenuBrowserProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<MenuItemDto | null>(null);
  const [showComplaint, setShowComplaint] = useState(false);

  const nonEmptyCategories = useMemo(
    () => categories.filter((c) => items.some((i) => i.categoryId === c.id)),
    [categories, items]
  );

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = activeCategory === "all" || item.categoryId === activeCategory;
      const matchesSearch =
        !search.trim() || item.name.toLowerCase().includes(search.trim().toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [items, activeCategory, search]);

  return (
    <div className="min-h-screen bg-cream-50 pb-24">
      <header className="sticky top-0 z-40 bg-charcoal-900 shadow-lg">
        <div className="mx-auto max-w-3xl px-4 pb-4 pt-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-charcoal-800 ring-2 ring-ember-600/60">
              {settings.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={settings.logoUrl}
                  alt={settings.siteName}
                  className="h-full w-full rounded-full object-cover p-1"
                />
              ) : (
                <FlameLogo className="h-10 w-10" />
              )}
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-cream-50">
              {settings.siteName}
            </h1>
            <p className="text-sm font-medium text-gold-400">{settings.tagline}</p>
          </div>

          <div className="mt-4">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن طبق..."
              className="w-full rounded-full border border-charcoal-700 bg-charcoal-800 px-4 py-2 text-sm text-cream-50 placeholder:text-charcoal-300 outline-none focus:border-gold-500"
            />
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveCategory("all")}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                activeCategory === "all"
                  ? "bg-ember-600 text-white"
                  : "bg-charcoal-800 text-charcoal-200"
              }`}
            >
              الكل
            </button>
            {nonEmptyCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                  activeCategory === cat.id
                    ? "bg-ember-600 text-white"
                    : "bg-charcoal-800 text-charcoal-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-5">
        {filteredItems.length === 0 ? (
          <p className="mt-10 text-center text-charcoal-400">لا توجد أطباق مطابقة</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {filteredItems.map((item) => (
              <MenuItemCard key={item.id} item={item} onClick={() => setSelectedItem(item)} />
            ))}
          </div>
        )}
      </main>

      <button
        onClick={() => setShowComplaint(true)}
        className="fixed bottom-5 left-1/2 z-30 -translate-x-1/2 rounded-full bg-charcoal-900 px-5 py-2.5 text-sm font-semibold text-cream-50 shadow-lg ring-1 ring-gold-500/40"
      >
        شكاوى واقتراحات
      </button>

      {selectedItem && (
        <ItemDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
      {showComplaint && <ComplaintModal onClose={() => setShowComplaint(false)} />}
    </div>
  );
}
