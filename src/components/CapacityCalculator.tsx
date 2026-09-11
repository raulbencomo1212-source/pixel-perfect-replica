import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { recommend, type Sun, type Zone } from "@/lib/products";

const ZONES: Zone[] = ["Templada", "Semiárida", "Árida"];
const SUNS: Sun[] = ["Baja", "Media", "Alta"];

export function CapacityCalculator() {
  const [m2, setM2] = useState(28);
  const [zone, setZone] = useState<Zone>("Semiárida");
  const [sun, setSun] = useState<Sun>("Media");

  const result = useMemo(() => recommend(m2 || 0, zone, sun), [m2, zone, sun]);

  return (
    <div
      className="animate-rise rounded-xl bg-foreground p-6 text-background ring-1 ring-black/5 md:p-8"
      style={{ animationDelay: "80ms" }}
    >
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-xl font-bold tracking-tight">Calculadora de capacidad</h2>
        <span className="font-mono text-[10px] uppercase tracking-wide text-background/50">
          (a) Dimensiona tu equipo
        </span>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-wide text-background/60">
            Metros cuadrados
          </span>
          <input
            type="number"
            min={5}
            max={120}
            value={m2}
            onChange={(e) => setM2(Number(e.target.value))}
            className="mt-2 w-full rounded-md border-0 bg-background/10 px-3 py-2.5 font-display text-lg font-semibold text-background outline-none ring-1 ring-background/15 focus:ring-primary"
          />
        </label>
        <div className="block">
          <span className="font-mono text-[10px] uppercase tracking-wide text-background/60">
            Zona climática
          </span>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {ZONES.map((z) => (
              <button
                key={z}
                type="button"
                onClick={() => setZone(z)}
                className={
                  zone === z
                    ? "rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
                    : "rounded-md px-3 py-2 text-xs text-background/70 ring-1 ring-background/15"
                }
              >
                {z}
              </button>
            ))}
          </div>
        </div>
        <div className="block">
          <span className="font-mono text-[10px] uppercase tracking-wide text-background/60">Sol directo</span>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {SUNS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSun(s)}
                className={
                  sun === s
                    ? "rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
                    : "rounded-md px-3 py-2 text-xs text-background/70 ring-1 ring-background/15"
                }
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 items-center gap-4 rounded-lg bg-background/8 p-4 ring-1 ring-background/10">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-wide text-background/60">Recomendado</div>
          <div className="font-display text-3xl font-bold tracking-tight">
            {result.tons} <span className="text-lg text-background/60">ton</span>
          </div>
        </div>
        <div className="mx-auto h-9 w-px bg-background/15" />
        <div>
          <div className="font-mono text-[10px] uppercase tracking-wide text-background/60">Capacidad</div>
          <div className="font-display text-2xl font-bold tracking-tight">
            {result.btu.toLocaleString("es-MX")} <span className="text-sm text-background/60">BTU/h</span>
          </div>
        </div>
        <Link
          to="/catalogo"
          search={{ tons: result.tons }}
          className="col-span-3 mt-1 rounded-md bg-primary py-2.5 text-center font-body text-sm font-semibold text-primary-foreground transition hover:brightness-110"
        >
          Ver equipos {result.tons} ton
        </Link>
        <p className="col-span-3 font-mono text-[10px] uppercase tracking-wide text-background/40">
          Factor aplicado {result.factor} · {m2 || 0} m² · cobertura {result.area}
        </p>
      </div>
    </div>
  );
}
