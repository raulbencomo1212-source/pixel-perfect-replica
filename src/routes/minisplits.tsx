import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { CartDrawer } from "@/components/CartDrawer";
import { MinisplitCard } from "@/components/ProductCard";
import { MINISPLITS, TONS_LIST, priceKey, type Tech, type Tons } from "@/data/products";

type Search = { tech?: Tech | undefined; tons?: Tons | undefined };

export const Route = createFileRoute("/minisplits")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    tech: search["tech"] === "inverter" || search["tech"] === "convencional" ? (search["tech"] as Tech) : undefined,
    tons: TONS_LIST.includes(search["tons"] as Tons) ? (search["tons"] as Tons) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Minisplits Inverter y Convencionales a 12 MSI | Climas Max" },
      {
        name: "description",
        content:
          "Compra minisplits de 1, 1.5 y 2 toneladas en 110V o 220V, solo frío o frío y calor. Hasta 12 meses sin intereses e instalación disponible.",
      },
      { property: "og:title", content: "Minisplits Inverter y Convencionales | Climas Max" },
      { property: "og:description", content: "Catálogo de minisplits con precio de contado y pago a 12 MSI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MinisplitsPage,
});

function MinisplitsPage() {
  const initial = Route.useSearch();
  const [tech, setTech] = useState<Tech | undefined>(initial.tech);
  const [tons, setTons] = useState<Tons | undefined>(initial.tons);

  const filtrados = MINISPLITS.filter(
    (p) =>
      (!tech || p.tech === tech) &&
      (!tons || Object.keys(p.precios).some((k) => k === priceKey(tons, "220V", "frio") || k === priceKey(tons, "110V", "frio"))),
  );

  const pills: { label: string; active: boolean; onClick: () => void }[] = [
    { label: "Todos", active: !tech && !tons, onClick: () => { setTech(undefined); setTons(undefined); } },
    { label: "Inverter", active: tech === "inverter", onClick: () => setTech(tech === "inverter" ? undefined : "inverter") },
    {
      label: "Convencional",
      active: tech === "convencional",
      onClick: () => setTech(tech === "convencional" ? undefined : "convencional"),
    },
    ...TONS_LIST.map((t) => ({
      label: `${t} Ton`,
      active: tons === t,
      onClick: () => setTons(tons === t ? undefined : t),
    })),
  ];

  return (
    <>
      <SiteHeader />
      <CartDrawer />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="font-display text-3xl font-extrabold tracking-tight">Minisplits</h1>
        <p className="mt-2 max-w-[60ch] text-sm text-muted-foreground">
          Elige capacidad, voltaje y modo en la página de cada equipo. Todos los precios incluyen kit de instalación
          básico de fábrica y pueden pagarse a 12 meses sin intereses.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {pills.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={p.onClick}
              className={
                p.active
                  ? "rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                  : "rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition hover:bg-secondary"
              }
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filtrados.map((p) => (
            <MinisplitCard key={p.id} product={p} />
          ))}
        </div>
      </main>
      <SiteFooter />
      <WhatsAppFab />
    </>
  );
}
