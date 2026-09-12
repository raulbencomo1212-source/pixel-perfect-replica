import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, ShoppingCart, Snowflake, Wrench, Cpu, Calculator } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/lib/cart";

export function SiteHeader() {
  const { count, setOpen } = useCart();
  const [menu, setMenu] = useState(false);
  const close = () => setMenu(false);

  return (
    <>
      <div className="bg-navy px-4 py-2 text-center text-[12px] font-medium text-navy-foreground">
        ¡Hasta 12 Meses Sin Intereses! Envíos e instalación disponible en tu ciudad
      </div>
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
          <Sheet open={menu} onOpenChange={setMenu}>
            <SheetTrigger
              aria-label="Abrir menú"
              className="inline-flex size-10 items-center justify-center rounded-md border border-border text-foreground transition hover:bg-secondary"
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-[320px] overflow-y-auto p-0">
              <SheetHeader className="border-b border-border px-5 py-4">
                <SheetTitle className="font-display text-lg font-bold tracking-tight">Climas Max</SheetTitle>
              </SheetHeader>
              <nav className="px-5 py-4 text-sm">
                <div className="flex items-center gap-2 font-display text-base font-bold">
                  <Snowflake className="size-4 text-primary" /> Minisplits
                </div>
                <div className="mt-2 grid gap-1 pl-6">
                  <Link
                    to="/minisplits"
                    search={{ tech: "inverter" }}
                    onClick={close}
                    className="rounded-md px-2 py-2 font-medium text-emerald transition hover:bg-secondary"
                  >
                    Inverter · Hasta 60% ahorro
                  </Link>
                  <Link
                    to="/minisplits"
                    search={{ tech: "convencional" }}
                    onClick={close}
                    className="rounded-md px-2 py-2 font-medium text-primary transition hover:bg-secondary"
                  >
                    Convencional · Económico
                  </Link>
                  <Link
                    to="/minisplits"
                    search={{}}
                    onClick={close}
                    className="rounded-md px-2 py-2 text-muted-foreground transition hover:bg-secondary"
                  >
                    Ver todos los minisplits
                  </Link>
                </div>

                <div className="mt-5 flex items-center gap-2 font-display text-base font-bold">
                  <Cpu className="size-4 text-primary" /> Refacciones
                </div>
                <div className="mt-2 pl-6 text-muted-foreground">
                  <Link to="/refacciones" onClick={close} className="block rounded-md px-2 py-2 transition hover:bg-secondary">
                    Tarjetas, sensores, motores y capacitores
                  </Link>
                </div>

                <div className="mt-5 flex items-center gap-2 font-display text-base font-bold">
                  <Wrench className="size-4 text-primary" /> Herramientas
                </div>
                <div className="mt-2 pl-6 text-muted-foreground">
                  <Link to="/herramientas" onClick={close} className="block rounded-md px-2 py-2 transition hover:bg-secondary">
                    Bombas de vacío, manómetros y abocinadores
                  </Link>
                </div>

                <Link
                  to="/calculadora"
                  onClick={close}
                  className="mt-6 flex items-center gap-2 rounded-md bg-primary px-4 py-3 font-semibold text-primary-foreground"
                >
                  <Calculator className="size-4" /> ¿Cuál es mi clima ideal?
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          <Link to="/" className="font-display text-xl font-bold tracking-tight sm:text-2xl">
            Climas<span className="text-primary">Max</span>
          </Link>

          <button
            type="button"
            aria-label="Abrir carrito"
            onClick={() => setOpen(true)}
            className="relative inline-flex size-10 items-center justify-center rounded-md border border-border transition hover:bg-secondary"
          >
            <ShoppingCart className="size-5" />
            {count > 0 && (
              <span className="absolute -right-1.5 -top-1.5 grid min-w-5 place-items-center rounded-full bg-destructive px-1 text-[11px] font-bold text-destructive-foreground">
                {count}
              </span>
            )}
          </button>
        </div>
      </header>
    </>
  );
}
