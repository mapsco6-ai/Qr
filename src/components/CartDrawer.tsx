"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatPrice, CURRENCY_LABEL } from "@/lib/pricing";
import { buildCartMessage, buildLocationUrl } from "@/lib/whatsapp";
import WhatsAppOrderLinks from "./WhatsAppOrderLinks";

interface CartDrawerProps {
  siteName: string;
  onClose: () => void;
}

type LocationStatus = "idle" | "loading" | "granted" | "error";

export default function CartDrawer({ siteName, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeItem, clear, totalPrice } = useCart();
  const [locationStatus, setLocationStatus] = useState<LocationStatus>("idle");
  const [locationUrl, setLocationUrl] = useState<string | null>(null);

  function handleShareLocation() {
    if (!navigator.geolocation) {
      setLocationStatus("error");
      return;
    }
    setLocationStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationUrl(buildLocationUrl(position.coords.latitude, position.coords.longitude));
        setLocationStatus("granted");
      },
      () => setLocationStatus("error"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[88vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-5 dark:bg-charcoal-900 sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-charcoal-800 dark:text-cream-50">سلتي</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-cream-100 text-charcoal-600 dark:bg-charcoal-800 dark:text-charcoal-200"
            aria-label="إغلاق"
          >
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col gap-4">
            <p className="rounded-xl bg-cream-50 p-4 text-center text-sm text-charcoal-400 dark:bg-charcoal-800 dark:text-charcoal-300">
              السلة فارغة، تصفح المنيو وأضف أطباقك المفضلة
            </p>
            <p className="text-xs font-bold text-charcoal-500 dark:text-charcoal-300">
              أو تواصل معنا مباشرة عبر واتساب
            </p>
            <WhatsAppOrderLinks
              message={`مرحباً، أريد الاستفسار عن منيو ${siteName}`}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <ul className="flex flex-col gap-3">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-xl bg-cream-50 p-3 dark:bg-charcoal-800"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-charcoal-700 dark:text-cream-100">
                      {item.name}
                    </p>
                    <p className="text-sm text-ember-700 dark:text-ember-400">
                      {formatPrice(item.price * item.quantity)} {CURRENCY_LABEL}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-cream-200 font-bold text-charcoal-700 dark:bg-charcoal-700 dark:text-cream-100"
                      aria-label="إنقاص الكمية"
                    >
                      −
                    </button>
                    <span className="w-5 text-center font-bold text-charcoal-800 dark:text-cream-50">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-ember-600 font-bold text-white"
                      aria-label="زيادة الكمية"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-xs font-semibold text-red-500"
                  >
                    حذف
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between border-t border-cream-200 pt-3 dark:border-charcoal-700">
              <span className="font-bold text-charcoal-700 dark:text-cream-100">الإجمالي</span>
              <span className="text-lg font-extrabold text-ember-700 dark:text-ember-400">
                {formatPrice(totalPrice)} {CURRENCY_LABEL}
              </span>
            </div>

            <div className="rounded-xl bg-cream-50 p-3 dark:bg-charcoal-800">
              {locationStatus === "granted" ? (
                <p className="text-center text-sm font-semibold text-green-600 dark:text-green-400">
                  ✓ تم إرفاق موقعك مع الطلب
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleShareLocation}
                  disabled={locationStatus === "loading"}
                  className="w-full rounded-xl border border-cream-300 py-2 text-sm font-semibold text-charcoal-600 disabled:opacity-60 dark:border-charcoal-600 dark:text-charcoal-200"
                >
                  {locationStatus === "loading"
                    ? "جاري تحديد موقعك..."
                    : "📍 إرفاق موقعي مع الطلب (لتسهيل التوصيل)"}
                </button>
              )}
              {locationStatus === "error" && (
                <p className="mt-1 text-center text-xs text-red-500">
                  تعذر تحديد موقعك، تأكد من السماح بصلاحية الموقع من المتصفح
                </p>
              )}
            </div>

            <WhatsAppOrderLinks
              message={buildCartMessage(items, siteName, locationUrl ?? undefined)}
            />

            <button
              type="button"
              onClick={clear}
              className="text-center text-xs font-semibold text-charcoal-400 dark:text-charcoal-400"
            >
              إفراغ السلة
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
