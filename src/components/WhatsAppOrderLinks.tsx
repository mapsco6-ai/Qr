import { WHATSAPP_CONTACTS, buildWhatsappUrl } from "@/lib/whatsapp";
import WhatsAppIcon from "./WhatsAppIcon";

interface WhatsAppOrderLinksProps {
  message: string;
  className?: string;
}

export default function WhatsAppOrderLinks({ message, className = "" }: WhatsAppOrderLinksProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {WHATSAPP_CONTACTS.map((contact) => (
        <a
          key={contact.phone}
          href={buildWhatsappUrl(contact.phone, message)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-2.5 text-sm font-bold text-white shadow-sm transition hover:brightness-95"
        >
          <WhatsAppIcon className="h-5 w-5" />
          {contact.label}
        </a>
      ))}
    </div>
  );
}
