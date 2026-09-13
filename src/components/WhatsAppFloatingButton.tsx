"use client";

import { useEffect, useRef, useState } from "react";
import WhatsAppIcon from "./WhatsAppIcon";
import WhatsAppOrderLinks from "./WhatsAppOrderLinks";

interface WhatsAppFloatingButtonProps {
  siteName: string;
}

export default function WhatsAppFloatingButton({ siteName }: WhatsAppFloatingButtonProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={containerRef} className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-64 rounded-2xl border border-cream-200 bg-white p-3 shadow-xl dark:border-charcoal-700 dark:bg-charcoal-900">
          <p className="mb-2 px-1 text-xs font-bold text-charcoal-500 dark:text-charcoal-300">
            اطلب مباشرة عبر واتساب
          </p>
          <WhatsAppOrderLinks message={`مرحباً، أريد تقديم طلب من منيو ${siteName}`} />
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="اطلب عبر واتساب"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:brightness-95"
      >
        <WhatsAppIcon className="h-7 w-7" />
      </button>
    </div>
  );
}
