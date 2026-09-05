"use client";

import { useEffect, useState } from "react";
import { MenuItemDto, ReviewDto } from "@/lib/types";
import { formatPrice, CURRENCY_LABEL } from "@/lib/pricing";
import StarRating from "./StarRating";

interface ItemDetailModalProps {
  item: MenuItemDto;
  onClose: () => void;
}

export default function ItemDetailModal({ item, onClose }: ItemDetailModalProps) {
  const [reviews, setReviews] = useState<ReviewDto[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  const [customerName, setCustomerName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const hasDiscount = item.oldPrice > item.newPrice && item.oldPrice > 0;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    fetch(`/api/reviews?menuItemId=${item.id}`)
      .then((res) => res.json())
      .then((data) => setReviews(Array.isArray(data) ? data : []))
      .catch(() => setReviews([]))
      .finally(() => setLoadingReviews(false));
    return () => {
      document.body.style.overflow = "";
    };
  }, [item.id]);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!customerName.trim()) {
      setError("الرجاء إدخال الاسم");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          rating,
          comment,
          menuItemId: item.id,
        }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setError("تعذر إرسال التقييم، حاول مرة أخرى");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-[4/3] w-full bg-cream-100">
          {item.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-cream-300">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 5h16v14H4z" />
                <path d="M4 15l4-4 4 4 4-6 4 6" />
              </svg>
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-3 left-3 flex h-9 w-9 items-center justify-center rounded-full bg-charcoal-900/80 text-cream-50 shadow"
            aria-label="إغلاق"
          >
            ✕
          </button>
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-xl font-extrabold text-charcoal-800">{item.name}</h2>
            {reviews.length > 0 && (
              <div className="flex items-center gap-1 whitespace-nowrap text-sm text-charcoal-400">
                <StarRating value={averageRating} readOnly size={16} />
                <span>({reviews.length})</span>
              </div>
            )}
          </div>

          {item.description && (
            <p className="mt-2 text-charcoal-500">{item.description}</p>
          )}

          {item.offerNote && (
            <p className="mt-2 rounded-lg bg-gold-100 px-3 py-2 text-sm font-semibold text-gold-700">
              {item.offerNote}
            </p>
          )}

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-ember-700">
              {formatPrice(item.newPrice)}
            </span>
            {hasDiscount && (
              <span className="text-base text-charcoal-300 line-through">
                {formatPrice(item.oldPrice)}
              </span>
            )}
            <span className="text-sm text-charcoal-300">{CURRENCY_LABEL}</span>
          </div>

          <hr className="my-5 border-cream-200" />

          <h3 className="mb-3 font-bold text-charcoal-800">التقييمات</h3>

          {loadingReviews ? (
            <p className="text-sm text-charcoal-400">جاري التحميل...</p>
          ) : reviews.length === 0 ? (
            <p className="text-sm text-charcoal-400">لا توجد تقييمات بعد، كن أول من يقيّم!</p>
          ) : (
            <ul className="mb-4 flex flex-col gap-3">
              {reviews.map((r) => (
                <li key={r.id} className="rounded-xl bg-cream-50 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-charcoal-700">{r.customerName}</span>
                    <StarRating value={r.rating} readOnly size={14} />
                  </div>
                  {r.comment && <p className="mt-1 text-sm text-charcoal-500">{r.comment}</p>}
                </li>
              ))}
            </ul>
          )}

          {submitted ? (
            <p className="rounded-xl bg-ember-50 p-3 text-center text-sm font-semibold text-ember-700">
              شكراً لك! تم إرسال تقييمك وسيظهر بعد المراجعة.
            </p>
          ) : (
            <form onSubmit={handleSubmitReview} className="flex flex-col gap-3">
              <input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="اسمك"
                className="rounded-xl border border-cream-200 px-3 py-2 text-sm outline-none focus:border-ember-500"
                maxLength={100}
              />
              <div className="flex items-center gap-2">
                <span className="text-sm text-charcoal-400">تقييمك:</span>
                <StarRating value={rating} onChange={setRating} />
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="اكتب رأيك (اختياري)"
                className="min-h-[70px] resize-none rounded-xl border border-cream-200 px-3 py-2 text-sm outline-none focus:border-ember-500"
                maxLength={1000}
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-ember-600 py-2.5 font-bold text-white transition hover:bg-ember-700 disabled:opacity-60"
              >
                {submitting ? "جاري الإرسال..." : "إرسال التقييم"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
