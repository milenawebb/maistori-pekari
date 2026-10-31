import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Minus, Plus, Trash2, CheckCircle2, BadgePercent } from "lucide-react";
import { CATEGORIES, PRODUCTS, fmt } from "@/lib/bakery";
import { useCart } from "@/lib/cart";
import { Field, ProductCard, seo } from "@/components/site";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: seo(
      "Меню и онлайн поръчка – мекици, баници, пирожки | Майстори Пекари",
      "Поръчайте онлайн мекици, баници, пирожки, понички, хляб с квас и кисело мляко от пекарна в Младост, София. Без такси за платформи.",
    ),
  }),
  component: MenuPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Въведете име").max(100),
  phone: z.string().trim().regex(/^[+\d\s()-]{8,20}$/, "Невалиден телефон"),
  method: z.enum(["pickup", "delivery"]),
  address: z.string().max(200).optional(),
  date: z.string().min(1, "Изберете дата"),
  time: z.string().min(1, "Изберете час"),
  notes: z.string().max(500).optional(),
});

function MenuPage() {
  const [cat, setCat] = useState(CATEGORIES[0]!);
  const { lines, setQty, total, clear } = useCart();
  const [method, setMethod] = useState<"pickup" | "delivery">("pickup");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState<{ name: string; total: number } | null>(null);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const r = schema.safeParse({ ...data, method });
    if (!r.success) {
      setErrors(Object.fromEntries(r.error.issues.map((i) => [i.path[0], i.message])));
      return;
    }
    if (method === "delivery" && !r.data.address?.trim()) {
      setErrors({ address: "Въведете адрес" });
      return;
    }
    setErrors({});
    setDone({ name: r.data.name, total });
    clear();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (done)
    return (
      <section className="mx-auto max-w-lg px-5 py-24 text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-terracotta" />
        <h1 className="mt-4 text-3xl font-bold">Благодарим, {done.name}!</h1>
        <p className="mt-3 text-lg text-muted-foreground">Поръчката ви на стойност {fmt(done.total)} е приета. Ще ви се обадим за потвърждение до 30 минути.</p>
        <button className="btn btn-primary mt-8" onClick={() => setDone(null)}>Нова поръчка</button>
      </section>
    );

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="text-4xl font-bold">Меню и онлайн поръчка</h1>
      <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-honey/30 px-4 py-2 font-semibold">
        <BadgePercent className="h-5 w-5 text-terracotta" />Поръчайте директно от нас – без такси за платформи
      </p>

      <div className="-mx-5 mt-8 flex gap-2 overflow-x-auto px-5 pb-2">
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={`shrink-0 rounded-full px-4 py-2 font-semibold transition ${c === cat ? "bg-foreground text-background" : "bg-muted hover:bg-secondary"}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="grid gap-5 sm:grid-cols-2">
          {PRODUCTS.filter((p) => p.category === cat).map((p) => <ProductCard key={p.id} p={p} />)}
        </div>

        <aside id="cart" className="h-fit scroll-mt-24 rounded-3xl bg-card p-5 shadow-warm lg:sticky lg:top-24">
          <h2 className="text-2xl font-bold">Вашата поръчка</h2>
          {lines.length === 0 ? (
            <p className="mt-4 text-muted-foreground">Количката е празна. Добавете нещо вкусно!</p>
          ) : (
            <>
              <ul className="mt-4 divide-y divide-border">
                {lines.map(({ product: p, qty }) => (
                  <li key={p.id} className="flex items-center gap-3 py-3">
                    <div className="flex-1">
                      <p className="font-semibold leading-tight">{p.name}</p>
                      <p className="text-sm text-muted-foreground">{fmt(p.price * qty)}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button aria-label="Намали" className="rounded-full bg-muted p-1.5" onClick={() => setQty(p.id, qty - 1)}><Minus className="h-4 w-4" /></button>
                      <span className="w-6 text-center font-bold">{qty}</span>
                      <button aria-label="Увеличи" className="rounded-full bg-muted p-1.5" onClick={() => setQty(p.id, qty + 1)}><Plus className="h-4 w-4" /></button>
                      <button aria-label="Премахни" className="ml-1 p-1.5 text-muted-foreground" onClick={() => setQty(p.id, 0)}><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex justify-between border-t border-border pt-3 font-serif text-xl font-bold">
                <span>Общо</span><span className="text-terracotta">{fmt(total)}</span>
              </div>

              <form onSubmit={submit} className="mt-6 space-y-3" noValidate>
                <Field label="Име" name="name" error={errors["name"]} />
                <Field label="Телефон" name="phone" type="tel" error={errors["phone"]} />
                <div className="grid grid-cols-2 gap-2">
                  {(["pickup", "delivery"] as const).map((m) => (
                    <button type="button" key={m} onClick={() => setMethod(m)} className={`rounded-xl border px-3 py-2.5 font-semibold ${method === m ? "border-terracotta bg-terracotta/10 text-terracotta" : "border-input"}`}>
                      {m === "pickup" ? "Вземане от място" : "Доставка"}
                    </button>
                  ))}
                </div>
                {method === "delivery" && <Field label="Адрес за доставка" name="address" error={errors["address"]} />}
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Дата" name="date" type="date" error={errors["date"]} />
                  <Field label="Час" name="time" type="time" error={errors["time"]} />
                </div>
                <label className="block text-sm font-semibold">Бележки
                  <textarea name="notes" maxLength={500} rows={2} className="field mt-1 font-normal" />
                </label>
                <button className="btn btn-primary w-full">Изпрати поръчката · {fmt(total)}</button>
              </form>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}

