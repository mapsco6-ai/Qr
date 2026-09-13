import { CartItem } from "@/context/CartContext";
import { CURRENCY_LABEL, formatPrice } from "./pricing";

export interface WhatsAppContact {
  label: string;
  phone: string;
}

export const WHATSAPP_CONTACTS: WhatsAppContact[] = [
  { label: "التواصل على الرقم الأول", phone: "9647705050381" },
  { label: "التواصل على الرقم الثاني", phone: "9647705050382" },
];

export function buildWhatsappUrl(phone: string, message: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function buildCartMessage(items: CartItem[], siteName: string) {
  const lines = items.map(
    (item, index) =>
      `${index + 1}. ${item.name} × ${item.quantity} - ${formatPrice(item.price * item.quantity)} ${CURRENCY_LABEL}`
  );
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return [
    `مرحباً، أريد تقديم الطلب التالي من منيو ${siteName}:`,
    "",
    ...lines,
    "",
    `الإجمالي: ${formatPrice(total)} ${CURRENCY_LABEL}`,
  ].join("\n");
}
