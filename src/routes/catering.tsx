import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Building2, Truck, Flame, Receipt, CalendarX } from "lucide-react";
import catering from "@/assets/office-breakfast.jpg";
import { useI18n } from "@/lib/i18n";
import { subscribeOffice } from "@/lib/orders.functions";
import { Field, Reveal, seo } from "@/components/site";

export const Route = createFileRoute("/catering")({
  head: () => ({
    meta: seo(
      "Петъчна закуска за офиса – Бизнес Парк София | Майстори Пекари",
      "Седмичен абонамент за закуска за офиса в Бизнес Парк София – горещи мекици и пирожки, доставени всяка седмица.",
    ),
  }),
  component: Catering,
});

const DAYS = ["friday", "thursday", "wednesday", "tuesday", "monday"] as const;

function Catering() {
  const { t } = useI18n();
  const send = useServerFn(subscribeOffice);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const errs: Record<string, string> = {};
    for (const k of ["company", "contact_name", "address"]) if ((f[k] ?? "").trim().length < 2) errs[k] = t.office.err;
    if (!/^[+\d\s()-]{8,20}$/.test((f["phone"] ?? "").trim())) errs["phone"] = t.pre.errors.phone;
    if (!/^\S+@\S+\.\S+$/.test((f["email"] ?? "").trim())) errs["email"] = t.office.err;
    const people = Number(f["people"]);
    if (!Number.isInteger(people) || people < 3 || people > 500) errs["people"] = "3–500";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setBusy(true);
    try {
      await send({ data: { company: f["company"]!.trim(), contact_name: f["contact_name"]!.trim(), phone: f["phone"]!.trim(), email: f["email"]!.trim(), people, day: f["day"] as (typeof DAYS)[number], address: f["address"]!.trim(), notes: f["notes"] || undefined } });
      setSent(true);
    } catch {
      setErrors({ form: t.pre.errors.generic });
    } finally {
      setBusy(false);
    }
  }

  const perkIcons = [Truck, Flame, Receipt, CalendarX];
  return (
    <>
      <section className="relative overflow-hidden bg-ink">
        <img src={catering} alt="" width={1920} height={1280} fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-tr from-ink/80 via-ink/35 to-transparent" />
        <div className="relative mx-auto flex min-h-[78svh] max-w-[1200px] flex-col justify-end px-5 pb-16 pt-32 text-ink-foreground md:pb-24">
          <p className="inline-flex items-center gap-2 self-start rounded-full bg-card/15 px-3.5 py-1.5 text-sm font-medium ring-1 ring-card/30 backdrop-blur-md"><Building2 className="h-4 w-4" strokeWidth={1.6} />{t.office.kicker}</p>
          <h1 className="mt-6 max-w-2xl text-5xl leading-[1.05] md:text-7xl">{t.office.title}</h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed opacity-90 md:text-lg">{t.office.sub}</p>
          <a href="#subscribe" className="btn btn-primary mt-8 self-start">{t.office.submit}</a>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1200px] gap-5 px-5 py-14 sm:grid-cols-2 md:py-24 lg:grid-cols-4">
        {t.office.perks.map((p, i) => {
          const I = perkIcons[i]!;
          return (
            <Reveal key={p}>
              <div className="card h-full p-6">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-tint text-primary"><I className="h-5 w-5" strokeWidth={1.5} /></span>
                <p className="mt-5 font-medium leading-snug">{p}</p>
              </div>
            </Reveal>
          );
        })}
      </section>

      <section id="subscribe" className="mx-auto max-w-2xl scroll-mt-24 px-5 pb-14 md:pb-28">
        {sent ? (
          <div className="card p-10 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-success" strokeWidth={1.4} />
            <h2 className="mt-5 text-3xl">{t.office.sent}</h2>
            <p className="mt-3 text-muted-foreground">{t.office.sentSub}</p>
          </div>
        ) : (
          <Reveal>
            <h2 className="text-center text-4xl">{t.office.formTitle}</h2>
            <form onSubmit={submit} noValidate className="card mt-10 grid gap-5 p-6 sm:grid-cols-2 md:p-10">
              <Field label={t.office.company} name="company" error={errors["company"]} />
              <Field label={t.office.contact} name="contact_name" error={errors["contact_name"]} />
              <Field label={t.office.phone} name="phone" type="tel" error={errors["phone"]} />
              <Field label={t.office.email} name="email" type="email" error={errors["email"]} />
              <Field label={t.office.people} name="people" type="number" error={errors["people"]} defaultValue="10" />
              <label className="block text-sm font-medium">{t.office.day}
                <select name="day" defaultValue="friday" className="field mt-1.5 font-normal">
                  {DAYS.map((d) => <option key={d} value={d}>{t.office.days[d]}</option>)}
                </select>
              </label>
              <div className="sm:col-span-2"><Field label={t.office.address} name="address" placeholder={t.office.addrPh} error={errors["address"]} /></div>
              <label className="block text-sm font-medium sm:col-span-2">{t.office.notes}
                <textarea name="notes" rows={3} maxLength={1000} className="field mt-1.5 font-normal" />
              </label>
              {errors["form"] && <p className="text-sm text-destructive sm:col-span-2">{errors["form"]}</p>}
              <button disabled={busy} className="btn btn-primary sm:col-span-2">{busy ? t.pre.sending : t.office.submit}</button>
            </form>
          </Reveal>
        )}
      </section>
    </>
  );
}
