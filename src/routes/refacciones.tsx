import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { CartDrawer } from "@/components/CartDrawer";
import { SimpleCard } from "@/components/ProductCard";
import { REFACCIONES } from "@/data/products";

export const Route = createFileRoute("/refacciones")({
  head: () => ({
    meta: [
      { title: "Refacciones para minisplit: tarjetas, sensores y motores | Climas Max" },
      {
        name: "description",
        content:
          "Refacciones originales y universales para minisplits: tarjetas electrónicas, sensores NTC, motores de ventilador y capacitores con envío a todo México.",
      },
      { property: "og:title", content: "Refacciones para minisplit | Climas Max" },
      { property: "og:description", content: "Tarjetas, sensores, motores y capacitores para reparar tu minisplit." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RefaccionesPage,
});

function RefaccionesPage() {
  return (
    <>
      <SiteHeader />
      <CartDrawer />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="font-display text-3xl font-extrabold tracking-tight">Refacciones</h1>
        <p className="mt-2 max-w-[60ch] text-sm text-muted-foreground">
          Tarjetas, sensores, motores y capacitores para dejar tu equipo como nuevo.
        </p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {REFACCIONES.map((p) => (
            <SimpleCard key={p.id} product={p} />
          ))}
        </div>
      </main>
      <SiteFooter />
      <WhatsAppFab />
    </>
  );
}
