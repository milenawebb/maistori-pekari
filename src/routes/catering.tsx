import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Check, CheckCircle2, Building2 } from "lucide-react";
import catering from "@/assets/catering.jpg";
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

  return (
    <>
      <section className="relative overflow-hidden">
        <img src={catering} alt="" width={1280} height={896} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/60 to-foreground/20" />
        <div className="relative mx-auto flex min-h-[60vh] max-w-6xl flex-col justify-end px-5 pb-12 pt-28 text-background">
          <p className="enamel enamel-mustard inline-flex items-center gap-2 self-start px-3 py-1 text-xs md:text-sm"><Building2 className="h-4 w-4" />{t.office.kicker}</p>
          <h1 className="mt-4 max-w-2xl text-4xl leading-tight md:text-6xl">{t.office.title}</h1>
          <p className="mt-4 max-w-lg text-lg opacity-90">{t.office.sub}</p>
          <a href="#subscribe" className="btn btn-primary mt-7 self-start">{t.office.submit}</a>
        </div>
      </section>

      <section className="border-y-4 border-foreground bg-mustard text-mustard-foreground">
        <ul className="mx-auto grid max-w-6xl gap-3 px-5 py-5 sm:grid-cols-2 md:grid-cols-4">
          {t.office.perks.map((p) => <li key={p} className="flex gap-2 font-bold"><Check className="h-5 w-5 shrink-0" />{p}</li>)}
        </ul>
      </section>

      <section id="subscribe" className="mx-auto max-w-2xl scroll-mt-20 px-5 py-14">
        {sent ? (
          <div className="text-center">
            <CheckCircle2 className="mx-auto h-16 w-16 text-success" />
            <h2 className="mt-4 text-3xl">{t.office.sent}</h2>
            <p className="mt-3 text-lg text-muted-foreground">{t.office.sentSub}</p>
          </div>
        ) : (
          <Reveal>
            <h2 className="enamel px-4 py-2 text-2xl">{t.office.formTitle}</h2>
            <form onSubmit={submit} noValidate className="paper mt-6 grid gap-4 p-6 sm:grid-cols-2">
              <Field label={t.office.company} name="company" error={errors["company"]} />
              <Field label={t.office.contact} name="contact_name" error={errors["contact_name"]} />
              <Field label={t.office.phone} name="phone" type="tel" error={errors["phone"]} />
              <Field label={t.office.email} name="email" type="email" error={errors["email"]} />
              <Field label={t.office.people} name="people" type="number" error={errors["people"]} defaultValue="10" />
              <label className="block text-sm font-bold">{t.office.day}
                <select name="day" defaultValue="friday" className="field mt-1 font-normal">
                  {DAYS.map((d) => <option key={d} value={d}>{t.office.days[d]}</option>)}
                </select>
              </label>
              <div className="sm:col-span-2"><Field label={t.office.address} name="address" placeholder={t.office.addrPh} error={errors["address"]} /></div>
              <label className="block text-sm font-bold sm:col-span-2">{t.office.notes}
                <textarea name="notes" rows={3} maxLength={1000} className="field mt-1 font-normal" />
              </label>
              {errors["form"] && <p className="text-sm font-bold text-destructive sm:col-span-2">{errors["form"]}</p>}
              <button disabled={busy} className="btn btn-primary sm:col-span-2">{busy ? t.pre.sending : t.office.submit}</button>
            </form>
          </Reveal>
        )}
      </section>
    </>
  );
}
