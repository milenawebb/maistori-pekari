import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Minus, Plus, Trash2, CheckCircle2, Timer, Gift } from "lucide-react";
import { PRODUCTS, fmt } from "@/lib/bakery";
import { useCart } from "@/lib/cart";
import { useI18n } from "@/lib/i18n";
import { pickupDays, slotsFor, sofiaParts, STAMPS_FOR_FREE } from "@/lib/hours";
import { placeOrder } from "@/lib/orders.functions";
import { Field, LiveStatus, ProductRow, seo } from "@/components/site";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: seo(
      "Меню и предварителна поръчка – мекици, пирожки, бухти | Майстори Пекари",
      "Поръчай мекици, пирожки и солени бухти за вземане в Младост 4 – избери час и вземи без опашка.",
    ),
  }),
  component: MenuPage,
});

type Done = { name: string; total: number; stamps: number; free: boolean; date: string; time: string };

function MenuPage() {
  const { t, lang } = useI18n();
  const { lines, setQty, total, clear } = useCart();
  const send = useServerFn(placeOrder);
  const [now, setNow] = useState<Date | null>(null);
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<Done | null>(null);

  useEffect(() => setNow(new Date()), []);
  const days = useMemo(() => (now ? pickupDays(now) : []), [now]);
  useEffect(() => { if (!day && days[0]) setDay(days[0]); }, [days, day]);
  const slots = useMemo(() => (now && day ? slotsFor(day, now) : []), [now, day]);

  const dayLabel = (d: string) => {
    if (!now) return d;
    const today = sofiaParts(now).date;
    const tomorrow = sofiaParts(new Date(now.getTime() + 86400000)).date;
    if (d === today) return t.pre.today;
    if (d === tomorrow) return t.pre.tomorrow;
    return new Date(`${d}T12:00:00Z`).toLocaleDateString(lang === "bg" ? "bg-BG" : "en-GB", { weekday: "short", day: "numeric", month: "short" });
  };

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const errs: Record<string, string> = {};
    if ((f["name"] ?? "").trim().length < 2) errs["name"] = t.pre.errors.name;
    if (!/^[+\d\s()-]{8,20}$/.test((f["phone"] ?? "").trim())) errs["phone"] = t.pre.errors.phone;
    if (!time) errs["time"] = t.pre.errors.time;
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setBusy(true);
    try {
      const r = await send({ data: { name: f["name"]!.trim(), phone: f["phone"]!.trim(), date: day, time, notes: f["notes"] || undefined, lang, items: lines.map((l) => ({ id: l.product.id, qty: l.qty })) } });
      setDone({ name: f["name"]!.trim(), total: r.total, stamps: r.stamps, free: r.free, date: r.date, time: r.time });
      clear();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      const slot = String(err).includes("SLOT_UNAVAILABLE");
      setErrors({ form: slot ? t.pre.errors.slot : t.pre.errors.generic });
      if (slot) { setNow(new Date()); setTime(""); }
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    const filled = done.free ? STAMPS_FOR_FREE : done.stamps;
    return (
      <section className="mx-auto max-w-lg px-5 py-16 text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-success" />
        <h1 className="mt-4 text-3xl">{t.pre.thanks} {done.name}!</h1>
        <p className="mt-3 text-lg">{t.pre.ready} <span className="font-hand text-3xl text-primary">{done.time}</span> {t.pre.on} {dayLabel(done.date).toLowerCase()}. {fmt(done.total)} · {t.pre.payAtPickup}</p>
        <div className="paper mt-8 p-5 text-left">
          <h2 className="text-xl">{t.pre.stampTitle}</h2>
          <div className="mt-3 grid grid-cols-5 gap-2">
            {Array.from({ length: STAMPS_FOR_FREE }).map((_, i) => (
              <div key={i} className={`grid aspect-square place-items-center rounded-full border-2 border-dashed font-display ${i < filled ? "rotate-[-8deg] border-primary bg-primary text-primary-foreground" : "border-foreground/30 text-foreground/30"}`}>
                {i === STAMPS_FOR_FREE - 1 ? <Gift className="h-5 w-5" /> : i < filled ? "★" : i + 1}
              </div>
            ))}
          </div>
          <p className="mt-3 font-bold">{done.free ? t.pre.freeNow : `${filled} ${t.pre.stampOf}`}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t.pre.stampHint}</p>
        </div>
        <button className="btn btn-primary mt-8" onClick={() => setDone(null)}>{t.pre.another}</button>
      </section>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="enamel px-4 py-2 text-3xl md:text-4xl">{t.menu.title}</h1>
      <LiveStatus className="mt-4" />
      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_400px]">
        <div className="paper h-fit px-4 md:px-6">
          {PRODUCTS.map((p) => <ProductRow key={p.id} p={p} />)}
        </div>

        <aside id="order" className="paper h-fit scroll-mt-24 p-5 lg:sticky lg:top-24">
          <p className="enamel enamel-mustard inline-flex items-center gap-2 px-3 py-1 text-sm"><Timer className="h-4 w-4" />{t.pre.badge}</p>
          <h2 className="mt-3 text-2xl">{t.pre.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t.pre.lead}</p>
          {lines.length === 0 ? (
            <p className="mt-4 font-hand text-2xl text-muted-foreground">{t.pre.empty}</p>
          ) : (
            <>
              <ul className="mt-4 divide-y-2 divide-dashed divide-foreground/20">
                {lines.map(({ product: p, qty }) => (
                  <li key={p.id} className="flex items-center gap-3 py-3">
                    <div className="flex-1">
                      <p className="font-bold leading-tight">{p.name[lang]}</p>
                      <p className="text-sm text-muted-foreground">{fmt(p.price * qty)}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button aria-label="-" className="rounded-md border-2 border-foreground p-1" onClick={() => setQty(p.id, qty - 1)}><Minus className="h-4 w-4" /></button>
                      <span className="w-6 text-center font-bold">{qty}</span>
                      <button aria-label="+" className="rounded-md border-2 border-foreground p-1" onClick={() => setQty(p.id, qty + 1)}><Plus className="h-4 w-4" /></button>
                      <button aria-label="Remove" className="ml-1 p-1 text-muted-foreground" onClick={() => setQty(p.id, 0)}><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-2 flex items-baseline justify-between border-t-2 border-foreground pt-3">
                <span className="font-display uppercase">{t.pre.total}</span><span className="font-hand text-4xl text-primary">{fmt(total)}</span>
              </div>

              <form onSubmit={submit} className="mt-5 space-y-3" noValidate>
                <div>
                  <p className="text-sm font-bold">{t.pre.day}</p>
                  <div className="mt-1 flex gap-2">
                    {days.map((d) => (
                      <button type="button" key={d} onClick={() => { setDay(d); setTime(""); }} className={`flex-1 rounded-md border-2 px-2 py-2 text-sm font-bold ${d === day ? "border-foreground bg-foreground text-background" : "border-foreground/40"}`}>{dayLabel(d)}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold">{t.pre.time}</p>
                  {slots.length === 0 ? <p className="text-sm text-muted-foreground">{t.pre.noSlots}</p> : (
                    <div className="mt-1 grid max-h-44 grid-cols-4 gap-1.5 overflow-y-auto pr-1">
                      {slots.map((s) => (
                        <button type="button" key={s} onClick={() => setTime(s)} className={`rounded-md border-2 py-1.5 text-sm font-bold ${s === time ? "border-primary bg-primary text-primary-foreground" : "border-foreground/30"}`}>{s}</button>
                      ))}
                    </div>
                  )}
                  {errors["time"] && <span className="mt-1 block text-sm text-destructive">{errors["time"]}</span>}
                </div>
                <Field label={t.pre.name} name="name" error={errors["name"]} />
                <Field label={t.pre.phone} name="phone" type="tel" error={errors["phone"]} />
                <label className="block text-sm font-bold">{t.pre.notes}
                  <textarea name="notes" maxLength={500} rows={2} className="field mt-1 font-normal" />
                </label>
                {errors["form"] && <p className="text-sm font-bold text-destructive">{errors["form"]}</p>}
                <button disabled={busy} className="btn btn-primary w-full">{busy ? t.pre.sending : `${t.pre.submit} · ${fmt(total)}`}</button>
                <p className="flex items-center gap-2 text-xs text-muted-foreground"><Gift className="h-4 w-4" />{t.pre.stampHint}</p>
              </form>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
