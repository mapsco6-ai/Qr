"use client";

import { useState } from "react";

interface ComplaintModalProps {
  onClose: () => void;
}

export default function ComplaintModal({ onClose }: ComplaintModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!customerName.trim() || !message.trim()) {
      setError("الرجاء تعبئة الاسم والرسالة");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerName, phone, message }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setError("تعذر إرسال الرسالة، حاول مرة أخرى");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-t-3xl bg-white p-5 dark:bg-charcoal-900 sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-charcoal-800 dark:text-cream-50">
            شكاوى واقتراحات
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-cream-100 text-charcoal-600 dark:bg-charcoal-800 dark:text-charcoal-200"
            aria-label="إغلاق"
          >
            ✕
          </button>
        </div>

        {submitted ? (
          <p className="rounded-xl bg-ember-50 p-4 text-center text-sm font-semibold text-ember-700 dark:bg-ember-900/30 dark:text-ember-300">
            شكراً لتواصلك معنا! تم استلام رسالتك وسنقوم بمراجعتها.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="الاسم"
              className="rounded-xl border border-cream-200 px-3 py-2 text-sm outline-none focus:border-ember-500 dark:border-charcoal-600 dark:bg-charcoal-800 dark:text-cream-50 dark:placeholder:text-charcoal-400"
              maxLength={100}
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="رقم الهاتف (اختياري)"
              className="rounded-xl border border-cream-200 px-3 py-2 text-sm outline-none focus:border-ember-500 dark:border-charcoal-600 dark:bg-charcoal-800 dark:text-cream-50 dark:placeholder:text-charcoal-400"
              maxLength={30}
              dir="ltr"
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="اكتب شكواك أو اقتراحك هنا"
              className="min-h-[100px] resize-none rounded-xl border border-cream-200 px-3 py-2 text-sm outline-none focus:border-ember-500 dark:border-charcoal-600 dark:bg-charcoal-800 dark:text-cream-50 dark:placeholder:text-charcoal-400"
              maxLength={2000}
            />
            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-ember-600 py-2.5 font-bold text-white transition hover:bg-ember-700 disabled:opacity-60"
            >
              {submitting ? "جاري الإرسال..." : "إرسال"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
