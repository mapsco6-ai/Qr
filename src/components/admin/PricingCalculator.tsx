"use client";

import { calculatePricing, formatPrice, CURRENCY_LABEL } from "@/lib/pricing";

interface PricingCalculatorProps {
  productCost: number;
  saladCost: number;
  oldPrice: number;
  newPrice: number;
}

export default function PricingCalculator({
  productCost,
  saladCost,
  oldPrice,
  newPrice,
}: PricingCalculatorProps) {
  const result = calculatePricing({ productCost, saladCost, oldPrice, newPrice });

  return (
    <div className="grid grid-cols-2 gap-2 rounded-xl bg-cream-100 p-3 text-sm sm:grid-cols-4">
      <Stat label="إجمالي الكلفة" value={`${formatPrice(result.totalCost)} ${CURRENCY_LABEL}`} />
      <Stat label="نسبة الربح (سعر قديم)" value={`${result.oldMarginPercent}%`} />
      <Stat label="نسبة الربح (سعر جديد)" value={`${result.newMarginPercent}%`} />
      <Stat
        label="فرق السعر"
        value={`${result.priceDiff >= 0 ? "+" : ""}${formatPrice(result.priceDiff)} ${CURRENCY_LABEL} (${
          result.priceDiffPercent >= 0 ? "+" : ""
        }${result.priceDiffPercent}%)`}
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-charcoal-400">{label}</span>
      <span className="font-bold text-charcoal-700">{value}</span>
    </div>
  );
}
