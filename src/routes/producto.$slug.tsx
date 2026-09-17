import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Info, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { CartDrawer } from "@/components/CartDrawer";
import { useCart } from "@/lib/cart";
import {
  BTU_BY_TONS,
  MODES,
  TONS_LIST,
  VOLTAGES,
  cuota12MSI,
  getMinisplit,
  getPrice,
  precioAntes,
  isVoltageAvailable,
  mxn,
  priceFrom,
  type ModeKey,
  type Tons,
  type Voltage,
} from "@/data/products";

export const Route = createFileRoute("/producto/$slug")({
  loader: ({ params }) => {
    const product = getMinisplit(params.slug);
    if (!product) throw notFound();
    return { name: product.name, tech: product.tech, desde: priceFrom(product) };
  },
  head: ({ loaderData }) => {
    const name = loaderData?.name ?? "Minisplit";
    const desc = `${name}: configura capacidad, voltaje y modo. Desde ${
      loaderData ? mxn(loaderData.desde) : ""
    } de contado o 12 meses sin intereses.`;
    return {
      meta: [
        { title: `${name} — precio y 12 MSI | Climas Max` },
        { name: "description", content: desc },
        { property: "og:title", content: `${name} | Climas Max` },
        { property: "og:description", content: desc },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ProductoPage,
});

function ProductoPage() {
  const { slug } = Route.useParams();
  const product = getMinisplit(slug)!;
  const { add } = useCart();

  const [tons, setTons] = useState<Tons>("1.0");
  const [voltage, setVoltage] = useState<Voltage>("110V");
  const [mode, setMode] = useState<ModeKey>("frio");
  const [qty, setQty] = useState(1);
  const [img, setImg] = useState(0);

  const selectTons = (t: Tons) => {
    setTons(t);
    if (!isVoltageAvailable(t, voltage)) setVoltage("220V");
  };

  const price = getPrice(product, tons, voltage, mode) ?? priceFrom(product);
  const antes = precioAntes(product, tons, voltage, mode);
  const modeLabel = MODES.find((m) => m.key === mode)!.label;
  const detalle = `${tons} Ton · ${voltage} · ${modeLabel}`;
  const hero = product.images[img] ?? product.images[0]!;

  return (
    <>
      <SiteHeader />
      <CartDrawer />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <img
              src={hero.src}
              alt={`${product.name} — ${hero.label}`}
              width={1200}
              height={900}
              className="aspect-[4/3] w-full rounded-xl border border-border object-cover"
            />
            <div className="mt-3 grid grid-cols-3 gap-3">
              {product.images.map((im, idx) => (
                <button
                  key={im.label}
                  type="button"
                  onClick={() => setImg(idx)}
                  className={`overflow-hidden rounded-lg border-2 transition ${
                    idx === img ? "border-primary" : "border-border hover:border-primary/40"
                  }`}
                >
                  <img src={im.src} alt={im.label} loading="lazy" width={1200} height={900} className="aspect-[4/3] w-full object-cover" />
                  <span className="block bg-secondary py-1 text-[11px] font-medium">{im.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">{product.brand}</div>
            <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight">{product.name}</h1>
            <div className="mt-3 flex flex-wrap gap-2">
              <span
                className={`rounded px-2.5 py-1 text-[11px] font-bold uppercase ${
                  product.tech === "inverter" ? "bg-emerald text-emerald-foreground" : "bg-primary text-primary-foreground"
                }`}
              >
                {product.tech === "inverter" ? "Inverter · Ahorro de energía" : "Convencional"}
              </span>
              <span className="rounded bg-secondary px-2.5 py-1 text-[11px] font-bold uppercase">SEER {product.specs.seer}</span>
            </div>

            <div className="mt-6 grid gap-5">
              <div>
                <div className="text-sm font-semibold">Capacidad</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {TONS_LIST.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => selectTons(t)}
                      className={
                        tons === t
                          ? "rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
                          : "rounded-lg border border-border px-4 py-2.5 text-sm transition hover:bg-secondary"
                      }
                    >
                      {t} Ton ({BTU_BY_TONS[t].toLocaleString("es-MX")} BTU)
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold">Voltaje</div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {VOLTAGES.map((v) => {
                    const disabled = !isVoltageAvailable(tons, v);
                    return (
                      <button
                        key={v}
                        type="button"
                        disabled={disabled}
                        title={disabled ? "Solo disponible en 220V" : undefined}
                        onClick={() => setVoltage(v)}
                        className={
                          disabled
                            ? "cursor-not-allowed rounded-lg border border-border px-4 py-2.5 text-sm text-muted-foreground/50 line-through"
                            : voltage === v
                              ? "rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
                              : "rounded-lg border border-border px-4 py-2.5 text-sm transition hover:bg-secondary"
                        }
                      >
                        {v}
                      </button>
                    );
                  })}
                  {!isVoltageAvailable(tons, "110V") && (
                    <span className="rounded bg-amber/20 px-2.5 py-1 text-[11px] font-semibold text-amber-foreground">
                      Solo disponible en 220V
                    </span>
                  )}
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold">Modo</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {MODES.map((m) => (
                    <button
                      key={m.key}
                      type="button"
                      onClick={() => setMode(m.key)}
                      className={
                        mode === m.key
                          ? "rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
                          : "rounded-lg border border-border px-4 py-2.5 text-sm transition hover:bg-secondary"
                      }
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-border bg-secondary/50 p-5">
              <div className="flex flex-wrap items-baseline gap-3">
                {antes && (
                  <span className="text-lg font-semibold text-muted-foreground line-through">{mxn(antes)}</span>
                )}
                <div className="font-display text-4xl font-extrabold tracking-tight">{mxn(price)} MXN</div>
              </div>
              <div className="mt-2 rounded-lg bg-emerald/10 px-4 py-3 font-semibold text-emerald">
                12 mensualidades de {mxn(cuota12MSI(price))} a Meses Sin Intereses
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <div className="flex items-center rounded-lg border border-border bg-background">
                  <button type="button" aria-label="Menos" onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2.5">
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-semibold">{qty}</span>
                  <button type="button" aria-label="Más" onClick={() => setQty(qty + 1)} className="px-3 py-2.5">
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    add(
                      {
                        key: `${product.slug}-${tons}-${voltage}-${mode}`,
                        name: product.name,
                        detalle,
                        price,
                        image: product.images[0]!.src,
                      },
                      qty,
                    )
                  }
                  className="flex-1 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
                >
                  Agregar al Carrito
                </button>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-2 rounded-lg bg-amber/15 p-4 text-sm font-medium">
              <Info className="mt-0.5 size-5 shrink-0 text-amber-foreground" />
              No incluye instalación: te recomendamos contratar a un técnico certificado en tu zona.
            </div>
          </div>
        </div>

        <section className="mt-14 grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-xl font-bold">Descripción</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{product.description}</p>
            <ul className="mt-4 grid gap-2 text-sm">
              {[
                "Envío disponible en tu ciudad",
                "Garantía directa de fábrica",
                "Asesoría técnica por WhatsApp antes y después de tu compra",
              ].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check className="size-4 text-emerald" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-xl font-bold">Especificaciones técnicas</h2>
            <dl className="mt-3 overflow-hidden rounded-xl border border-border text-sm">
              {[
                ["Capacidad seleccionada", `${tons} Ton · ${BTU_BY_TONS[tons].toLocaleString("es-MX")} BTU`],
                ["Voltaje", voltage],
                ["Modo", modeLabel],
                ["Refrigerante", product.specs.refrigerante],
                ["Nivel de ruido", product.specs.ruido],
                ["Eficiencia SEER", product.specs.seer],
                ["Garantía de fábrica", product.specs.garantia],
              ].map(([k, v], i) => (
                <div key={k} className={`flex justify-between gap-4 px-4 py-3 ${i % 2 ? "bg-secondary/50" : ""}`}>
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="text-right font-medium">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 flex items-center gap-2 text-[13px] text-muted-foreground">
              <ShieldCheck className="size-4 text-primary" /> Producto nuevo con factura y garantía.
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <WhatsAppFab />
    </>
  );
}
