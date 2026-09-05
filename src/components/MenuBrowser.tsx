"use client";

import { useMemo, useState } from "react";
import { CategoryDto, MenuItemDto } from "@/lib/types";
import MenuItemCard from "./MenuItemCard";
import ItemDetailModal from "./ItemDetailModal";
import ComplaintModal from "./ComplaintModal";

interface MenuBrowserProps {
  categories: CategoryDto[];
  items: MenuItemDto[];
}

export default function MenuBrowser({ categories, items }: MenuBrowserProps) {
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
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <h1 className="text-center text-2xl font-extrabold text-brand-700">المنيو الإلكتروني</h1>
          <div className="mt-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن طبق..."
              className="w-full rounded-full border border-stone-200 bg-stone-50 px-4 py-2 text-sm outline-none focus:border-brand-500"
            />
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveCategory("all")}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                activeCategory === "all"
                  ? "bg-brand-600 text-white"
                  : "bg-stone-100 text-stone-600"
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
                    ? "bg-brand-600 text-white"
                    : "bg-stone-100 text-stone-600"
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
          <p className="mt-10 text-center text-stone-400">لا توجد أطباق مطابقة</p>
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
        className="fixed bottom-5 left-1/2 z-30 -translate-x-1/2 rounded-full bg-stone-800 px-5 py-2.5 text-sm font-semibold text-white shadow-lg"
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
