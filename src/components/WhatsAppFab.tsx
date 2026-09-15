import { MessageCircle } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/data/products";

export function WhatsAppFab() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola%20ClimasMax,%20me%20gustar%C3%ADa%20cotizar%20un%20minisplit`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Cotizar por WhatsApp"
      className="animate-pulse-ring fixed bottom-6 right-6 z-50 grid size-14 place-items-center rounded-full bg-emerald text-emerald-foreground shadow-lg transition hover:scale-105"
    >
      <MessageCircle className="size-7" />
    </a>
  );
}
