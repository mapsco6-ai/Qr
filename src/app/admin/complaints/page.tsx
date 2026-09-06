"use client";

import { useEffect, useState } from "react";
import { ComplaintDto } from "@/lib/types";

const STATUS_LABELS: Record<ComplaintDto["status"], string> = {
  new: "جديدة",
  in_progress: "قيد المعالجة",
  resolved: "تم الحل",
};

const STATUS_COLORS: Record<ComplaintDto["status"], string> = {
  new: "bg-red-50 text-red-600",
  in_progress: "bg-gold-400/20 text-gold-600",
  resolved: "bg-green-100 text-green-700",
};

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<ComplaintDto[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadComplaints() {
    setLoading(true);
    const res = await fetch("/api/admin/complaints");
    setComplaints((await res.json()) as ComplaintDto[]);
    setLoading(false);
  }

  useEffect(() => {
    loadComplaints();
  }, []);

  async function handleStatusChange(id: string, status: ComplaintDto["status"]) {
    await fetch(`/api/admin/complaints/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    loadComplaints();
  }

  async function handleDelete(id: string) {
    if (!confirm("حذف هذه الشكوى؟")) return;
    await fetch(`/api/admin/complaints/${id}`, { method: "DELETE" });
    loadComplaints();
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-extrabold text-charcoal-800">الشكاوى والاقتراحات</h2>
      {loading ? (
        <p className="text-charcoal-400">جاري التحميل...</p>
      ) : complaints.length === 0 ? (
        <p className="text-charcoal-400">لا توجد شكاوى بعد</p>
      ) : (
        <div className="flex flex-col gap-3">
          {complaints.map((c) => (
            <div key={c.id} className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-charcoal-700">{c.customerName}</span>
                  {c.phone && (
                    <span className="ms-2 text-xs text-charcoal-400" dir="ltr">
                      {c.phone}
                    </span>
                  )}
                </div>
                <span className="text-xs text-charcoal-400">
                  {new Date(c.createdAt).toLocaleString("ar")}
                </span>
              </div>
              <p className="mt-2 text-charcoal-600">{c.message}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {(["new", "in_progress", "resolved"] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(c.id, status)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      c.status === status
                        ? STATUS_COLORS[status]
                        : "bg-cream-100 text-charcoal-400"
                    }`}
                  >
                    {STATUS_LABELS[status]}
                  </button>
                ))}
                <button
                  onClick={() => handleDelete(c.id)}
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
