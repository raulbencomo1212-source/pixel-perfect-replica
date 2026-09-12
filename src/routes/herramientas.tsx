import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { CartDrawer } from "@/components/CartDrawer";
import { SimpleCard } from "@/components/ProductCard";
import { HERRAMIENTAS } from "@/data/products";

export const Route = createFileRoute("/herramientas")({
  head: () => ({
    meta: [
      { title: "Herramientas HVAC: bombas de vacío, manómetros y abocinadores | Climas Max" },
      {
        name: "description",
        content:
          "Equipo profesional para instalación de minisplits: bombas de vacío, juegos de manómetros R32/R410A, abocinadores y pinzas amperimétricas.",
      },
      { property: "og:title", content: "Herramientas HVAC profesionales | Climas Max" },
      { property: "og:description", content: "Bombas de vacío, manómetros y abocinadores para técnicos en refrigeración." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HerramientasPage,
});

function HerramientasPage() {
  return (
    <>
      <SiteHeader />
      <CartDrawer />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="font-display text-3xl font-extrabold tracking-tight">Herramientas</h1>
        <p className="mt-2 max-w-[60ch] text-sm text-muted-foreground">
          Todo lo que un técnico necesita para instalar y dar servicio a equipos de clima.
        </p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {HERRAMIENTAS.map((p) => (
            <SimpleCard key={p.id} product={p} />
          ))}
        </div>
      </main>
      <SiteFooter />
      <WhatsAppFab />
    </>
  );
}
