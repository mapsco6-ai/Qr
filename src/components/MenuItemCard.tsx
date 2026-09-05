"use client";

import { MenuItemDto } from "@/lib/types";
import { formatPrice, CURRENCY_LABEL } from "@/lib/pricing";

interface MenuItemCardProps {
  item: MenuItemDto;
  onClick: () => void;
}

export default function MenuItemCard({ item, onClick }: MenuItemCardProps) {
  const hasDiscount = item.oldPrice > item.newPrice && item.oldPrice > 0;

  return (
    <button
      onClick={onClick}
      className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white text-right shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-stone-300">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 5h16v14H4z" />
              <path d="M4 15l4-4 4 4 4-6 4 6" />
            </svg>
          </div>
        )}
        {hasDiscount && (
          <span className="absolute top-2 right-2 rounded-full bg-red-600 px-2.5 py-1 text-xs font-bold text-white shadow">
            عرض خاص
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <h3 className="font-bold text-stone-800">{item.name}</h3>
        {item.description && (
          <p className="line-clamp-2 text-sm text-stone-500">{item.description}</p>
        )}
        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <span className="text-lg font-extrabold text-brand-700">
            {formatPrice(item.newPrice)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-stone-400 line-through">
              {formatPrice(item.oldPrice)}
            </span>
          )}
          <span className="text-xs text-stone-400">{CURRENCY_LABEL}</span>
        </div>
      </div>
    </button>
  );
}
