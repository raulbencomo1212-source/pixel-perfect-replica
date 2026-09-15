import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CreditCard, Truck, MessageCircle, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { CartDrawer } from "@/components/CartDrawer";
import { MinisplitCard } from "@/components/ProductCard";
import { CapacityCalculator } from "@/components/CapacityCalculator";
import { MINISPLITS, TONS_LIST, type Tech, type Tons } from "@/data/products";
import heroImg from "@/assets/hero-sala.jpg";

/**
 * En el inicio solo se muestran estos 3 (mas vendidos / oferta), para que en movil
 * no haya que scrollear tanto. El catalogo completo sigue disponible en /minisplits.
 */
const DESTACADOS_HOME = ["inverterx", "life12", "x5"];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Climas Max | Minisplits, refacciones y herramientas a 12 MSI" },
      {
        name: "description",
        content:
          "Venta de minisplits Inverter y convencionales en México. Paga hasta 12 meses sin intereses, con refacciones y herramientas HVAC.",
      },
      { property: "og:title", content: "Climas Max | Minisplits a 12 Meses Sin Intereses" },
      {
        property: "og:description",
        content: "Minisplits garantizados, refacciones y herramientas HVAC con envío a todo el país.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const [tech, setTech] = useState<Tech | undefined>(undefined);
  const [tons, setTons] = useState<Tons | undefined>(undefined);

  const destacados = MINISPLITS.filter((p) => DESTACADOS_HOME.includes(p.id));
  const visibles = destacados.filter((p) => (!tech || p.tech === tech) && (!tons || TONS_LIST.includes(tons)));

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
      <main>
        <section className="border-b border-border bg-navy text-navy-foreground">
          <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 lg:grid-cols-2 lg:py-16">
            <div className="animate-rise">
              <span className="rounded-full bg-emerald px-3 py-1 text-[12px] font-bold text-emerald-foreground">
                Hasta 12 Meses Sin Intereses
              </span>
              <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
                Equipa tu espacio hoy y paga a 12 Meses Sin Intereses
              </h1>
              <p className="mt-4 max-w-[52ch] text-navy-foreground/80">
                Venta de minisplits garantizados, además de refacciones y herramientas para técnicos HVAC.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to="/minisplits"
                  search={{}}
                  className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
                >
                  Ver Climas
                </Link>
                <Link
                  to="/calculadora"
                  className="rounded-lg border border-navy-foreground/25 px-6 py-3 font-semibold transition hover:bg-navy-foreground/10"
                >
                  ¿Cuál es mi clima ideal?
                </Link>
              </div>
            </div>
            <img
              src={heroImg}
              alt="Minisplit enfriando una sala moderna"
              width={1600}
              height={893}
              className="w-full rounded-2xl object-cover shadow-xl"
            />
          </div>
        </section>

        <section className="border-b border-border bg-secondary/40">
          <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: CreditCard, t: "12 MSI", d: "Con tarjetas participantes" },
              { icon: Truck, t: "Envío rápido", d: "Cobertura nacional" },
              { icon: MessageCircle, t: "Atención Personalizada", d: "Por WhatsApp y teléfono" },
              { icon: ShieldCheck, t: "Garantía", d: "Directa de fábrica" },
            ].map(({ icon: Icon, t, d }) => (
              <div key={t} className="flex items-center gap-3">
                <Icon className="size-6 text-primary" />
                <div>
                  <div className="text-sm font-semibold">{t}</div>
                  <div className="text-[12px] text-muted-foreground">{d}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-2xl font-extrabold tracking-tight">Minisplits Más Vendidos</h2>
            <Link to="/minisplits" search={{}} className="text-sm font-semibold text-primary hover:underline">
              Ver todo el catálogo →
            </Link>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
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
          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {visibles.map((p) => (
              <MinisplitCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-12">
          <h2 className="font-display text-2xl font-extrabold tracking-tight">¿Cuál es mi clima ideal?</h2>
          <p className="mt-2 max-w-[60ch] text-sm text-muted-foreground">
            Calcula los BTU y las toneladas que necesita tu espacio en segundos.
          </p>
          <div className="mt-6">
            <CapacityCalculator />
          </div>
        </section>
      </main>
      <SiteFooter />
      <WhatsAppFab />
    </>
  );
}
