import evaporador from "@/assets/minisplit-evaporador.jpg";
import inverterxEvap1 from "@/assets/inverterx-evaporador-1.png";
import inverterxCondensador from "@/assets/inverterx-condensador.jpg";
import inverterxEvap2 from "@/assets/inverterx-evaporador-2.png";
import inverterxKit from "@/assets/inverterx-kit-control.jpg";
import condensador from "@/assets/minisplit-condensador.jpg";
import control from "@/assets/minisplit-control.jpg";
import refaccionesImg from "@/assets/refacciones.jpg";
import herramientasImg from "@/assets/herramientas.jpg";

export const WHATSAPP_NUMBER = "528135630444";
export const MSI_FEE_RATE = 0.135;

export const cuota12MSI = (precioContado: number) =>
  Math.round((precioContado * (1 + MSI_FEE_RATE)) / 12);

export const mxn = (n: number) =>
  n.toLocaleString("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });

export type Tech = "inverter" | "convencional";
export type Tons = "1.0" | "1.5" | "2.0";
export type Voltage = "110V" | "220V";
export type ModeKey = "frio" | "friocalor";

export const TONS_LIST: Tons[] = ["1.0", "1.5", "2.0"];
export const VOLTAGES: Voltage[] = ["110V", "220V"];
export const MODES: { key: ModeKey; label: string }[] = [
  { key: "frio", label: "Solo Frío" },
  { key: "friocalor", label: "Frío y Calor" },
];

export const BTU_BY_TONS: Record<Tons, number> = { "1.0": 12000, "1.5": 18000, "2.0": 24000 };

export type Badge = "MÁS VENDIDO" | "OFERTA -30%" | "INVERTER AHORRO";

export type Minisplit = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  tech: Tech;
  description: string;
  images: { src: string; label: string }[];
  badges: Badge[];
  specs: { refrigerante: string; ruido: string; seer: string; garantia: string };
  /** clave: `${tons}-${voltage}-${mode}` */
  precios: Record<string, number>;
};

export const priceKey = (tons: Tons, voltage: Voltage, mode: ModeKey) => `${tons}-${voltage}-${mode}`;

/** 110V solo existe en 1.0 Ton (regla de negocio). */
export const isVoltageAvailable = (tons: Tons, voltage: Voltage) =>
  voltage === "220V" || tons === "1.0";

export function getPrice(p: Minisplit, tons: Tons, voltage: Voltage, mode: ModeKey): number | undefined {
  return p.precios[priceKey(tons, voltage, mode)];
}

export function priceFrom(p: Minisplit): number {
  return Math.min(...Object.values(p.precios));
}

const gallery = (): { src: string; label: string }[] => [
  { src: evaporador, label: "Evaporador" },
  { src: condensador, label: "Condensador exterior" },
  { src: control, label: "Control remoto" },
];

/**
 * Costo de envio por tonelada (guia o guias combinadas de condensador + evaporador),
 * ya redondeado hacia arriba a partir de cotizaciones reales a un destino lejano
 * (Monterrey -> Guerrero, via Estafeta/Enviatodo):
 *  - 1.0 Ton: $392.40 real -> $400
 *  - 1.5 Ton: $451.91 real -> $500
 *  - 2.0 Ton: $673.09 real (2 guias) -> $700
 * Este costo ya viene sumado dentro del precio mostrado (no se desglosa aparte en el carrito).
 */
export const SHIPPING_BY_TONS: Record<Tons, number> = { "1.0": 400, "1.5": 500, "2.0": 700 };

/** Redondea hacia arriba al siguiente precio terminado en 999 (ej. 12,700 -> 12,999). */
function redondearA999(n: number): number {
  return Math.ceil((n + 1) / 1000) * 1000 - 1;
}

function matrix(base: number): Record<string, number> {
  const tonFactor: Record<Tons, number> = { "1.0": 1, "1.5": 1.42, "2.0": 1.86 };
  const out: Record<string, number> = {};
  for (const tons of TONS_LIST) {
    for (const voltage of VOLTAGES) {
      if (!isVoltageAvailable(tons, voltage)) continue;
      for (const m of MODES) {
        const precioBase =
          Math.round(
            (base * tonFactor[tons] + (m.key === "friocalor" ? 1400 : 0) + (voltage === "220V" ? 350 : 0)) / 10,
          ) * 10;
        const envio = SHIPPING_BY_TONS[tons];
        const precioConEnvio = precioBase + envio;
        // Solo se redondea a "...999" cuando el envio es de $500 o mas (1.5 y 2.0 Ton).
        const price = envio >= 500 ? redondearA999(precioConEnvio) : precioConEnvio;
        out[priceKey(tons, voltage, m.key)] = price;
      }
    }
  }
  return out;
}

export const MINISPLITS: Minisplit[] = [
  {
    id: "xr32",
    slug: "mirage-xr32-inverter",
    name: "Mirage XR32 Inverter",
    brand: "Mirage",
    tech: "inverter",
    description:
      "Minisplit Inverter con refrigerante ecológico R32, compresor de velocidad variable y hasta 60% de ahorro de energía frente a un equipo convencional. Operación silenciosa y control WiFi opcional.",
    images: [
      { src: inverterxEvap1, label: "Evaporador" },
      { src: inverterxCondensador, label: "Condensador exterior" },
      { src: inverterxEvap2, label: "Vista frontal" },
      { src: inverterxKit, label: "Kit completo con control" },
    ],
    badges: ["MÁS VENDIDO", "INVERTER AHORRO"],
    specs: { refrigerante: "R32", ruido: "19 dB", seer: "21.0", garantia: "10 años en compresor, 3 años en partes" },
    precios: matrix(8990),
  },
  {
    id: "magnum22",
    slug: "mirage-magnum-22",
    name: "Mirage Magnum 22",
    brand: "Mirage",
    tech: "inverter",
    description:
      "Inverter reforzado para clima extremo: enfría con hasta 48 °C exteriores, serpentín con recubrimiento anticorrosivo y arranque suave que protege tu instalación eléctrica.",
    images: gallery(),
    badges: ["INVERTER AHORRO"],
    specs: { refrigerante: "R32", ruido: "22 dB", seer: "19.5", garantia: "10 años en compresor, 3 años en partes" },
    precios: matrix(9790),
  },
  {
    id: "life12",
    slug: "mirage-life-12-plus",
    name: "Mirage Life 12+",
    brand: "Mirage",
    tech: "convencional",
    description:
      "Equipo convencional fix speed, la opción más accesible para recámaras y oficinas pequeñas. Refacciones disponibles en todo México.",
    images: gallery(),
    badges: ["OFERTA -30%"],
    specs: { refrigerante: "R410A", ruido: "32 dB", seer: "13.0", garantia: "5 años en compresor, 1 año en partes" },
    precios: matrix(6490),
  },
  {
    id: "x5",
    slug: "mirage-x5",
    name: "Mirage X5",
    brand: "Mirage",
    tech: "convencional",
    description:
      "Convencional de alto flujo de aire para salas y locales comerciales. Filtro lavable antibacterial y gabinete reforzado.",
    images: gallery(),
    badges: ["MÁS VENDIDO"],
    specs: { refrigerante: "R410A", ruido: "35 dB", seer: "13.5", garantia: "5 años en compresor, 1 año en partes" },
    precios: matrix(7190),
  },
];

export type SimpleProduct = {
  id: string;
  slug: string;
  name: string;
  category: "refaccion" | "herramienta";
  subcategory: string;
  description: string;
  image: string;
  price: number;
};

export const REFACCIONES: SimpleProduct[] = [
  {
    id: "r1",
    slug: "tarjeta-electronica-universal",
    name: "Tarjeta electrónica universal para minisplit",
    category: "refaccion",
    subcategory: "Tarjetas",
    description: "Tarjeta de control universal compatible con equipos de 1 a 2 toneladas, incluye control remoto y sensores.",
    image: refaccionesImg,
    price: 1290,
  },
  {
    id: "r2",
    slug: "sensor-temperatura-ntc",
    name: "Kit de sensores NTC (juego de 3)",
    category: "refaccion",
    subcategory: "Sensores",
    description: "Sensores de temperatura ambiente y de serpentín, 10K ohm, con conector rápido.",
    image: refaccionesImg,
    price: 349,
  },
  {
    id: "r3",
    slug: "motor-ventilador-evaporador",
    name: "Motor ventilador de evaporador 30W",
    category: "refaccion",
    subcategory: "Motores",
    description: "Motor de ventilador para unidad interior, 220V, eje de 8 mm. Compatible con la mayoría de marcas.",
    image: refaccionesImg,
    price: 1690,
  },
  {
    id: "r4",
    slug: "capacitor-35-5-uf",
    name: "Capacitor de marcha 35+5 µF",
    category: "refaccion",
    subcategory: "Capacitores",
    description: "Capacitor dual para compresor y ventilador de condensador, 370/440 VAC.",
    image: refaccionesImg,
    price: 289,
  },
];

export const HERRAMIENTAS: SimpleProduct[] = [
  {
    id: "h1",
    slug: "bomba-de-vacio-3cfm",
    name: "Bomba de vacío 3 CFM una etapa",
    category: "herramienta",
    subcategory: "Bombas de vacío",
    description: "Bomba de vacío 1/4 HP, 3 CFM, ideal para instalación y mantenimiento de minisplits residenciales.",
    image: herramientasImg,
    price: 2790,
  },
  {
    id: "h2",
    slug: "manometros-r32-r410a",
    name: "Juego de manómetros R32 / R410A",
    category: "herramienta",
    subcategory: "Manómetros",
    description: "Manifold de dos vías con mangueras de 1.5 m y conexiones 5/16 para refrigerantes de alta presión.",
    image: herramientasImg,
    price: 1590,
  },
  {
    id: "h3",
    slug: "abocinador-excentrico",
    name: "Abocinador excéntrico profesional",
    category: "herramienta",
    subcategory: "Abocinadores",
    description: "Kit abocinador con trinquete, cortatubos y escariador, para tubería de 1/4 a 3/4.",
    image: herramientasImg,
    price: 1190,
  },
  {
    id: "h4",
    slug: "pinza-amperimetrica",
    name: "Pinza amperimétrica digital HVAC",
    category: "herramienta",
    subcategory: "Medición",
    description: "Medición de corriente, voltaje, capacitancia y temperatura para diagnóstico de equipos de clima.",
    image: herramientasImg,
    price: 1450,
  },
];

export const getMinisplit = (slug: string) => MINISPLITS.find((p) => p.slug === slug);
export const getSimple = (slug: string) =>
  [...REFACCIONES, ...HERRAMIENTAS].find((p) => p.slug === slug);

export type Zona = "Templada" | "Cálida" | "Extrema";

export function recomendar(m2: number, zona: Zona, personas: number, solDirecto: boolean) {
  const zonaFactor = { Templada: 1, Cálida: 1.12, Extrema: 1.25 }[zona];
  const btuRaw = (m2 * 600 * zonaFactor + Math.max(0, personas - 1) * 600) * (solDirecto ? 1.15 : 1);
  const tons: Tons = btuRaw <= 12000 ? "1.0" : btuRaw <= 18000 ? "1.5" : "2.0";
  return { btu: Math.round(btuRaw / 500) * 500, tons, recomendado: BTU_BY_TONS[tons] };
}
