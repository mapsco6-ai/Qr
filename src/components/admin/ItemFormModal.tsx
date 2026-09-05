"use client";

import { useRef, useState } from "react";
import { CategoryDto, MenuItemDto } from "@/lib/types";
import PricingCalculator from "./PricingCalculator";

interface ItemFormModalProps {
  item: MenuItemDto | null;
  categories: CategoryDto[];
  onClose: () => void;
  onSaved: () => void;
}

export default function ItemFormModal({
  item,
  categories,
  onClose,
  onSaved,
}: ItemFormModalProps) {
  const [name, setName] = useState(item?.name ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [image, setImage] = useState<string | null>(item?.image ?? null);
  const [categoryId, setCategoryId] = useState(item?.categoryId ?? categories[0]?.id ?? "");
  const [productCost, setProductCost] = useState(item?.productCost ?? 0);
  const [saladCost, setSaladCost] = useState(item?.saladCost ?? 0);
  const [oldPrice, setOldPrice] = useState(item?.oldPrice ?? 0);
  const [newPrice, setNewPrice] = useState(item?.newPrice ?? 0);
  const [isOffer, setIsOffer] = useState(item?.isOffer ?? false);
  const [offerNote, setOfferNote] = useState(item?.offerNote ?? "");
  const [active, setActive] = useState(item?.active ?? true);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setImage(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر رفع الصورة");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !categoryId) {
      setError("الاسم والتصنيف مطلوبان");
      return;
    }
    setSaving(true);
    setError("");

    const payload = {
      name,
      description,
      image,
      categoryId,
      productCost: Number(productCost),
      saladCost: Number(saladCost),
      oldPrice: Number(oldPrice),
      newPrice: Number(newPrice),
      isOffer,
      offerNote: isOffer ? offerNote : null,
      active,
    };

    try {
      const res = await fetch(
        item ? `/api/admin/menu-items/${item.id}` : "/api/admin/menu-items",
        {
          method: item ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "تعذر الحفظ");
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر الحفظ");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-5 sm:rounded-3xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-stone-800">
            {item ? "تعديل صنف" : "إضافة صنف جديد"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-600"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-stone-100">
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={image} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-stone-300">
                  لا صورة
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="rounded-lg border border-stone-200 px-3 py-1.5 text-sm font-semibold text-stone-600"
              >
                {uploading ? "جاري الرفع..." : "رفع صورة"}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              {image && (
                <button
                  type="button"
                  onClick={() => setImage(null)}
                  className="text-xs text-red-500"
                >
                  إزالة الصورة
                </button>
              )}
            </div>
          </div>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="اسم الصنف"
            className="rounded-xl border border-stone-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
          />

          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="rounded-xl border border-stone-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <textarea
            value={description ?? ""}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="وصف الصنف (اختياري)"
            className="min-h-[60px] resize-none rounded-xl border border-stone-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
          />

          <div className="grid grid-cols-2 gap-3">
            <Field label="كلفة المنتج">
              <input
                type="number"
                value={productCost}
                onChange={(e) => setProductCost(Number(e.target.value))}
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
              />
            </Field>
            <Field label="كلفة السلطة / إضافات">
              <input
                type="number"
                value={saladCost}
                onChange={(e) => setSaladCost(Number(e.target.value))}
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
              />
            </Field>
            <Field label="السعر القديم">
              <input
                type="number"
                value={oldPrice}
                onChange={(e) => setOldPrice(Number(e.target.value))}
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
              />
            </Field>
            <Field label="السعر الجديد">
              <input
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(Number(e.target.value))}
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
              />
            </Field>
          </div>

          <PricingCalculator
            productCost={Number(productCost) || 0}
            saladCost={Number(saladCost) || 0}
            oldPrice={Number(oldPrice) || 0}
            newPrice={Number(newPrice) || 0}
          />

          <label className="flex items-center gap-2 text-sm text-stone-600">
            <input
              type="checkbox"
              checked={isOffer}
              onChange={(e) => setIsOffer(e.target.checked)}
            />
            هذا الصنف عرض خاص
          </label>

          {isOffer && (
            <input
              value={offerNote ?? ""}
              onChange={(e) => setOfferNote(e.target.value)}
              placeholder="ملاحظة العرض (مثال: بدلاً من 13 ادفع 12 الف)"
              className="rounded-xl border border-stone-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
            />
          )}

          <label className="flex items-center gap-2 text-sm text-stone-600">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
            />
            الصنف ظاهر في المنيو
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="mt-1 rounded-xl bg-brand-600 py-2.5 font-bold text-white transition hover:bg-brand-700 disabled:opacity-60"
          >
            {saving ? "جاري الحفظ..." : "حفظ"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-xs text-stone-500">
      {label}
      {children}
    </label>
  );
}
