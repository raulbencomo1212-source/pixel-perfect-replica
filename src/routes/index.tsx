import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { CapacityCalculator } from "@/components/CapacityCalculator";
import { TONNAGES, mxn } from "@/lib/products";
import avatar1 from "@/assets/avatar-1.jpg";
import avatar2 from "@/assets/avatar-2.jpg";
import avatar3 from "@/assets/avatar-3.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NorteClima · Minisplits Inverter con instalación en México" },
      {
        name: "description",
        content:
          "Tienda especializada en minisplits: calcula tus BTU por metro cuadrado, compara SEER y R32, y compra con envío inmediato e instalación certificada.",
      },
      { property: "og:title", content: "NorteClima · Minisplits Inverter con instalación" },
      {
        property: "og:description",
        content:
          "Calculadora de capacidad, catálogo por tonelaje y ficha técnica completa. Meses sin intereses y garantía de fábrica.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const BENEFITS = [
  {
    title: "10 meses sin intereses",
    body: "Con tarjeta participante. Aprovecha crédito en todas las unidades.",
  },
  {
    title: "Garantía de fábrica",
    body: "Hasta 10 años en compresor inverter y 5 en partes eléctricas.",
  },
  {
    title: "Envío inmediato",
    body: "Salimos el mismo día en CDMX, Guadalajara y Monterrey.",
  },
  {
    title: "Instalación certificada",
    body: "Con o sin instalación. Verifica cobertura por código postal.",
  },
];

function Index() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-5">
        <section className="grid gap-8 py-10 lg:grid-cols-12">
          <div className="animate-rise lg:col-span-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-primary">
              Especialistas en minisplits · MX
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight text-balance md:text-5xl">
              Aire frío, <span className="text-primary">medido al metro cuadrado.</span>
            </h1>
            <p className="mt-5 max-w-[46ch] font-body text-base text-muted-foreground text-pretty">
              El único e-commerce de minisplits en México. Cotiza por tonaje, compara SEER y R32, con instalación
              certificada y envío inmediato.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href="#calc"
                className="rounded-md bg-primary px-5 py-3 font-body text-sm font-semibold text-primary-foreground ring-1 ring-black/5 transition hover:brightness-110"
              >
                Calcular mi BTU
              </a>
              <a
                href="#ton"
                className="rounded-md px-5 py-3 font-body text-sm font-semibold text-foreground ring-1 ring-foreground/15 transition hover:bg-foreground/5"
              >
                Ver por tonaje
              </a>
            </div>
            <div className="mt-8 grid grid-cols-3 divide-x divide-border rounded-md ring-1 ring-border">
              <div className="px-4 py-3">
                <div className="font-display text-2xl font-bold tracking-tight">12,400+</div>
                <div className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                  Instalaciones
                </div>
              </div>
              <div className="px-4 py-3">
                <div className="font-display text-2xl font-bold tracking-tight">10 yrs</div>
                <div className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                  Garantía compresor
                </div>
              </div>
              <div className="px-4 py-3">
                <div className="font-display text-2xl font-bold tracking-tight">4.9/5</div>
                <div className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                  2,180 reseñas
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <div className="flex -space-x-2">
                {[avatar1, avatar2, avatar3].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    width={512}
                    height={512}
                    loading="lazy"
                    className="size-8 rounded-full object-cover ring-1 ring-border"
                  />
                ))}
              </div>
              <p className="font-body text-xs text-muted-foreground">
                “Instalaron dos minisplits <span className="font-semibold text-foreground">en un día</span>. CDMX,
                Pedregal.” — Ana R.
              </p>
            </div>
          </div>

          <div id="calc" className="lg:col-span-7">
            <CapacityCalculator />
          </div>
        </section>

        <section id="ton" className="py-10">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-2xl font-bold tracking-tight text-balance">Elige por tonaje</h2>
            <span className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
              (b) Rango de uso
            </span>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TONNAGES.map((t) => {
              const featured = t.tons === 2;
              return (
                <Link
                  key={t.tons}
                  to="/catalogo"
                  search={{ tons: t.tons }}
                  className={`group rounded-lg bg-background p-5 ring-1 transition ${
                    featured ? "ring-primary/50 hover:ring-primary" : "ring-border hover:ring-primary/40"
                  }`}
                >
                  <div
                    className={`font-mono text-[10px] uppercase tracking-wide ${
                      featured ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {t.tons.toFixed(1)} ton{featured ? " · más buscado" : ""}
                  </div>
                  <div className="mt-1 font-display text-2xl font-bold tracking-tight">
                    {t.btu.toLocaleString("es-MX")} BTU
                  </div>
                  <div className="mt-3 font-body text-xs text-muted-foreground">
                    {t.use}
                    <br />
                    {t.area}
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                    <span className="font-display font-semibold">desde {mxn(t.from)}</span>
                    <span className="text-primary transition group-hover:translate-x-0.5">→</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="py-10">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-2xl font-bold tracking-tight">Por qué NorteClima</h2>
            <span className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
              (c) Confianza y cobertura
            </span>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((b) => (
              <div key={b.title} className="rounded-lg p-5 ring-1 ring-border">
                <div className="font-display text-lg font-bold tracking-tight">{b.title}</div>
                <p className="mt-2 font-body text-xs text-muted-foreground">{b.body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
      <WhatsAppFab />
    </>
  );
}
