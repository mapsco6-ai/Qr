"use client";

import { useEffect, useState } from "react";
import { CategoryDto, MenuItemDto } from "@/lib/types";
import { calculatePricing, formatPrice, CURRENCY_LABEL } from "@/lib/pricing";
import ItemFormModal from "@/components/admin/ItemFormModal";

export default function AdminItemsPage() {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [items, setItems] = useState<MenuItemDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<MenuItemDto | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  async function loadData() {
    setLoading(true);
    const [catRes, itemRes] = await Promise.all([
      fetch("/api/admin/categories"),
      fetch("/api/admin/menu-items"),
    ]);
    setCategories(await catRes.json());
    setItems(await itemRes.json());
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCategoryName, order: categories.length }),
    });
    setNewCategoryName("");
    loadData();
  }

  async function handleDelete(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذا الصنف؟")) return;
    await fetch(`/api/admin/menu-items/${id}`, { method: "DELETE" });
    loadData();
  }

  async function handleToggleActive(item: MenuItemDto) {
    await fetch(`/api/admin/menu-items/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !item.active }),
    });
    loadData();
  }

  const grouped = categories.map((cat) => ({
    category: cat,
    items: items.filter((i) => i.categoryId === cat.id),
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-extrabold text-charcoal-800">الأصناف والأسعار</h2>
        <div className="flex flex-wrap gap-2">
          <form onSubmit={handleAddCategory} className="flex gap-2">
            <input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="اسم تصنيف جديد"
              className="rounded-xl border border-cream-200 px-3 py-1.5 text-sm outline-none focus:border-ember-500"
            />
            <button
              type="submit"
              className="rounded-xl border border-cream-300 px-3 py-1.5 text-sm font-semibold text-charcoal-600"
            >
              إضافة تصنيف
            </button>
          </form>
          <button
            onClick={() => {
              setEditingItem(null);
              setShowForm(true);
            }}
            className="rounded-xl bg-ember-600 px-4 py-1.5 text-sm font-bold text-white"
          >
            + إضافة صنف
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-charcoal-400">جاري التحميل...</p>
      ) : (
        grouped.map(({ category, items: catItems }) => (
          <div key={category.id} className="rounded-2xl bg-white p-4 shadow-sm">
            <h3 className="mb-3 font-bold text-ember-700">{category.name}</h3>
            {catItems.length === 0 ? (
              <p className="text-sm text-charcoal-400">لا توجد أصناف في هذا التصنيف</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-right text-sm">
                  <thead>
                    <tr className="border-b border-cream-200 text-charcoal-400">
                      <th className="py-2">الصنف</th>
                      <th>الكلفة</th>
                      <th>السعر القديم</th>
                      <th>السعر الجديد</th>
                      <th>الفرق</th>
                      <th>الربح %</th>
                      <th>ظاهر</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {catItems.map((item) => {
                      const pricing = calculatePricing(item);
                      return (
                        <tr key={item.id} className="border-b border-cream-100">
                          <td className="py-2 font-semibold text-charcoal-700">
                            {item.name}
                            {item.isOffer && (
                              <span className="ms-2 rounded-full bg-gold-400/20 px-2 py-0.5 text-xs text-gold-600">
                                عرض
                              </span>
                            )}
                          </td>
                          <td>
                            {formatPrice(pricing.totalCost)} {CURRENCY_LABEL}
                          </td>
                          <td>
                            {formatPrice(item.oldPrice)} {CURRENCY_LABEL}
                            <span className="block text-xs text-charcoal-400">
                              {pricing.oldMarginPercent}%
                            </span>
                          </td>
                          <td>
                            {formatPrice(item.newPrice)} {CURRENCY_LABEL}
                            <span className="block text-xs text-charcoal-400">
                              {pricing.newMarginPercent}%
                            </span>
                          </td>
                          <td
                            className={
                              pricing.priceDiff >= 0 ? "text-green-600" : "text-red-500"
                            }
                          >
                            {pricing.priceDiff >= 0 ? "+" : ""}
                            {formatPrice(pricing.priceDiff)} ({pricing.priceDiffPercent}%)
                          </td>
                          <td>{pricing.newMarginPercent}%</td>
                          <td>
                            <button
                              onClick={() => handleToggleActive(item)}
                              className={`rounded-full px-2 py-1 text-xs font-semibold ${
                                item.active
                                  ? "bg-green-100 text-green-700"
                                  : "bg-cream-100 text-charcoal-400"
                              }`}
                            >
                              {item.active ? "نعم" : "مخفي"}
                            </button>
                          </td>
                          <td className="whitespace-nowrap">
                            <button
                              onClick={() => {
                                setEditingItem(item);
                                setShowForm(true);
                              }}
                              className="me-2 text-xs font-semibold text-ember-600"
                            >
                              تعديل
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="text-xs font-semibold text-red-500"
                            >
                              حذف
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))
      )}

      {showForm && (
        <ItemFormModal
          item={editingItem}
          categories={categories}
          onClose={() => setShowForm(false)}
          onSaved={() => {
            setShowForm(false);
            loadData();
          }}
        />
      )}
    </div>
  );
}
