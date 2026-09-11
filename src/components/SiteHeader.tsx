import { Link } from "@tanstack/react-router";

const NAV = [
  { label: "Inicio", to: "/" },
  { label: "Minisplits Inverter", to: "/catalogo", search: { tech: "Inverter" } },
  { label: "Convencionales", to: "/catalogo", search: { tech: "Convencional" } },
  { label: "Frío/Calor", to: "/catalogo", search: { mode: "Frío/Calor" } },
  { label: "Solo Frío", to: "/catalogo", search: { mode: "Solo Frío" } },
  { label: "Cotización Mayorista", to: "/mayoristas" },
  { label: "Instalación", to: "/instalacion" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold tracking-tight">
          NORTE<span className="text-primary">CLIMA</span>
        </Link>
        <nav className="hidden items-center gap-6 font-mono text-[11px] uppercase tracking-wide text-muted-foreground lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              search={"search" in item ? (item.search as never) : undefined}
              activeProps={{ className: "text-foreground" }}
              className="transition hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          to="/mayoristas"
          className="rounded-md bg-foreground px-4 py-2 font-mono text-[11px] font-medium uppercase tracking-wide text-background ring-1 ring-black/5"
        >
          Cotizar
        </Link>
      </div>
    </header>
  );
}
