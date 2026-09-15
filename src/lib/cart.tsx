import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { cuota12MSI, mxn, WHATSAPP_NUMBER } from "@/data/products";

export type CartItem = {
  key: string;
  name: string;
  detalle: string;
  price: number;
  qty: number;
  image: string;
};

type CartCtx = {
  items: CartItem[];
  count: number;
  subtotal: number;
  total: number;
  totalMSI: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  whatsappUrl: string;
};

const Ctx = createContext<CartCtx | null>(null);
const STORAGE_KEY = "climasmax-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  const add = useCallback((item: Omit<CartItem, "qty">, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((i) => i.key === item.key);
      if (found) return prev.map((i) => (i.key === item.key ? { ...i, qty: i.qty + qty } : i));
      return [...prev, { ...item, qty }];
    });
    setOpen(true);
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setItems((prev) =>
      qty <= 0 ? prev.filter((i) => i.key !== key) : prev.map((i) => (i.key === key ? { ...i, qty } : i)),
    );
  }, []);

  const remove = useCallback((key: string) => setItems((prev) => prev.filter((i) => i.key !== key)), []);
  const clear = useCallback(() => setItems([]), []);

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const total = subtotal;
  const count = items.reduce((s, i) => s + i.qty, 0);

  const whatsappUrl = useMemo(() => {
    const lineas = items.map((i) => `• ${i.qty} x ${i.name}${i.detalle ? ` — ${i.detalle}` : ""} = ${mxn(i.price * i.qty)}`);
    const texto = [
      "Hola ClimasMax, quiero finalizar este pedido:",
      "",
      ...lineas,
      "",
      `Total de contado: ${mxn(total)}`,
      `12 MSI: 12 x ${mxn(cuota12MSI(total))}`,
    ]
      .filter(Boolean)
      .join("\n");
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`;
  }, [items, total]);

  const value: CartCtx = {
    items,
    count,
    subtotal,
    total,
    totalMSI: cuota12MSI(total),
    open,
    setOpen,
    add,
    setQty,
    remove,
    clear,
    whatsappUrl,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
}
