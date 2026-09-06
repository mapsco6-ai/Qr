"use client";

import { useEffect, useState } from "react";
import { ReviewDto } from "@/lib/types";
import StarRating from "@/components/StarRating";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewDto[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadReviews() {
    setLoading(true);
    const res = await fetch("/api/admin/reviews");
    setReviews(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    loadReviews();
  }, []);

  async function handleToggleApproved(review: ReviewDto) {
    await fetch(`/api/admin/reviews/${review.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved: !review.approved }),
    });
    loadReviews();
  }

  async function handleDelete(id: string) {
    if (!confirm("حذف هذا التقييم؟")) return;
    await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
    loadReviews();
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-extrabold text-charcoal-800">التقييمات</h2>
      {loading ? (
        <p className="text-charcoal-400">جاري التحميل...</p>
      ) : reviews.length === 0 ? (
        <p className="text-charcoal-400">لا توجد تقييمات بعد</p>
      ) : (
        <div className="flex flex-col gap-3">
          {reviews.map((review) => (
            <div key={review.id} className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-charcoal-700">{review.customerName}</span>
                  <StarRating value={review.rating} readOnly size={16} />
                </div>
                <span className="text-xs text-charcoal-400">
                  {new Date(review.createdAt).toLocaleString("ar")}
                </span>
              </div>
              {review.menuItem?.name && (
                <p className="mt-1 text-xs text-charcoal-400">الصنف: {review.menuItem.name}</p>
              )}
              {review.comment && <p className="mt-2 text-charcoal-600">{review.comment}</p>}
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleToggleApproved(review)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    review.approved
                      ? "bg-green-100 text-green-700"
                      : "bg-gold-400/20 text-gold-600"
                  }`}
                >
                  {review.approved ? "منشور" : "بانتظار الموافقة"}
                </button>
                <button
                  onClick={() => handleDelete(review.id)}
                  className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-500"
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
