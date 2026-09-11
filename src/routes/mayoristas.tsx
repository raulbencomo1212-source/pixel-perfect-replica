import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { TONNAGES } from "@/lib/products";

export const Route = createFileRoute("/mayoristas")({
  head: () => ({
    meta: [
      { title: "Cotización especial para mayoristas de minisplits | NorteClima" },
      {
        name: "description",
        content:
          "Solicita precio por volumen en minisplits Inverter y convencionales. Cotización para obras, hoteles y distribuidores en México.",
      },
      { property: "og:title", content: "Cotización mayorista de minisplits | NorteClima" },
      {
        property: "og:description",
        content: "Precio por volumen desde 5 unidades, con instalación certificada opcional.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Mayoristas,
});

function Mayoristas() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-5">
        <section className="grid gap-8 py-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-primary">Mayoreo</p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight text-balance">
              Cotización por volumen, <span className="text-primary">desde 5 unidades.</span>
            </h1>
            <p className="mt-5 max-w-[46ch] font-body text-base text-muted-foreground text-pretty">
              Obras, hoteles, oficinas y distribuidores. Respondemos con lista de precios, tiempos de entrega y
              esquema de instalación en menos de 24 horas hábiles.
            </p>
            <div className="mt-8 grid grid-cols-3 divide-x divide-border rounded-md ring-1 ring-border">
              <div className="px-4 py-3">
                <div className="font-display text-2xl font-bold tracking-tight">5+</div>
                <div className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">Unidades</div>
              </div>
              <div className="px-4 py-3">
                <div className="font-display text-2xl font-bold tracking-tight">24 h</div>
                <div className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">Respuesta</div>
              </div>
              <div className="px-4 py-3">
                <div className="font-display text-2xl font-bold tracking-tight">Factura</div>
                <div className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">CFDI 4.0</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="rounded-xl bg-foreground p-6 text-background ring-1 ring-black/5 md:p-8"
            >
              <div className="flex items-baseline justify-between">
                <h2 className="font-display text-xl font-bold tracking-tight">Solicitar cotización</h2>
                <span className="font-mono text-[10px] uppercase tracking-wide text-background/50">
                  (a) Datos del proyecto
                </span>
              </div>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <Field label="Nombre o razón social" name="nombre" />
                <Field label="Correo" name="correo" type="email" />
                <Field label="Teléfono / WhatsApp" name="tel" />
                <Field label="Código postal de entrega" name="cp" />
                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-wide text-background/60">
                    Tonelaje principal
                  </span>
                  <select className="mt-2 w-full rounded-md border-0 bg-background/10 px-3 py-2.5 font-body text-sm text-background outline-none ring-1 ring-background/15">
                    {TONNAGES.map((t) => (
                      <option key={t.tons} className="text-foreground">
                        {t.tons} ton · {t.btu.toLocaleString("es-MX")} BTU
                      </option>
                    ))}
                  </select>
                </label>
                <Field label="Número de unidades" name="unidades" type="number" defaultValue="10" />
              </div>
              <label className="mt-5 block">
                <span className="font-mono text-[10px] uppercase tracking-wide text-background/60">
                  Detalles del proyecto
                </span>
                <textarea
                  rows={4}
                  className="mt-2 w-full rounded-md border-0 bg-background/10 px-3 py-2.5 font-body text-sm text-background outline-none ring-1 ring-background/15 focus:ring-primary"
                  placeholder="Ej. 12 recámaras de hotel, 220V, requiere instalación."
                />
              </label>
              <label className="mt-4 flex items-center gap-2.5 font-body text-sm text-background/80">
                <input type="checkbox" defaultChecked className="size-4 accent-[oklch(0.55_0.13_243)]" />
                Incluir instalación certificada en la cotización
              </label>
              <button
                type="submit"
                className="mt-6 w-full rounded-md bg-primary py-3 font-body text-sm font-semibold text-primary-foreground transition hover:brightness-110"
              >
                {sent ? "Solicitud registrada ✓" : "Enviar solicitud"}
              </button>
              {sent && (
                <p className="mt-3 font-mono text-[10px] uppercase tracking-wide text-background/50">
                  Demo: la solicitud aún no se envía a nadie. Conecta un backend para recibirla.
                </p>
              )}
            </form>
          </div>
        </section>
      </main>
      <SiteFooter />
      <WhatsAppFab message="Hola, necesito una cotización de mayoreo de minisplits." />
    </>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-wide text-background/60">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required
        className="mt-2 w-full rounded-md border-0 bg-background/10 px-3 py-2.5 font-body text-sm text-background outline-none ring-1 ring-background/15 focus:ring-primary"
      />
    </label>
  );
}
