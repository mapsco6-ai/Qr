"use client";

import { useCart } from "@/context/CartContext";
import CartIcon from "./CartIcon";

interface CartButtonProps {
  onClick: () => void;
}

export default function CartButton({ onClick }: CartButtonProps) {
  const { totalCount } = useCart();

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="السلة"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-ember-600 text-white shadow-lg transition hover:bg-ember-700"
    >
      <CartIcon className="h-6 w-6" />
      {totalCount > 0 && (
        <span className="absolute -top-1 -left-1 flex h-6 w-6 items-center justify-center rounded-full bg-gold-500 text-xs font-bold text-charcoal-900 shadow">
          {totalCount}
        </span>
      )}
    </button>
  );
}
