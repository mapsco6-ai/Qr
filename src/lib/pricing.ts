export interface PricingInput {
  productCost: number;
  saladCost: number;
  oldPrice: number;
  newPrice: number;
}

export interface PricingResult {
  totalCost: number;
  oldMarginPercent: number;
  newMarginPercent: number;
  priceDiff: number;
  priceDiffPercent: number;
}

/**
 * Replicates the restaurant's Excel pricing sheet:
 * total cost = product cost + salad cost
 * margin % = (price - total cost) / total cost * 100
 */
export function calculatePricing({
  productCost,
  saladCost,
  oldPrice,
  newPrice,
}: PricingInput): PricingResult {
  const totalCost = productCost + saladCost;

  const marginPercent = (price: number) =>
    totalCost > 0 ? Math.round(((price - totalCost) / totalCost) * 100) : 0;

  const priceDiff = newPrice - oldPrice;
  const priceDiffPercent = oldPrice > 0 ? Math.round((priceDiff / oldPrice) * 100) : 0;

  return {
    totalCost,
    oldMarginPercent: marginPercent(oldPrice),
    newMarginPercent: marginPercent(newPrice),
    priceDiff,
    priceDiffPercent,
  };
}

export const CURRENCY_LABEL = "د.ع";

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("ar", { maximumFractionDigits: 0 }).format(value);
}
