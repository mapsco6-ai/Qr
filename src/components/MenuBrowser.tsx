"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CategoryDto, MenuItemDto, SettingsDto } from "@/lib/types";
import MenuItemCard from "./MenuItemCard";
import ItemDetailModal from "./ItemDetailModal";
import ComplaintModal from "./ComplaintModal";
import FlameLogo from "./FlameLogo";
import ThemeToggle from "./ThemeToggle";

interface MenuBrowserProps {
  settings: SettingsDto;
  categories: CategoryDto[];
  items: MenuItemDto[];
}

const heroContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const heroItem = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

export default function MenuBrowser({ settings, categories, items }: MenuBrowserProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<MenuItemDto | null>(null);
  const [showComplaint, setShowComplaint] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  function scrollToMenu() {
    menuRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-charcoal-950">
      {/* Top bar */}
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 pt-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-charcoal-900 ring-1 ring-ember-600/50">
          {settings.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={settings.logoUrl}
              alt={settings.siteName}
              className="h-full w-full rounded-full object-cover p-0.5"
            />
          ) : (
            <FlameLogo className="h-6 w-6" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowComplaint(true)}
            className="rounded-full border border-cream-300 bg-white/70 px-4 py-1.5 text-xs font-semibold text-charcoal-600 shadow-sm backdrop-blur dark:border-charcoal-600 dark:bg-charcoal-800/70 dark:text-charcoal-200"
          >
            الشكاوى والملاحظات
          </button>
          <ThemeToggle />
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-8 pt-6 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-10 -z-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full border border-ember-200/60 dark:border-ember-800/40"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-10 -z-0 h-[340px] w-[340px] -translate-x-1/2 rounded-full border border-gold-200/50 dark:border-gold-800/30"
        />

        <motion.div
          variants={heroContainer}
          initial="hidden"
          animate="show"
          className="relative mx-auto flex max-w-md flex-col items-center gap-3"
        >
          <motion.span
            variants={heroItem}
            className="flex items-center gap-1.5 text-sm font-bold text-ember-700 dark:text-ember-400"
          >
            <FlameLogo className="h-4 w-4" /> من الجمر مباشرة
          </motion.span>

          <motion.h1 variants={heroItem} className="font-display leading-[1.15]">
            <span className="block text-4xl text-charcoal-900 dark:text-cream-50">نكهة تركية</span>
            <span className="block text-4xl text-ember-700 dark:text-ember-400">
              بروح {settings.siteName}
            </span>
          </motion.h1>

          <motion.p
            variants={heroItem}
            className="max-w-xs text-sm leading-relaxed text-charcoal-500 dark:text-charcoal-300"
          >
            اختر وجبتك وتعرّف على أسعارنا بسهولة، كل أطباقنا تُحضّر بعناية وتُشوى على الجمر
          </motion.p>

          <motion.button
            variants={heroItem}
            onClick={scrollToMenu}
            className="mt-1 rounded-2xl bg-ember-600 px-8 py-3 text-base font-bold text-white shadow-lg shadow-ember-600/20 transition hover:bg-ember-700"
          >
            استكشف المنيو
          </motion.button>

          <motion.div variants={heroItem} className="relative mt-6">
            <div className="flex h-40 w-40 items-center justify-center rounded-full bg-[radial-gradient(circle,theme(colors.cream.100),theme(colors.cream.50))] shadow-inner dark:bg-[radial-gradient(circle,theme(colors.charcoal.800),theme(colors.charcoal.900))]">
              {settings.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={settings.logoUrl}
                  alt={settings.siteName}
                  className="h-28 w-28 rounded-full object-cover"
                />
              ) : (
                <FlameLogo className="h-24 w-24" />
              )}
            </div>
            <span className="absolute -bottom-1 -left-3 flex h-16 w-16 -rotate-6 items-center justify-center rounded-full bg-ember-600 text-center text-[11px] font-bold leading-tight text-white shadow-lg">
              مشويات
              <br />
              على الجمر
            </span>
          </motion.div>
        </motion.div>
      </section>

      {/* Sticky search + categories */}
      <div
        ref={menuRef}
        className="sticky top-0 z-40 border-b border-cream-200 bg-cream-50/95 backdrop-blur dark:border-charcoal-700 dark:bg-charcoal-950/95"
      >
        <div className="mx-auto max-w-3xl px-4 py-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث عن طبق..."
            className="w-full rounded-full border border-cream-300 bg-white px-4 py-2 text-sm text-charcoal-800 outline-none placeholder:text-charcoal-300 focus:border-ember-500 dark:border-charcoal-600 dark:bg-charcoal-800 dark:text-cream-50 dark:placeholder:text-charcoal-400"
          />
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveCategory("all")}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                activeCategory === "all"
                  ? "bg-ember-600 text-white"
                  : "border border-cream-300 bg-white text-charcoal-600 dark:border-charcoal-600 dark:bg-charcoal-800 dark:text-charcoal-200"
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
                    : "border border-cream-300 bg-white text-charcoal-600 dark:border-charcoal-600 dark:bg-charcoal-800 dark:text-charcoal-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-3xl px-4 py-5 pb-16">
        {filteredItems.length === 0 ? (
          <p className="mt-10 text-center text-charcoal-400 dark:text-charcoal-400">
            لا توجد أطباق مطابقة
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredItems.map((item, index) => (
              <MenuItemCard
                key={item.id}
                item={item}
                index={index}
                onClick={() => setSelectedItem(item)}
              />
            ))}
          </div>
        )}
      </main>

      {selectedItem && (
        <ItemDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
      {showComplaint && <ComplaintModal onClose={() => setShowComplaint(false)} />}
    </div>
  );
}
