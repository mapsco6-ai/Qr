"use client";

import { motion } from "framer-motion";
import { MenuItemDto } from "@/lib/types";
import { formatPrice, CURRENCY_LABEL } from "@/lib/pricing";

interface MenuItemCardProps {
  item: MenuItemDto;
  index: number;
  onClick: () => void;
}

export default function MenuItemCard({ item, index, onClick }: MenuItemCardProps) {
  const hasDiscount = item.oldPrice > item.newPrice && item.oldPrice > 0;

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: Math.min(index, 8) * 0.04, ease: "easeOut" }}
      whileTap={{ scale: 0.98 }}
      className="flex w-full items-stretch gap-3 rounded-2xl border border-cream-200 bg-white p-2.5 text-right shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="min-w-0 flex-1 flex-col justify-between py-1 pr-1">
        <div className="flex flex-col gap-1">
          {item.isOffer && (
            <span className="w-fit rounded-full bg-gold-100 px-2 py-0.5 text-[11px] font-bold text-gold-700">
              عرض خاص
            </span>
          )}
          <h3 className="font-bold leading-snug text-charcoal-800">{item.name}</h3>
          {item.description && (
            <p className="line-clamp-1 text-xs text-charcoal-400">{item.description}</p>
          )}
        </div>

        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-lg font-extrabold text-ember-700">
            {formatPrice(item.newPrice)}
          </span>
          <span className="text-[11px] text-charcoal-400">{CURRENCY_LABEL}</span>
          {hasDiscount && (
            <span className="text-xs text-charcoal-300 line-through">
              {formatPrice(item.oldPrice)}
            </span>
          )}
        </div>
      </div>

      <div className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-xl bg-cream-100 sm:w-28">
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-cream-300">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 5h16v14H4z" />
              <path d="M4 15l4-4 4 4 4-6 4 6" />
            </svg>
          </div>
        )}
        {hasDiscount && (
          <span className="absolute right-1.5 top-1.5 rounded-full bg-ember-600 px-2 py-0.5 text-[10px] font-bold text-white shadow">
            خصم
          </span>
        )}
      </div>
    </motion.button>
  );
}
