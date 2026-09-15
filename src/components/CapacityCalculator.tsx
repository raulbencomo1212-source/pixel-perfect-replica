import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { BTU_BY_TONS, recomendar, type Zona } from "@/data/products";

const ZONAS: Zona[] = ["Templada", "Cálida", "Fría"];

export function CapacityCalculator() {
  const [m2, setM2] = useState(18);
  const [zona, setZona] = useState<Zona>("Cálida");
  const [personas, setPersonas] = useState(2);
  const [sol, setSol] = useState(false);

  const r = recomendar(m2, zona, personas, sol);

  return (
    <div className="grid gap-6 rounded-xl border border-border bg-card p-6 shadow-sm lg:grid-cols-[1.2fr_1fr]">
      <div className="grid gap-5">
        <div>
          <label htmlFor="m2" className="flex items-center justify-between text-sm font-semibold">
            Área del cuarto
            <span className="font-display text-base text-primary">{m2} m²</span>
          </label>
          <input
            id="m2"
            type="range"
            min={8}
            max={60}
            step={1}
            value={m2}
            onChange={(e) => setM2(Number(e.target.value))}
            className="mt-2 w-full accent-[var(--primary)]"
          />
        </div>

        <div>
          <span className="text-sm font-semibold">Zona climática</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {ZONAS.map((z) => (
              <button
                key={z}
                type="button"
                onClick={() => setZona(z)}
                className={
                  zona === z
                    ? "rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                    : "rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition hover:bg-secondary"
                }
              >
                {z}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="personas" className="flex items-center justify-between text-sm font-semibold">
            Personas en el espacio
            <span className="font-display text-base text-primary">{personas}</span>
          </label>
          <input
            id="personas"
            type="range"
            min={1}
            max={10}
            step={1}
            value={personas}
            onChange={(e) => setPersonas(Number(e.target.value))}
            className="mt-2 w-full accent-[var(--primary)]"
          />
        </div>

        <label className="flex cursor-pointer items-center gap-2 rounded-md bg-secondary p-3 text-sm">
          <input type="checkbox" checked={sol} onChange={(e) => setSol(e.target.checked)} className="size-4 accent-[var(--primary)]" />
          Sol directo en techo o ventanales grandes
        </label>
      </div>

      <div className="flex flex-col justify-center rounded-xl bg-navy p-6 text-navy-foreground">
        <div className="text-[12px] uppercase tracking-wide text-navy-foreground/60">Capacidad recomendada</div>
        <div className="mt-2 font-display text-4xl font-extrabold">{r.tons} Ton</div>
        <div className="mt-1 text-sm text-navy-foreground/80">
          {BTU_BY_TONS[r.tons].toLocaleString("es-MX")} BTU · tu cálculo estimado: {r.btu.toLocaleString("es-MX")} BTU
        </div>
        <Link
          to="/minisplits"
          search={{ tons: r.tons }}
          className="mt-5 rounded-md bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          Ver minisplits de {r.tons} Toneladas recomendados
        </Link>
      </div>
    </div>
  );
}
