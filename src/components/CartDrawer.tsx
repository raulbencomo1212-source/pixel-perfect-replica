import { Minus, Plus, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/lib/cart";
import { cuota12MSI, mxn } from "@/data/products";

export function CartDrawer() {
  const cart = useCart();

  return (
    <Sheet open={cart.open} onOpenChange={cart.setOpen}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border px-5 py-4">
          <SheetTitle className="font-display text-lg font-bold">Tu carrito ({cart.count})</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {cart.items.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              Aún no agregas productos. Explora los minisplits más vendidos.
            </p>
          ) : (
            <ul className="grid gap-4">
              {cart.items.map((i) => (
                <li key={i.key} className="flex gap-3 rounded-lg border border-border p-3">
                  <img src={i.image} alt={i.name} loading="lazy" width={120} height={90} className="size-16 rounded-md object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold leading-tight">{i.name}</div>
                    {i.detalle && <div className="mt-0.5 text-[12px] text-muted-foreground">{i.detalle}</div>}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          aria-label="Quitar uno"
                          onClick={() => cart.setQty(i.key, i.qty - 1)}
                          className="grid size-7 place-items-center rounded border border-border hover:bg-secondary"
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold">{i.qty}</span>
                        <button
                          type="button"
                          aria-label="Agregar uno"
                          onClick={() => cart.setQty(i.key, i.qty + 1)}
                          className="grid size-7 place-items-center rounded border border-border hover:bg-secondary"
                        >
                          <Plus className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          aria-label="Eliminar producto"
                          onClick={() => cart.remove(i.key)}
                          className="ml-1 grid size-7 place-items-center rounded text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                      <span className="font-display text-sm font-bold">{mxn(i.price * i.qty)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cart.items.length > 0 && (
          <div className="border-t border-border px-5 py-4">
            <dl className="mt-4 grid gap-1 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <dt>Subtotal productos</dt>
                <dd>{mxn(cart.subtotal)}</dd>
              </div>
              <div className="mt-1 flex justify-between font-display text-lg font-bold">
                <dt>Total de contado</dt>
                <dd>{mxn(cart.total)}</dd>
              </div>
              <div className="flex justify-between rounded-md bg-emerald/10 px-3 py-2 text-[13px] font-semibold text-emerald">
                <dt>12 Meses Sin Intereses</dt>
                <dd>12 x {mxn(cuota12MSI(cart.total))}</dd>
              </div>
            </dl>

            <a
              href={cart.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 block rounded-md bg-emerald px-4 py-3 text-center font-semibold text-emerald-foreground transition hover:opacity-90"
            >
              Finalizar Pedido vía WhatsApp
            </a>
            <button
              type="button"
              onClick={cart.clear}
              className="mt-2 w-full rounded-md px-4 py-2 text-[12px] text-muted-foreground hover:text-destructive"
            >
              Vaciar carrito
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
