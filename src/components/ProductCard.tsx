import { Link } from "@tanstack/react-router";
import { cuota12MSI, mxn, precioAntesFrom, priceFrom, type Badge, type Minisplit, type SimpleProduct } from "@/data/products";
import { useCart } from "@/lib/cart";

function BadgePill({ badge }: { badge: Badge }) {
  const styles: Record<Badge, string> = {
    "MÁS VENDIDO": "bg-amber text-amber-foreground",
    "OFERTA -30%": "bg-destructive text-destructive-foreground",
    "OFERTA": "bg-primary text-primary-foreground",
    "INVERTER AHORRO": "bg-emerald text-emerald-foreground",
  };
  return <span className={`rounded px-2 py-1 text-[10px] font-bold tracking-wide ${styles[badge]}`}>{badge}</span>;
}

export function MinisplitCard({ product }: { product: Minisplit }) {
  const desde = priceFrom(product);
  const antes = precioAntesFrom(product);
  const first = product.images[0]!;

  return (
    <Link
      to="/producto/$slug"
      params={{ slug: product.slug }}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative bg-secondary/40">
        <img
          src={first.src}
          alt={`${product.name} — minisplit ${product.tech}`}
          loading="lazy"
          width={1200}
          height={900}
          className="aspect-[4/3] w-full object-cover"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {product.badges.map((b) => (
            <BadgePill key={b} badge={b} />
          ))}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <span
          className={`w-fit rounded px-2 py-0.5 text-[11px] font-bold uppercase ${
            product.tech === "inverter" ? "bg-emerald/10 text-emerald" : "bg-primary/10 text-primary"
          }`}
        >
          {product.tech === "inverter" ? "Inverter" : "Convencional"}
        </span>
        <h3 className="mt-2 font-display text-base font-bold leading-tight">{product.name}</h3>
        <div className="mt-3">
          <div className="font-display text-xl font-extrabold leading-tight text-primary">
            Llévatelo a 12 MSI desde {mxn(cuota12MSI(desde))} / mes
          </div>
          <div className="mt-1 text-[13px] text-muted-foreground">
            o {antes && <span className="mr-1 line-through">{mxn(antes)}</span>}
            {mxn(desde)} de contado
          </div>
        </div>
        <div className="mt-4 rounded-md bg-secondary py-2 text-center text-[13px] font-semibold text-foreground transition group-hover:bg-primary group-hover:text-primary-foreground">
          Ver detalles y configurar
        </div>
      </div>
    </Link>
  );
}

export function SimpleCard({ product }: { product: SimpleProduct }) {
  const { add } = useCart();
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <img
        src={product.image}
        alt={product.name}
        loading="lazy"
        width={1200}
        height={900}
        className="aspect-[4/3] w-full object-cover"
      />
      <div className="flex flex-1 flex-col p-4">
        <span className="w-fit rounded bg-primary/10 px-2 py-0.5 text-[11px] font-bold uppercase text-primary">
          {product.subcategory}
        </span>
        <h3 className="mt-2 font-display text-base font-bold leading-tight">{product.name}</h3>
        <p className="mt-2 flex-1 text-[13px] text-muted-foreground">{product.description}</p>
        <div className="mt-3 font-display text-xl font-extrabold">{mxn(product.price)}</div>
        <div className="text-[12px] text-muted-foreground">o 12 MSI de {mxn(cuota12MSI(product.price))}</div>
        <button
          type="button"
          onClick={() =>
            add({
              key: product.slug,
              name: product.name,
              detalle: product.subcategory,
              price: product.price,
              image: product.image,
            })
          }
          className="mt-3 rounded-md bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          Agregar al Carrito
        </button>
      </div>
    </article>
  );
}
