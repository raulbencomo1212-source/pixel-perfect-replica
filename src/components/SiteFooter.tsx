import { Link } from "@tanstack/react-router";
import { Clock, Mail, Phone, ShieldCheck } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-navy text-navy-foreground">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="font-display text-xl font-bold">
            Climas<span className="text-primary">Max</span>
          </div>
          <p className="mt-3 text-sm text-navy-foreground/70">
            Venta de minisplits, refacciones y herramientas HVAC en México.
          </p>
        </div>
        <div className="text-sm">
          <div className="font-semibold">Contacto</div>
          <a href="tel:+528135630444" className="mt-3 flex items-center gap-2 text-navy-foreground/80 hover:text-navy-foreground">
            <Phone className="size-4" /> 81 3563 0444
          </a>
          <a href="mailto:ventas@climasmax.mx" className="mt-2 flex items-center gap-2 text-navy-foreground/80 hover:text-navy-foreground">
            <Mail className="size-4" /> ventas@climasmax.mx
          </a>
          <div className="mt-2 flex items-center gap-2 text-navy-foreground/80">
            <Clock className="size-4" /> Lun a Sáb, 9:00 a 19:00 h
          </div>
        </div>
        <div className="text-sm">
          <div className="font-semibold">Catálogo</div>
          <div className="mt-3 grid gap-2 text-navy-foreground/80">
            <Link to="/minisplits" search={{ tech: "inverter" }} className="hover:text-navy-foreground">
              Minisplits Inverter
            </Link>
            <Link to="/minisplits" search={{ tech: "convencional" }} className="hover:text-navy-foreground">
              Minisplits Convencionales
            </Link>
            <Link to="/refacciones" className="hover:text-navy-foreground">
              Refacciones
            </Link>
            <Link to="/herramientas" className="hover:text-navy-foreground">
              Herramientas
            </Link>
            <Link to="/calculadora" className="hover:text-navy-foreground">
              ¿Cuál es mi clima ideal?
            </Link>
          </div>
        </div>
        <div className="text-sm">
          <div className="font-semibold">Pago seguro</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {["VISA", "Mastercard", "AMEX", "12 MSI"].map((b) => (
              <span key={b} className="rounded-md bg-navy-foreground/10 px-3 py-1.5 text-[12px] font-semibold">
                {b}
              </span>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 text-[12px] text-navy-foreground/70">
            <ShieldCheck className="size-4" /> Compra protegida y garantía de fábrica
          </div>
        </div>
      </div>
      <div className="border-t border-navy-foreground/10 px-4 py-5 text-center text-[12px] text-navy-foreground/60">
        © {new Date().getFullYear()} Climas Max. Precios en pesos mexicanos (MXN).
      </div>
    </footer>
  );
}
