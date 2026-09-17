import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { MINISPLITS, getPrice, type Tons, type Voltage, type ModeKey } from "@/data/products";

/**
 * Item tal como vive en el carrito del cliente (ver src/lib/cart.tsx). El "price" que manda
 * el navegador NUNCA se usa directo para cobrar: aqui se vuelve a calcular con getPrice() a
 * partir del "key" del carrito (que para minisplits tiene la forma
 * `${slug}-${tons}-${voltage}-${mode}`), para que nadie pueda alterar el precio manipulando
 * el carrito guardado en su navegador (localStorage). Si el item no es un minisplit conocido
 * (por ejemplo una refaccion o herramienta), se usa el precio que mando el cliente porque esos
 * catalogos todavia no tienen esta validacion (fuera de alcance por ahora).
 */
type ItemCarritoInput = {
  key: string;
  name: string;
  detalle: string;
  qty: number;
  price: number;
};

type CheckoutInput = { items: ItemCarritoInput[] };

function precioAutoritativo(item: ItemCarritoInput): number {
  const producto = MINISPLITS.find((p) => item.key.startsWith(`${p.slug}-`));
  if (!producto) return item.price;
  const resto = item.key.slice(producto.slug.length + 1);
  const [tons, voltage, mode] = resto.split("-") as [Tons, Voltage, ModeKey];
  return getPrice(producto, tons, voltage, mode) ?? item.price;
}

/**
 * Lee el Access Token de Mercado Pago de la variable de entorno MP_ACCESS_TOKEN.
 * En desarrollo local viene de .dev.vars; en produccion, del Secret configurado en
 * Lovable (seccion Cloud). Se usa process.env directo (sin importar nada especifico
 * de Cloudflare) para que el build funcione igual en la vista previa y en produccion.
 * Si no encuentra la variable, truena con un mensaje claro en vez de fallar en silencio.
 */
function credencialMercadoPago(): string {
  const token = typeof process !== "undefined" ? process.env?.MP_ACCESS_TOKEN : undefined;
  if (!token) {
    throw new Error(
      "Falta configurar MP_ACCESS_TOKEN (variable de entorno / secreto de Mercado Pago). " +
        "En desarrollo local va en .dev.vars; en produccion se agrega como Secret en Lovable (seccion Cloud).",
    );
  }
  return token;
}

function origenSitio(): string {
  try {
    const request = getRequest();
    if (request) return new URL(request.url).origin;
  } catch {
    /* ignore */
  }
  return "https://climasmax.com.mx";
}

/**
 * Crea una preferencia de pago (Checkout Pro) en Mercado Pago con los precios REALES de
 * cada minisplit (recalculados en el servidor) y devuelve el link al que hay que mandar
 * al cliente para que pague. El plan de MSI (hasta 12 meses) ya debe estar activado desde
 * el panel de Mercado Pago (Negocio > Configuracion > Comisiones y MSI).
 */
export const crearCheckoutMercadoPago = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as CheckoutInput)
  .handler(async ({ data }) => {
    if (!data.items || data.items.length === 0) {
      throw new Error("El carrito esta vacio.");
    }

    const accessToken = credencialMercadoPago();
    const origin = origenSitio();

    const items = data.items.map((item) => ({
      title: item.detalle ? `${item.name} — ${item.detalle}` : item.name,
      quantity: item.qty,
      unit_price: precioAutoritativo(item),
      currency_id: "MXN",
    }));

    const externalReference = `climasmax-${Date.now()}`;

    const respuesta = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        items,
        currency_id: "MXN",
        back_urls: {
          success: `${origin}/?pago=exito`,
          failure: `${origin}/?pago=fallo`,
          pending: `${origin}/?pago=pendiente`,
        },
        auto_return: "approved",
        payment_methods: { installments: 12 },
        statement_descriptor: "CLIMASMAX",
        external_reference: externalReference,
      }),
    });

    if (!respuesta.ok) {
      const texto = await respuesta.text().catch(() => "");
      throw new Error(`Mercado Pago rechazo la solicitud (${respuesta.status}): ${texto || "sin detalle"}`);
    }

    const json = (await respuesta.json()) as { init_point?: string; sandbox_init_point?: string };
    const url = json.init_point ?? json.sandbox_init_point;
    if (!url) {
      throw new Error("Mercado Pago no devolvio un link de pago.");
    }
    return { url };
  });
