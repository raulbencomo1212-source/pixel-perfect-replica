import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsAppFab } from "@/components/WhatsAppFab";

export const Route = createFileRoute("/instalacion")({
  head: () => ({
    meta: [
      { title: "Instalación y cobertura por código postal | NorteClima" },
      {
        name: "description",
        content:
          "Verifica con tu código postal si tenemos envío inmediato e instalación certificada de minisplits en tu zona.",
      },
      { property: "og:title", content: "Instalación y cobertura de minisplits | NorteClima" },
      {
        property: "og:description",
        content: "Consulta cobertura de envío e instalación certificada por código postal en México.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Instalacion,
});

const COVERED = ["01", "03", "04", "05", "06", "11", "44", "45", "64", "66", "80", "83"];

function Instalacion() {
  const [cp, setCp] = useState("");
  const [result, setResult] = useState<null | { install: boolean }>(null);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-5">
        <section className="grid gap-8 py-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-primary">Cobertura</p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight text-balance">
              Verifica tu código postal <span className="text-primary">antes de comprar.</span>
            </h1>
            <p className="mt-5 max-w-[46ch] font-body text-base text-muted-foreground text-pretty">
              Enviamos a todo México. La instalación certificada está disponible en zonas metropolitanas de CDMX,
              Guadalajara, Monterrey y Sonora.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg p-5 ring-1 ring-border">
                <div className="font-display text-lg font-bold tracking-tight">Qué incluye</div>
                <p className="mt-2 font-body text-xs text-muted-foreground">
                  Hasta 3 m de tubería, soporte de pared, vacío con bomba y prueba de fugas.
                </p>
              </div>
              <div className="rounded-lg p-5 ring-1 ring-border">
                <div className="font-display text-lg font-bold tracking-tight">Costo estimado</div>
                <p className="mt-2 font-body text-xs text-muted-foreground">
                  Desde $1,850 MXN por equipo. Material extra se cotiza en sitio.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-xl bg-foreground p-6 text-background ring-1 ring-black/5 md:p-8">
              <div className="flex items-baseline justify-between">
                <h2 className="font-display text-xl font-bold tracking-tight">Buscador de cobertura</h2>
                <span className="font-mono text-[10px] uppercase tracking-wide text-background/50">
                  (a) Código postal
                </span>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setResult({ install: COVERED.includes(cp.slice(0, 2)) });
                }}
                className="mt-6 flex flex-wrap gap-3"
              >
                <input
                  value={cp}
                  onChange={(e) => setCp(e.target.value.replace(/\D/g, "").slice(0, 5))}
                  placeholder="Ej. 03100"
                  inputMode="numeric"
                  className="w-40 rounded-md border-0 bg-background/10 px-3 py-2.5 font-display text-lg font-semibold text-background outline-none ring-1 ring-background/15 placeholder:text-background/30 focus:ring-primary"
                />
                <button
                  type="submit"
                  disabled={cp.length < 5}
                  className="rounded-md bg-primary px-5 py-2.5 font-body text-sm font-semibold text-primary-foreground transition hover:brightness-110 disabled:opacity-40"
                >
                  Verificar
                </button>
              </form>

              {result && (
                <div className="mt-6 grid gap-4 rounded-lg bg-background/8 p-4 ring-1 ring-background/10 sm:grid-cols-2">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-wide text-background/60">Envío</div>
                    <div className="font-display text-xl font-bold tracking-tight">Disponible · 2–5 días</div>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-wide text-background/60">
                      Instalación
                    </div>
                    <div className="font-display text-xl font-bold tracking-tight">
                      {result.install ? "Certificada disponible" : "Solo equipo (sin instalación)"}
                    </div>
                  </div>
                  <p className="sm:col-span-2 font-mono text-[10px] uppercase tracking-wide text-background/40">
                    CP {cp} · confirmamos agenda por WhatsApp
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <WhatsAppFab message="Hola, quiero confirmar cobertura de instalación en mi código postal." />
    </>
  );
}
