import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import productImg from "@/assets/minisplit-product.jpg";
import {
  PRODUCTS,
  TONNAGES,
  mxn,
  type Mode,
  type Tech,
  type Tonnage,
  type Voltage,
} from "@/lib/products";

type Search = { tech?: Tech; mode?: Mode; tons?: Tonnage; voltage?: Voltage };

export const Route = createFileRoute("/catalogo")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    tech: search.tech === "Inverter" || search.tech === "Convencional" ? search.tech : undefined,
    mode: search.mode === "Solo Frío" || search.mode === "Frío/Calor" ? search.mode : undefined,
    voltage: search.voltage === "110V" || search.voltage === "220V" ? search.voltage : undefined,
    tons: [1, 1.5, 2, 3].includes(Number(search.tons)) ? (Number(search.tons) as Tonnage) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Catálogo de minisplits Inverter y convencionales | NorteClima" },
      {
        name: "description",
        content:
          "Filtra minisplits por tonelaje, voltaje, tecnología Inverter y modo frío o frío/calor. Precios en MXN con envío inmediato.",
      },
      { property: "og:title", content: "Catálogo de minisplits | NorteClima" },
      {
        property: "og:description",
        content: "Minisplits de 1 a 3 toneladas, 110V y 220V, con ficha técnica completa y meses sin intereses.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Catalogo,
});

const TECHS: Tech[] = ["Inverter", "Convencional"];
const MODES: Mode[] = ["Solo Frío", "Frío/Calor"];
const VOLTS: Voltage[] = ["110V", "220V"];

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "rounded-md bg-primary px-3 py-2 font-mono text-[11px] uppercase tracking-wide text-primary-foreground"
          : "rounded-md px-3 py-2 font-mono text-[11px] uppercase tracking-wide text-muted-foreground ring-1 ring-border transition hover:text-foreground"
      }
    >
      {children}
    </button>
  );
}

function Catalogo() {
  const initial = Route.useSearch();
  const [tech, setTech] = useState<Tech | undefined>(initial.tech);
  const [mode, setMode] = useState<Mode | undefined>(initial.mode);
  const [tons, setTons] = useState<Tonnage | undefined>(initial.tons);
  const [voltage, setVoltage] = useState<Voltage | undefined>(initial.voltage);

  const rows = useMemo(() => {
    return PRODUCTS.flatMap((p) =>
      p.variants
        .filter(
          (v) =>
            (!tech || v.tech === tech) &&
            (!mode || v.mode === mode) &&
            (!tons || v.tons === tons) &&
            (!voltage || v.voltage === voltage),
        )
        .map((v) => ({ product: p, variant: v })),
    ).sort((a, b) => a.variant.price - b.variant.price);
  }, [tech, mode, tons, voltage]);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-5">
        <section className="py-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-primary">Catálogo</p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance">
            Minisplits filtrados por tecnología, tonelaje y voltaje
          </h1>
          <p className="mt-4 max-w-[52ch] font-body text-sm text-muted-foreground text-pretty">
            Cada combinación muestra su precio real en MXN, refrigerante, consumo y garantía de compresor.
          </p>

          <div className="mt-7 grid gap-4 rounded-lg p-5 ring-1 ring-border sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">Tecnología</div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {TECHS.map((t) => (
                  <Chip key={t} active={tech === t} onClick={() => setTech(tech === t ? undefined : t)}>
                    {t}
                  </Chip>
                ))}
              </div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">Tonelaje</div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {TONNAGES.map((t) => (
                  <Chip
                    key={t.tons}
                    active={tons === t.tons}
                    onClick={() => setTons(tons === t.tons ? undefined : t.tons)}
                  >
                    {t.tons} T
                  </Chip>
                ))}
              </div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">Voltaje</div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {VOLTS.map((v) => (
                  <Chip key={v} active={voltage === v} onClick={() => setVoltage(voltage === v ? undefined : v)}>
                    {v}
                  </Chip>
                ))}
              </div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">Función</div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {MODES.map((m) => (
                  <Chip key={m} active={mode === m} onClick={() => setMode(mode === m ? undefined : m)}>
                    {m}
                  </Chip>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
            {rows.length} combinaciones disponibles
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map(({ product, variant }) => (
              <Link
                key={`${product.slug}-${variant.tons}-${variant.voltage}-${variant.mode}`}
                to="/producto/$slug"
                params={{ slug: product.slug }}
                search={{ tons: variant.tons, voltage: variant.voltage, mode: variant.mode }}
                className="group rounded-lg p-5 ring-1 ring-border transition hover:ring-primary/40"
              >
                <img
                  src={productImg}
                  alt={`${product.name} de ${variant.tons} toneladas`}
                  loading="lazy"
                  width={1280}
                  height={960}
                  className="aspect-[4/3] w-full rounded-md object-cover"
                />
                <div className="mt-4 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                  {variant.tech} · {variant.tons} ton · {variant.voltage} · {variant.mode}
                </div>
                <div className="mt-1 font-display text-lg font-bold tracking-tight">{product.name}</div>
                <div className="mt-2 font-mono text-[11px] text-muted-foreground">
                  {variant.btuLabel ?? `${(variant.tons * 12000).toLocaleString("es-MX")} BTU`} ·{" "}
                  {variant.refrigerant} · {variant.noiseDb} dB · SEER {variant.seer}
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                  <span className="font-display font-semibold">{mxn(variant.price)}</span>
                  <span className="text-primary transition group-hover:translate-x-0.5">→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
      <WhatsAppFab />
    </>
  );
}
