import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import productImg from "@/assets/minisplit-product.jpg";
import {
  PRODUCTS,
  mxn,
  priceFor,
  type Mode,
  type Tonnage,
  type Voltage,
} from "@/lib/products";

type Search = { tons?: Tonnage | undefined; voltage?: Voltage | undefined; mode?: Mode | undefined };

export const Route = createFileRoute("/producto/$slug")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    tons: [1, 1.5, 2, 3].includes(Number(search["tons"])) ? (Number(search["tons"]) as Tonnage) : undefined,
    voltage: search["voltage"] === "110V" || search["voltage"] === "220V" ? search["voltage"] : undefined,
    mode:
      search["mode"] === "Solo Frío" || search["mode"] === "Frío/Calor" ? (search["mode"] as Mode) : undefined,
  }),
  loader: ({ params }) => {
    const product = PRODUCTS.find((p) => p.slug === params.slug);
    if (!product) throw notFound();
    return product;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.name ?? "Minisplit"} · configura tonelaje y voltaje | NorteClima` },
      {
        name: "description",
        content:
          loaderData?.tagline ??
          "Configura tu minisplit por tecnología, tonelaje, voltaje y modo, con ficha técnica y precio en MXN.",
      },
      { property: "og:title", content: `${loaderData?.name ?? "Minisplit"} | NorteClima` },
      {
        property: "og:description",
        content: loaderData?.tagline ?? "Minisplits con ficha técnica completa y precio en MXN.",
      },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Producto,
});

function Producto() {
  const product = Route.useLoaderData();
  const search = Route.useSearch();
  const [tons, setTons] = useState<Tonnage>(search.tons ?? 1.5);
  const [voltage, setVoltage] = useState<Voltage>(search.voltage ?? "220V");
  const [mode, setMode] = useState<Mode>(search.mode ?? "Frío/Calor");
  const [withInstall, setWithInstall] = useState(true);

  const variant = priceFor(product, tons, voltage, mode);
  const total = (variant?.price ?? 0) + (withInstall ? 1850 : 0);

  const tonOptions: Tonnage[] = [1, 1.5, 2, 3];
  const voltOptions: Voltage[] = ["110V", "220V"];
  const modeOptions: Mode[] = ["Solo Frío", "Frío/Calor"];

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-5">
        <section className="grid gap-8 py-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <img
              src={productImg}
              alt={`${product.name} instalado en muro`}
              width={1280}
              height={960}
              className="aspect-[4/3] w-full rounded-xl object-cover ring-1 ring-border"
            />
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.15em] text-primary">
              {product.brand} · {variant?.tech ?? "Inverter"}
            </p>
            <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance">
              {product.name} · {tons} ton · {voltage} · {mode}
            </h1>
            <p className="mt-4 max-w-[52ch] font-body text-sm text-muted-foreground text-pretty">
              {product.tagline}
            </p>

            <div className="mt-7 flex items-baseline justify-between">
              <h2 className="font-display text-xl font-bold tracking-tight">Ficha técnica</h2>
              <span className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                (a) Actualiza con tu configuración
              </span>
            </div>
            <div className="mt-3 overflow-hidden rounded-lg ring-1 ring-border">
              <table className="w-full font-mono text-[12px]">
                <tbody>
                  <Row label="Capacidad" value={`${tons} ton · ${(tons * 12000).toLocaleString("es-MX")} BTU/h`} />
                  <Row label="Refrigerante" value={variant?.refrigerant ?? "—"} alt />
                  <Row label="Ruido interior" value={variant ? `${variant.noiseDb} dB` : "—"} />
                  <Row label="Consumo" value={variant ? `${variant.kwh} kW/h` : "—"} alt />
                  <Row label="Eficiencia" value={variant ? `SEER ${variant.seer}` : "—"} />
                  <Row label="Voltaje" value={`${voltage} · 60 Hz`} alt />
                  <Row label="Función" value={mode} />
                  <Row
                    label="Garantía compresor"
                    value={variant ? `${variant.warrantyYears} años` : "—"}
                    alt
                  />
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="sticky top-24 rounded-xl bg-foreground p-6 text-background ring-1 ring-black/5 md:p-8">
              <div className="flex items-baseline justify-between">
                <h2 className="font-display text-xl font-bold tracking-tight">Configura tu equipo</h2>
                <span className="font-mono text-[10px] uppercase tracking-wide text-background/50">
                  {variant ? variant.stock : "No disponible"}
                </span>
              </div>

              <Group label="Tonelaje">
                {tonOptions.map((t) => (
                  <Opt key={t} active={tons === t} onClick={() => setTons(t)}>
                    {t} T
                  </Opt>
                ))}
              </Group>
              <Group label="Voltaje">
                {voltOptions.map((v) => (
                  <Opt key={v} active={voltage === v} onClick={() => setVoltage(v)}>
                    {v}
                  </Opt>
                ))}
              </Group>
              <Group label="Función">
                {modeOptions.map((m) => (
                  <Opt key={m} active={mode === m} onClick={() => setMode(m)}>
                    {m}
                  </Opt>
                ))}
              </Group>

              <div className="mt-6 rounded-lg bg-background/8 p-4 ring-1 ring-background/10">
                {variant ? (
                  <>
                    <div className="font-mono text-[10px] uppercase tracking-wide text-background/60">Precio</div>
                    <div className="font-display text-3xl font-bold tracking-tight">{mxn(total)}</div>
                    <div className="mt-1 font-mono text-[11px] text-background/60">
                      o 10 MSI de {mxn(Math.round(total / 10))} · IVA incluido
                    </div>
                  </>
                ) : (
                  <div className="font-body text-sm text-background/70">
                    Esa combinación no existe: los equipos de 2 y 3 toneladas solo se fabrican en 220V.
                  </div>
                )}
                <label className="mt-4 flex items-center gap-2.5 font-body text-sm text-background/85">
                  <input
                    type="checkbox"
                    checked={withInstall}
                    onChange={(e) => setWithInstall(e.target.checked)}
                    className="size-4 accent-[oklch(0.55_0.13_243)]"
                  />
                  Agregar instalación certificada{" "}
                  <span className="font-mono text-[11px] text-background/50">+ $1,850</span>
                </label>
                <button
                  type="button"
                  disabled={!variant}
                  className="mt-5 w-full rounded-md bg-primary py-3 font-body text-sm font-semibold text-primary-foreground transition hover:brightness-110 disabled:opacity-40"
                >
                  Agregar al carrito
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <WhatsAppFab
        message={`Hola, me interesa el ${product.name} de ${tons} ton, ${voltage}, ${mode}. ¿Precio con instalación?`}
      />
    </>
  );
}

function Row({ label, value, alt }: { label: string; value: string; alt?: boolean }) {
  return (
    <tr className={alt ? "border-b border-border bg-secondary/60" : "border-b border-border"}>
      <td className="px-4 py-2.5 text-[11px] uppercase tracking-[0.08em] text-muted-foreground">{label}</td>
      <td className="px-4 py-2.5 text-right">{value}</td>
    </tr>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <span className="font-mono text-[10px] uppercase tracking-wide text-background/60">{label}</span>
      <div className="mt-2 flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Opt({
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
          ? "rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
          : "rounded-md px-3 py-2 text-xs text-background/70 ring-1 ring-background/15"
      }
    >
      {children}
    </button>
  );
}
