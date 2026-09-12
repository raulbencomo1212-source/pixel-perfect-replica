import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { CartDrawer } from "@/components/CartDrawer";
import { CapacityCalculator } from "@/components/CapacityCalculator";

export const Route = createFileRoute("/calculadora")({
  head: () => ({
    meta: [
      { title: "¿Cuál es mi clima ideal? Calculadora de toneladas | Climas Max" },
      {
        name: "description",
        content:
          "Calcula en segundos cuántos BTU y toneladas necesita tu cuarto según metros cuadrados, zona climática, personas y sol directo.",
      },
      { property: "og:title", content: "Calculadora de capacidad para minisplit | Climas Max" },
      { property: "og:description", content: "Descubre si necesitas 1, 1.5 o 2 toneladas para tu espacio." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CalculadoraPage,
});

function CalculadoraPage() {
  return (
    <>
      <SiteHeader />
      <CartDrawer />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="font-display text-3xl font-extrabold tracking-tight">¿Cuál es mi clima ideal?</h1>
        <p className="mt-2 max-w-[60ch] text-sm text-muted-foreground">
          Ajusta los datos de tu espacio y te decimos la capacidad recomendada al instante.
        </p>
        <div className="mt-8">
          <CapacityCalculator />
        </div>
      </main>
      <SiteFooter />
      <WhatsAppFab />
    </>
  );
}
