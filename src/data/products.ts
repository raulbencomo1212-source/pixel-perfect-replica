import evaporador from "@/assets/minisplit-evaporador.jpg";
import inverterxEvap1 from "@/assets/inverterx-evaporador-1.png";
import inverterxCondensador from "@/assets/inverterx-condensador.jpg";
import inverterxEvap2 from "@/assets/inverterx-evaporador-2.png";
import inverterxKit from "@/assets/inverterx-kit-control.jpg";
import x32Condensador from "@/assets/x32-condensador.jpg";
import x32Frontal from "@/assets/x32-frontal.jpg";
import x32Kit from "@/assets/x32-kit.jpg";
import life12Frontal from "@/assets/life12-frontal.jpg";
import life12Kit from "@/assets/life12-kit.jpg";
import life12Lateral from "@/assets/life12-lateral.jpg";
import magnum22Frontal from "@/assets/magnum22-frontal.jpg";
import magnum22Kit from "@/assets/magnum22-kit.jpg";
import magnum22Lateral from "@/assets/magnum22-lateral.jpg";
import x5Frontal from "@/assets/x5-frontal.jpg";
import x5Lateral from "@/assets/x5-lateral.jpg";
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

/**
 * Cargo fijo por tonelada que se suma al precio real del proveedor (ademas del envio),
 * segun instruccion de Raul: 1.0 Ton +$600, 1.5 Ton +$800, 2.0 Ton +$1200.
 */
export const CARGO_BY_TONS: Record<Tons, number> = { "1.0": 600, "1.5": 800, "2.0": 1200 };

/** Redondea hacia arriba al siguiente precio terminado en 999 (ej. 12,700 -> 12,999). */
function redondearA999(n: number): number {
  return Math.ceil((n + 1) / 1000) * 1000 - 1;
}

/**
 * Precio final para una variacion con precio REAL de proveedor (capturado de su pagina):
 * precio_proveedor + cargo_por_tonelada + envio_por_tonelada, redondeado hacia arriba
 * a terminacion "...999" cuando el envio de esa tonelada es $500 o mas (1.5 y 2.0 Ton).
 */
function precioFinalReal(tons: Tons, precioProveedor: number): number {
  const total = precioProveedor + CARGO_BY_TONS[tons] + SHIPPING_BY_TONS[tons];
  return SHIPPING_BY_TONS[tons] >= 500 ? redondearA999(total) : Math.round(total);
}

type PrecioReal = { tons: Tons; voltage: Voltage; mode: ModeKey; precioProveedor: number };

/**
 * Sobrescribe, dentro de una tabla de precios ya generada (estimada via matrix()),
 * las variaciones para las que Raul ya mando el precio real del proveedor.
 * Las variaciones que aun no se confirman quedan con el estimado, para no romper la pagina.
 */
function aplicarPreciosReales(precios: Record<string, number>, reales: PrecioReal[]): Record<string, number> {
  const out = { ...precios };
  for (const r of reales) {
    out[priceKey(r.tons, r.voltage, r.mode)] = precioFinalReal(r.tons, r.precioProveedor);
  }
  // Si para una combinacion tonelada+voltaje solo se confirmo un modo (Solo Frio o
  // Frio y Calor), el otro modo esta agotado con el proveedor por ahora: mientras se
  // confirma, se usa temporalmente el mismo precio del modo que si esta disponible
  // (indicacion de Raul, para no dejar el espacio vacio en la pagina).
  const combos = new Set(reales.map((r) => `${r.tons}|${r.voltage}`));
  for (const combo of combos) {
    const [tons, voltage] = combo.split("|") as [Tons, Voltage];
    const modosConfirmados = reales.filter((r) => r.tons === tons && r.voltage === voltage);
    if (modosConfirmados.length === 1) {
      const modoPresente = modosConfirmados[0].mode;
      const modoFaltante: ModeKey = modoPresente === "frio" ? "friocalor" : "frio";
      out[priceKey(tons, voltage, modoFaltante)] = out[priceKey(tons, voltage, modoPresente)];
    }
  }
  return out;
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
    id: "inverterx",
    slug: "mirage-inverter-x",
    name: "Mirage Inverter X",
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
    precios: aplicarPreciosReales(matrix(8990), [
      { tons: "1.0", voltage: "220V", mode: "frio", precioProveedor: 5999.99 },
      { tons: "1.5", voltage: "220V", mode: "friocalor", precioProveedor: 10166.0 },
    ]),
  },
  {
    id: "x32",
    slug: "mirage-x32-inverter",
    name: "Mirage X32 Inverter",
    brand: "Mirage",
    tech: "inverter",
    description:
      "Minisplit Inverter con refrigerante ecológico R32, compresor de velocidad variable y operación silenciosa. Ideal para recámaras y oficinas.",
    images: [
      { src: x32Condensador, label: "Condensador exterior" },
      { src: x32Frontal, label: "Vista frontal" },
      { src: x32Kit, label: "Kit completo" },
    ],
    badges: ["INVERTER AHORRO"],
    specs: { refrigerante: "R32", ruido: "20 dB", seer: "20.0", garantia: "10 años en compresor, 3 años en partes" },
    precios: aplicarPreciosReales(matrix(8990), [
      { tons: "1.0", voltage: "110V", mode: "frio", precioProveedor: 6979.0 },
      { tons: "1.0", voltage: "220V", mode: "frio", precioProveedor: 6479.99 },
      { tons: "1.0", voltage: "220V", mode: "friocalor", precioProveedor: 6783.0 },
      { tons: "1.5", voltage: "220V", mode: "frio", precioProveedor: 8999.99 },
      { tons: "1.5", voltage: "220V", mode: "friocalor", precioProveedor: 9979.99 },
      { tons: "2.0", voltage: "220V", mode: "frio", precioProveedor: 11200.0 },
    ]),
  },
  {
    id: "life12",
    slug: "mirage-life-12-plus",
    name: "Mirage Life 12+",
    brand: "Mirage",
    tech: "convencional",
    description:
      "Equipo convencional fix speed, la opción más accesible para recámaras y oficinas pequeñas. Refacciones disponibles en todo México.",
    images: [
      { src: life12Frontal, label: "Vista frontal" },
      { src: life12Kit, label: "Kit completo" },
      { src: life12Lateral, label: "Vista lateral" },
    ],
    badges: ["OFERTA -30%"],
    specs: { refrigerante: "R410A", ruido: "32 dB", seer: "13.0", garantia: "5 años en compresor, 1 año en partes" },
    precios: aplicarPreciosReales(matrix(6490), [
      { tons: "1.0", voltage: "110V", mode: "friocalor", precioProveedor: 6299.0 },
      { tons: "2.0", voltage: "220V", mode: "frio", precioProveedor: 10590.0 },
    ]),
  },
  {
    id: "x5",
    slug: "mirage-x5",
    name: "Mirage X5",
    brand: "Mirage",
    tech: "convencional",
    description:
      "Convencional de alto flujo de aire para salas y locales comerciales. Filtro lavable antibacterial y gabinete reforzado.",
    images: [
      { src: x5Frontal, label: "Vista frontal" },
      { src: x5Lateral, label: "Vista lateral" },
    ],
    badges: ["MÁS VENDIDO"],
    specs: { refrigerante: "R410A", ruido: "35 dB", seer: "13.5", garantia: "5 años en compresor, 1 año en partes" },
    precios: aplicarPreciosReales(matrix(7190), [
      { tons: "1.0", voltage: "220V", mode: "frio", precioProveedor: 4850.0 },
    ]),
  },
  {
    id: "magnum22",
    slug: "mirage-magnum-22",
    name: "Mirage Magnum 22",
    brand: "Mirage",
    tech: "inverter",
    description:
      "Inverter reforzado para clima extremo: enfría con hasta 48 °C exteriores, serpentín con recubrimiento anticorrosivo y arranque suave que protege tu instalación eléctrica.",
    images: [
      { src: magnum22Frontal, label: "Vista frontal" },
      { src: magnum22Kit, label: "Kit completo" },
      { src: magnum22Lateral, label: "Vista lateral" },
    ],
    badges: ["INVERTER AHORRO"],
    specs: { refrigerante: "R32", ruido: "22 dB", seer: "19.5", garantia: "10 años en compresor, 3 años en partes" },
    precios: aplicarPreciosReales(matrix(9790), [
      { tons: "1.0", voltage: "220V", mode: "friocalor", precioProveedor: 8400.0 },
      { tons: "2.0", voltage: "220V", mode: "friocalor", precioProveedor: 15999.0 },
    ]),
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
