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
// 12.89% = comision real que cobra Mercado Pago por el plan "Hasta 12 MSI".
// Se le carga al cliente dentro de la mensualidad (el precio de contado no cambia),
// para que la comision no salga del margen de Raul.
export const MSI_FEE_RATE = 0.1289;

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

export type Badge = "MÁS VENDIDO" | "OFERTA -30%" | "OFERTA" | "INVERTER AHORRO";

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
  /** Si es true, se muestra un precio tachado (mas alto) junto al precio real, estilo oferta. */
  ofertaTachado?: boolean;
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

/**
 * Incremento "de aparador" por tonelada que se le suma al precio real para mostrarlo
 * tachado como precio anterior (solo estetico, el precio que se cobra sigue siendo
 * el real calculado con envio + cargo). Indicacion de Raul: 1.0 Ton +1100,
 * 1.5 Ton +1200, 2.0 Ton +1500.
 */
export const OFERTA_INCREMENTO_BY_TONS: Record<Tons, number> = { "1.0": 1100, "1.5": 1200, "2.0": 1500 };

/** Precio tachado (mas alto) para una variacion especifica, o undefined si el producto no tiene oferta. */
export function precioAntes(p: Minisplit, tons: Tons, voltage: Voltage, mode: ModeKey): number | undefined {
  if (!p.ofertaTachado) return undefined;
  const precio = getPrice(p, tons, voltage, mode);
  if (precio === undefined) return undefined;
  return precio + OFERTA_INCREMENTO_BY_TONS[tons];
}

/** Precio tachado correspondiente al precio "desde" (el mas bajo) del producto. */
export function precioAntesFrom(p: Minisplit): number | undefined {
  if (!p.ofertaTachado) return undefined;
  const entries = Object.entries(p.precios);
  const [minKey, minPrecio] = entries.reduce((a, b) => (b[1] < a[1] ? b : a));
  const tons = minKey.split("-")[0] as Tons;
  return minPrecio + OFERTA_INCREMENTO_BY_TONS[tons];
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

/**
 * Redondea hacia arriba al siguiente precio terminado en "...499" o "...999"
 * (bloques de $500). Ej: 12,927 -> 12,999 | 13,400 -> 13,499 | 13,700 -> 13,999.
 * Se aplica siempre, para que el precio final se vea "limpio" en la pagina
 * sin importar el recargo o los estimados que se le hayan sumado antes.
 */
function redondearA499o999(n: number): number {
  return Math.ceil((n + 1) / 500) * 500 - 1;
}

/**
 * Recargo del 3.5% que se aplica a TODOS los minisplits sobre su precio de contado
 * (y por lo tanto tambien sobre el precio tachado, que se calcula a partir del de
 * contado). Cubre la comision real que cobra Mercado Pago por cobros con tarjeta de
 * credito, debito o vale de despensa, mas un colchon para gastos indirectos dificiles
 * de rastrear por unidad (material de empaque, impresiones, gasolina, mano de obra
 * para dejar los paquetes en la paqueteria). Indicacion de Raul.
 */
export const RECARGO_CONTADO_RATE = 0.035;

/**
 * Precio final para una variacion con precio REAL de proveedor (capturado de su pagina):
 * (precio_proveedor + cargo_por_tonelada + envio_por_tonelada) + recargo de contado 3.5%,
 * redondeado siempre hacia arriba a terminacion "...499" o "...999" (bloques de $500),
 * para que se vea limpio en la pagina.
 */
function precioFinalReal(tons: Tons, precioProveedor: number): number {
  const subtotal = precioProveedor + CARGO_BY_TONS[tons] + SHIPPING_BY_TONS[tons];
  const total = subtotal * (1 + RECARGO_CONTADO_RATE);
  return redondearA499o999(total);
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
      const modoPresente = modosConfirmados[0]!.mode;
      const modoFaltante: ModeKey = modoPresente === "frio" ? "friocalor" : "frio";
      const precioPresente = out[priceKey(tons, voltage, modoPresente)];
      if (precioPresente !== undefined) out[priceKey(tons, voltage, modoFaltante)] = precioPresente;
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
        const precioConEnvio = (precioBase + envio) * (1 + RECARGO_CONTADO_RATE);
        const price = redondearA499o999(precioConEnvio);
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
    badges: ["MÁS VENDIDO", "OFERTA", "INVERTER AHORRO"],
    specs: { refrigerante: "R32", ruido: "19 dB", seer: "21.0", garantia: "10 años en compresor, 3 años en partes" },
    precios: aplicarPreciosReales(matrix(8990), [
      { tons: "1.0", voltage: "220V", mode: "frio", precioProveedor: 5999.99 },
      { tons: "1.5", voltage: "220V", mode: "friocalor", precioProveedor: 10166.0 },
    ]),
    ofertaTachado: true,
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
    badges: ["OFERTA", "INVERTER AHORRO"],
    specs: { refrigerante: "R32", ruido: "20 dB", seer: "20.0", garantia: "10 años en compresor, 3 años en partes" },
    precios: aplicarPreciosReales(matrix(8990), [
      { tons: "1.0", voltage: "110V", mode: "frio", precioProveedor: 6979.0 },
      { tons: "1.0", voltage: "220V", mode: "frio", precioProveedor: 6479.99 },
      { tons: "1.0", voltage: "220V", mode: "friocalor", precioProveedor: 6783.0 },
      { tons: "1.5", voltage: "220V", mode: "frio", precioProveedor: 8999.99 },
      { tons: "1.5", voltage: "220V", mode: "friocalor", precioProveedor: 9979.99 },
      { tons: "2.0", voltage: "220V", mode: "frio", precioProveedor: 11200.0 },
    ]),
    ofertaTachado: true,
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
    badges: ["OFERTA"],
    specs: { refrigerante: "R410A", ruido: "32 dB", seer: "13.0", garantia: "5 años en compresor, 1 año en partes" },
    precios: aplicarPreciosReales(matrix(6490), [
      { tons: "1.0", voltage: "110V", mode: "friocalor", precioProveedor: 6299.0 },
      { tons: "2.0", voltage: "220V", mode: "frio", precioProveedor: 10590.0 },
    ]),
    ofertaTachado: true,
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
    badges: ["MÁS VENDIDO", "OFERTA"],
    specs: { refrigerante: "R410A", ruido: "35 dB", seer: "13.5", garantia: "5 años en compresor, 1 año en partes" },
    precios: aplicarPreciosReales(matrix(7190), [
      { tons: "1.0", voltage: "220V", mode: "frio", precioProveedor: 4850.0 },
    ]),
    ofertaTachado: true,
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

export type Zona = "Templada" | "Cálida" | "Fría";

export type EquipoRecomendado = { tons: Tons; cantidad: number };

/**
 * Arma la combinacion de equipos que cubre el total de BTU calculado.
 * Un solo equipo cubre hasta 24,000 BTU (2.0 Ton, el mas grande del catalogo);
 * si el espacio necesita mas, se combinan varios equipos en vez de recomendar
 * un solo 2.0 Ton que se quedaria corto.
 */
function comboEquipos(btuRaw: number): EquipoRecomendado[] {
  const MAX_UNIDAD = BTU_BY_TONS["2.0"];

  if (btuRaw <= MAX_UNIDAD) {
    const tons: Tons = btuRaw <= BTU_BY_TONS["1.0"] ? "1.0" : btuRaw <= BTU_BY_TONS["1.5"] ? "1.5" : "2.0";
    return [{ tons, cantidad: 1 }];
  }

  const equiposDe2Ton = Math.floor(btuRaw / MAX_UNIDAD);
  const restante = btuRaw - equiposDe2Ton * MAX_UNIDAD;

  if (restante === 0) return [{ tons: "2.0", cantidad: equiposDe2Ton }];
  if (restante <= BTU_BY_TONS["1.0"]) {
    return [
      { tons: "2.0", cantidad: equiposDe2Ton },
      { tons: "1.0", cantidad: 1 },
    ];
  }
  if (restante <= BTU_BY_TONS["1.5"]) {
    return [
      { tons: "2.0", cantidad: equiposDe2Ton },
      { tons: "1.5", cantidad: 1 },
    ];
  }
  // el restante no cabe ni en un equipo de 1.5 Ton: se redondea a otro de 2.0 Ton
  return [{ tons: "2.0", cantidad: equiposDe2Ton + 1 }];
}

export function recomendar(m2: number, zona: Zona, personas: number, solDirecto: boolean) {
  const zonaFactor = { Templada: 1, Cálida: 1.12, Fría: 1.25 }[zona];
  const btuRaw = (m2 * 600 * zonaFactor + Math.max(0, personas - 1) * 600) * (solDirecto ? 1.15 : 1);
  const equipos = comboEquipos(btuRaw);
  const recomendado = equipos.reduce((acc, e) => acc + BTU_BY_TONS[e.tons] * e.cantidad, 0);
  const multiplesEquipos = equipos.length > 1 || equipos[0]!.cantidad > 1;
  return {
    btu: Math.round(btuRaw / 500) * 500,
    tons: equipos[0]!.tons,
    recomendado,
    equipos,
    multiplesEquipos,
  };
}
