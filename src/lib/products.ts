export type Tech = "Inverter" | "Convencional";
export type Voltage = "110V" | "220V";
export type Mode = "Solo Frío" | "Frío/Calor";
export type Tonnage = 1 | 1.5 | 2 | 3;

export const TONNAGES: { tons: Tonnage; btu: number; use: string; area: string; from: number }[] = [
  { tons: 1, btu: 12000, use: "Recámaras, escritorios", area: "10–15 m²", from: 11999 },
  { tons: 1.5, btu: 18000, use: "Salas, suites", area: "15–25 m²", from: 15499 },
  { tons: 2, btu: 24000, use: "Sala-comedor, lofts", area: "25–40 m²", from: 21999 },
  { tons: 3, btu: 36000, use: "Zonas abiertas, oficinas", area: "40–60 m²", from: 30999 },
];

export type Variant = {
  tech: Tech;
  tons: Tonnage;
  voltage: Voltage;
  mode: Mode;
  price: number;
  stock: "En stock" | "Sobre pedido" | "Agotado";
  refrigerant: "R32" | "R410A";
  seer: number;
  noiseDb: number;
  kwh: number;
  warrantyYears: number;
};

export type Product = {
  slug: string;
  name: string;
  brand: string;
  tagline: string;
  variants: Variant[];
};

function buildVariants(base: number, tech: Tech): Variant[] {
  const out: Variant[] = [];
  const tonList: Tonnage[] = [1, 1.5, 2, 3];
  const volts: Voltage[] = ["110V", "220V"];
  const modes: Mode[] = ["Solo Frío", "Frío/Calor"];
  for (const tons of tonList) {
    for (const voltage of volts) {
      for (const mode of modes) {
        if (tons >= 2 && voltage === "110V") continue;
        const tonFactor = { 1: 1, 1.5: 1.28, 2: 1.72, 3: 2.35 }[tons];
        const price = Math.round(
          (base * tonFactor + (mode === "Frío/Calor" ? 1400 : 0) + (voltage === "220V" ? 400 : 0)) / 10,
        ) * 10;
        out.push({
          tech,
          tons,
          voltage,
          mode,
          price,
          stock: tons === 3 && mode === "Frío/Calor" ? "Sobre pedido" : "En stock",
          refrigerant: tech === "Inverter" ? "R32" : "R410A",
          seer: tech === "Inverter" ? (tons <= 1.5 ? 21 : 18.5) : 13,
          noiseDb: tech === "Inverter" ? (tons <= 1.5 ? 19 : 24) : 32,
          kwh: Number(((tons * (tech === "Inverter" ? 0.78 : 1.15)) as number).toFixed(2)),
          warrantyYears: tech === "Inverter" ? 10 : 5,
        });
      }
    }
  }
  return out;
}

export const PRODUCTS: Product[] = [
  {
    slug: "norteclima-inverter-pro",
    name: "NorteClima Inverter Pro",
    brand: "NorteClima",
    tagline:
      "Compresor inverter de alto rendimiento, refrigerante R32 de baja huella, modo silencioso y control WiFi integrado.",
    variants: buildVariants(11999, "Inverter"),
  },
  {
    slug: "norteclima-inverter-eco",
    name: "NorteClima Inverter Eco",
    brand: "NorteClima",
    tagline: "Inverter de entrada con SEER alto y arranque suave, pensado para recámaras y departamentos.",
    variants: buildVariants(10499, "Inverter"),
  },
  {
    slug: "norteclima-classic",
    name: "NorteClima Classic On/Off",
    brand: "NorteClima",
    tagline: "Equipo convencional fix speed, costo accesible y refacciones disponibles en todo México.",
    variants: buildVariants(8299, "Convencional"),
  },
  {
    slug: "norteclima-classic-plus",
    name: "NorteClima Classic Plus",
    brand: "NorteClima",
    tagline: "Convencional reforzado para clima extremo, serpentín con recubrimiento anticorrosivo.",
    variants: buildVariants(9299, "Convencional"),
  },
];

export const mxn = (n: number) =>
  n.toLocaleString("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });

export type Zone = "Templada" | "Semiárida" | "Árida";
export type Sun = "Baja" | "Media" | "Alta";

export function recommend(m2: number, zone: Zone, sun: Sun) {
  const zoneFactor = { Templada: 1, Semiárida: 1.12, Árida: 1.25 }[zone];
  const sunFactor = { Baja: 1, Media: 1.08, Alta: 1.18 }[sun];
  const btuRaw = m2 * 600 * zoneFactor * sunFactor;
  const fallback = { tons: 3 as Tonnage, btu: 36000, use: "Zonas abiertas, oficinas", area: "40–60 m²", from: 30999 };
  const match = TONNAGES.find((t) => t.btu >= btuRaw) ?? fallback;
  return { ...match, factor: Number((zoneFactor * sunFactor).toFixed(2)) };
}

export function priceFor(p: Product, tons: Tonnage, voltage: Voltage, mode: Mode) {
  return p.variants.find((v) => v.tons === tons && v.voltage === voltage && v.mode === mode);
}
