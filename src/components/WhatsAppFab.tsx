export function WhatsAppFab({ message }: { message?: string }) {
  const text = encodeURIComponent(
    message ?? "Hola, quiero cotizar un minisplit con instalación. ¿Me apoyan?",
  );
  return (
    <a
      href={`https://wa.me/5215555555555?text=${text}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-success px-4 py-3 font-body text-sm font-semibold text-background ring-1 ring-black/5 shadow-sm"
    >
      <span className="grid size-5 place-items-center rounded-full bg-background/20 font-mono text-[10px]">W</span>
      Cotiza por WhatsApp
    </a>
  );
}
