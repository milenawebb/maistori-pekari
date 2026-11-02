import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Minus, Plus, Trash2, CheckCircle2, Timer, Gift } from "lucide-react";
import { PRODUCTS, fmt } from "@/lib/bakery";
import { useCart } from "@/lib/cart";
import { useI18n } from "@/lib/i18n";
import { pickupDays, slotsFor, sofiaParts, STAMPS_FOR_FREE } from "@/lib/hours";
import { placeOrder } from "@/lib/orders.functions";
import { Field, HeaderSpacer, LiveStatus, ProductCard, seo } from "@/components/site";

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
      <>
        <HeaderSpacer />
        <section className="mx-auto max-w-lg px-5 py-14 text-center md:py-24">
          <CheckCircle2 className="mx-auto h-12 w-12 text-success" strokeWidth={1.4} />
          <h1 className="mt-5 text-4xl">{t.pre.thanks} {done.name}!</h1>
          <p className="mt-4 text-muted-foreground">{t.pre.ready} <span className="font-semibold text-foreground">{done.time}</span> {t.pre.on} {dayLabel(done.date).toLowerCase()}. {fmt(done.total)} · {t.pre.payAtPickup}</p>
          <div className="card mt-10 p-6 text-left md:p-8">
            <h2 className="text-2xl">{t.pre.stampTitle}</h2>
            <div className="mt-5 grid grid-cols-5 gap-3">
              {Array.from({ length: STAMPS_FOR_FREE }).map((_, i) => (
                <div key={i} className={`grid aspect-square place-items-center rounded-full border text-sm ${i < filled ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"}`}>
                  {i === STAMPS_FOR_FREE - 1 ? <Gift className="h-4 w-4" strokeWidth={1.6} /> : i < filled ? <CheckCircle2 className="h-4 w-4" strokeWidth={1.8} /> : i + 1}
                </div>
              ))}
            </div>
            <p className="mt-5 font-semibold">{done.free ? t.pre.freeNow : `${filled} ${t.pre.stampOf}`}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t.pre.stampHint}</p>
          </div>
          <button className="btn btn-primary mt-10" onClick={() => setDone(null)}>{t.pre.another}</button>
        </section>
      </>
    );
  }

  return (
    <>
    <HeaderSpacer />
    <div className="mx-auto max-w-[1200px] px-5 py-14 md:py-20">
      <h1 className="text-5xl">{t.menu.title}</h1>
      <p className="mt-3 text-muted-foreground">{t.menu.sub}</p>
      <LiveStatus className="mt-6" />
      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_400px]">
        <div className="grid h-fit gap-x-8 gap-y-12 sm:grid-cols-2">
          {PRODUCTS.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>

        <aside id="order" className="card h-fit scroll-mt-28 p-6 lg:sticky lg:top-28">
          <p className="inline-flex items-center gap-2 rounded-full bg-tint px-3 py-1 text-xs font-semibold text-primary"><Timer className="h-3.5 w-3.5" />{t.pre.badge}</p>
          <h2 className="mt-4 text-3xl">{t.pre.title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{t.pre.lead}</p>
          {lines.length === 0 ? (
            <p className="mt-6 rounded-xl bg-background p-4 text-sm text-muted-foreground">{t.pre.empty}</p>
          ) : (
            <>
              <ul className="mt-6 divide-y divide-border">
                {lines.map(({ key, product: p, qty, unit }) => (
                  <li key={key} className="flex items-center gap-3 py-3">
                    <div className="flex-1">
                      <p className="font-medium leading-tight">{p.name[lang]}</p>
                      <p className="text-sm text-muted-foreground">{fmt(unit * qty)}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button aria-label="-" className="grid h-8 w-8 place-items-center rounded-full border border-border" onClick={() => setQty(key, qty - 1)}><Minus className="h-3.5 w-3.5" /></button>
                      <span className="w-6 text-center text-sm font-semibold">{qty}</span>
                      <button aria-label="+" className="grid h-8 w-8 place-items-center rounded-full border border-border" onClick={() => setQty(key, qty + 1)}><Plus className="h-3.5 w-3.5" /></button>
                      <button aria-label="Remove" className="ml-1 p-1.5 text-muted-foreground" onClick={() => setQty(key, 0)}><Trash2 className="h-4 w-4" strokeWidth={1.6} /></button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-2 flex items-baseline justify-between border-t border-border pt-4">
                <span className="text-sm text-muted-foreground">{t.pre.total}</span><span className="text-xl font-semibold">{fmt(total)}</span>
              </div>

              <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
                <div>
                  <p className="text-sm font-medium">{t.pre.day}</p>
                  <div className="mt-2 flex gap-2">
                    {days.map((d) => (
                      <button type="button" key={d} aria-pressed={d === day} onClick={() => { setDay(d); setTime(""); }} className="chip flex-1">{dayLabel(d)}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">{t.pre.time}</p>
                  {slots.length === 0 ? <p className="mt-2 text-sm text-muted-foreground">{t.pre.noSlots}</p> : (
                    <div className="mt-2 grid max-h-44 grid-cols-4 gap-2 overflow-y-auto pr-1">
                      {slots.map((s) => (
                        <button type="button" key={s} aria-pressed={s === time} onClick={() => setTime(s)} className="chip tabular-nums">{s}</button>
                      ))}
                    </div>
                  )}
                  {errors["time"] && <span className="mt-1 block text-xs text-destructive">{errors["time"]}</span>}
                </div>
                <Field label={t.pre.name} name="name" error={errors["name"]} />
                <Field label={t.pre.phone} name="phone" type="tel" error={errors["phone"]} />
                <label className="block text-sm font-medium">{t.pre.notes}
                  <textarea name="notes" maxLength={500} rows={2} className="field mt-1.5 font-normal" />
                </label>
                {errors["form"] && <p className="text-sm text-destructive">{errors["form"]}</p>}
                <button disabled={busy} className="btn btn-primary w-full">{busy ? t.pre.sending : `${t.pre.submit} · ${fmt(total)}`}</button>
                <p className="flex items-center gap-2 text-xs text-muted-foreground"><Gift className="h-4 w-4 shrink-0" strokeWidth={1.6} />{t.pre.stampHint}</p>
              </form>
            </>
          )}
        </aside>
      </div>
    </div>
    </>
  );
}
