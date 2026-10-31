import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Check, CheckCircle2, Building2, Quote } from "lucide-react";
import catering from "@/assets/catering.jpg";
import { Field, Reveal, seo } from "@/components/site";

export const Route = createFileRoute("/catering")({
  head: () => ({
    meta: seo(
      "Кетъринг закуски София – закуски за офис | Майстори Пекари",
      "Закуски за офис, тиймбилдинг и празници с доставка. Кетъринг закуски в София до Бизнес Парк – мекици, баници, пирожки.",
    ),
  }),
  component: Catering,
});

const PACKAGES = [
  { name: "Офис закуска", people: "10–15 души", price: "от 65 €", items: ["Мини баници със сирене", "Солени бухти и пирожки", "Кисело мляко с жива закваска", "Доставка до офиса"] },
  { name: "Тиймбилдинг", people: "20–40 души", price: "от 160 €", items: ["Асорти баници и пирожки", "Мекици със сладко и сирене", "Понички и сладки", "Подредба на плата"], featured: true },
  { name: "Празник", people: "Рожден ден, кръщене, имен ден", price: "от 90 €", items: ["Меню по ваш избор", "Тава баница или пита", "Сладко асорти за децата", "Опаковка за подарък"] },
];

const schema = z.object({
  name: z.string().trim().min(2, "Въведете име или фирма").max(100),
  phone: z.string().trim().regex(/^[+\d\s()-]{8,20}$/, "Невалиден телефон"),
  email: z.string().trim().email("Невалиден имейл").max(255),
  date: z.string().min(1, "Изберете дата"),
  people: z.coerce.number().int().min(1, "Брой хора").max(1000),
  package: z.string(),
  notes: z.string().max(1000).optional(),
});

function Catering() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [pkg, setPkg] = useState(PACKAGES[0]!.name);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const r = schema.safeParse(Object.fromEntries(new FormData(e.currentTarget)));
    if (!r.success) {
      setErrors(Object.fromEntries(r.error.issues.map((i) => [i.path[0], i.message])));
      return;
    }
    setErrors({});
    setSent(true);
  }

  return (
    <>
      <section className="relative overflow-hidden">
        <img src={catering} alt="Плато със закуски за офис" width={1280} height={896} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/55 to-foreground/20" />
        <div className="relative mx-auto flex min-h-[64vh] max-w-6xl flex-col justify-end px-5 pb-12 pt-28 text-background">
          <p className="inline-flex items-center gap-2 font-semibold text-honey"><Building2 className="h-5 w-5" />Точно до Бизнес Парк София</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-bold leading-tight md:text-6xl">Закуски за целия екип – доставени до офиса</h1>
          <p className="mt-4 max-w-lg text-lg opacity-90">Пресни, ръчно приготвени и навреме. За срещи, тиймбилдинги и празници.</p>
          <a href="#inquiry" className="btn btn-primary mt-7 self-start">Изпрати запитване</a>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="text-3xl font-bold md:text-4xl">Пакети</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {PACKAGES.map((p) => (
            <Reveal key={p.name}>
              <div className={`flex h-full flex-col rounded-3xl p-6 shadow-warm ${p.featured ? "bg-foreground text-background" : "bg-card"}`}>
                <h3 className="text-2xl font-bold">{p.name}</h3>
                <p className="mt-1 opacity-75">{p.people}</p>
                <p className="mt-4 font-serif text-3xl font-bold text-honey">{p.price}</p>
                <ul className="mt-5 flex-1 space-y-2">
                  {p.items.map((i) => <li key={i} className="flex gap-2"><Check className="h-5 w-5 shrink-0 text-honey" />{i}</li>)}
                </ul>
                <a href="#inquiry" onClick={() => setPkg(p.name)} className={`btn mt-6 ${p.featured ? "btn-honey" : "btn-primary"}`}>Избери</a>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-cream-deep py-14">
        <Reveal className="mx-auto max-w-3xl px-5 text-center">
          <Quote className="mx-auto h-10 w-10 text-terracotta" />
          <blockquote className="mt-4 font-serif text-2xl italic">„Поръчахме закуски за 60 души за коледното парти. Всичко беше перфектно подредено, топло и пристигна точно навреме. Колегите още говорят за мекиците!"</blockquote>
          <p className="mt-4 font-semibold">— Анна С., офис мениджър, Бизнес Парк София</p>
        </Reveal>
      </section>

      <section id="inquiry" className="mx-auto max-w-2xl scroll-mt-20 px-5 py-16">
        {sent ? (
          <div className="text-center">
            <CheckCircle2 className="mx-auto h-16 w-16 text-terracotta" />
            <h2 className="mt-4 text-3xl font-bold">Запитването е изпратено!</h2>
            <p className="mt-3 text-lg text-muted-foreground">Ще се свържем с вас до края на деня с предложение.</p>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold">Запитване за кетъринг</h2>
            <form onSubmit={submit} noValidate className="mt-6 grid gap-4 rounded-3xl bg-card p-6 shadow-warm sm:grid-cols-2">
              <div className="sm:col-span-2"><Field label="Фирма / Име" name="name" error={errors["name"]} /></div>
              <Field label="Телефон" name="phone" type="tel" error={errors["phone"]} />
              <Field label="Имейл" name="email" type="email" error={errors["email"]} />
              <Field label="Дата" name="date" type="date" error={errors["date"]} />
              <Field label="Брой хора" name="people" type="number" error={errors["people"]} />
              <label className="block text-sm font-semibold sm:col-span-2">Пакет
                <select name="package" value={pkg} onChange={(e) => setPkg(e.target.value)} className="field mt-1 font-normal">
                  {PACKAGES.map((p) => <option key={p.name}>{p.name}</option>)}
                  <option>Индивидуално меню</option>
                </select>
              </label>
              <label className="block text-sm font-semibold sm:col-span-2">Бележки
                <textarea name="notes" rows={3} maxLength={1000} className="field mt-1 font-normal" />
              </label>
              <button className="btn btn-primary sm:col-span-2">Изпрати запитване</button>
            </form>
          </>
        )}
      </section>
    </>
  );
}
