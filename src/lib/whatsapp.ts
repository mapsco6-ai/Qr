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
