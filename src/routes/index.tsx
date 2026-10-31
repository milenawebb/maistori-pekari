import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Star, Wheat, Sunrise, Building2, Phone, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import hero from "@/assets/mekitsi.jpg";
import interior from "@/assets/interior.jpg";
import { BUSINESS, PRODUCTS, REVIEWS } from "@/lib/bakery";
import { Hours, MapEmbed, ProductCard, Reveal, seo } from "@/components/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: seo(
      "Майстори Пекари – пекарна Младост 4 | Мекици София",
      "Едновремешни мекици, пирожки, понички и баници с био брашно. Пекарна в Младост 4, София – пресно всяка сутрин.",
    ),
  }),
  component: Home,
});

function Home() {
  const best = PRODUCTS.filter((p) => p.bestseller).slice(0, 6);
  return (
    <>
      <section className="relative overflow-hidden">
        <img src={hero} alt="Мекици с пудра захар и сладко" width={1280} height={1024} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/50 to-foreground/10 md:bg-gradient-to-r" />
        <div className="relative mx-auto flex min-h-[78vh] max-w-6xl flex-col justify-end px-5 pb-12 pt-32 text-background md:justify-center">
          <p className="mb-3 font-semibold uppercase tracking-[0.2em] text-honey">Пекарна · Младост 4</p>
          <h1 className="max-w-xl text-4xl font-bold leading-tight md:text-6xl">Вкусът на детството – всяка сутрин</h1>
          <p className="mt-4 max-w-md text-lg opacity-90">Едновремешни рецепти, био брашно и фермерско сирене. Месим на ръка, както са правили мама и баба.</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link to="/menu" className="btn btn-primary">Поръчай онлайн</Link>
            <Link to="/catering" className="btn btn-honey">Кетъринг за събития</Link>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-cream-deep">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-5 py-6 md:grid-cols-4">
          {[
            [Star, "5.0★ в Google"],
            [Wheat, "Био брашно"],
            [Sunrise, "Пресно всяка сутрин"],
            [Building2, "До Бизнес Парк София"],
          ].map(([Icon, t]) => {
            const I = Icon as typeof Star;
            return (
              <div key={t as string} className="flex items-center gap-2 font-semibold">
                <I className="h-5 w-5 shrink-0 text-terracotta" />
                {t as string}
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-2">
        <Reveal>
          <img src={interior} alt="Вътрешността на пекарната" loading="lazy" width={1280} height={896} className="rounded-3xl shadow-warm" />
        </Reveal>
        <Reveal>
          <p className="font-semibold uppercase tracking-[0.2em] text-terracotta">Нашата история</p>
          <h2 className="mt-2 text-3xl font-bold md:text-4xl">Връщаме забравения занаят</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Едновремешните мекици, пирожки и понички изчезват от града. Ние ги връщаме – месени на ръка, с био брашно, истинско кисело мляко с жива закваска и сирене от ферма. Точно както ги правеха мама и баба.
          </p>
        </Reveal>
      </section>

      <section className="bg-cream-deep py-16">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <h2 className="text-3xl font-bold md:text-4xl">Най-обичани</h2>
            <p className="mt-2 text-muted-foreground">Това, за което клиентите ни се връщат.</p>
          </Reveal>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {best.map((p) => (
              <Reveal key={p.id}><ProductCard p={p} /></Reveal>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/menu" className="btn btn-outline">Цялото меню</Link>
          </div>
        </div>
      </section>

      <Reviews />

      <section className="mx-auto max-w-6xl px-5 pb-16">
        <Reveal className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold">Заповядайте</h2>
            <p className="mt-4 flex gap-2 text-lg"><MapPin className="h-6 w-6 text-terracotta" />{BUSINESS.address}</p>
            <a href={BUSINESS.phoneHref} className="mt-2 flex gap-2 text-lg font-semibold"><Phone className="h-6 w-6 text-terracotta" />{BUSINESS.phone}</a>
            <div className="mt-6"><Hours /></div>
          </div>
          <MapEmbed />
        </Reveal>
      </section>
    </>
  );
}

function Reviews() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % REVIEWS.length), 5000);
    return () => clearInterval(t);
  }, []);
  const r = REVIEWS[i]!;
  return (
    <section className="mx-auto max-w-3xl px-5 py-16 text-center">
      <div className="flex justify-center gap-1 text-honey">
        {Array.from({ length: 5 }).map((_, k) => <Star key={k} className="h-6 w-6 fill-current" />)}
      </div>
      <blockquote key={i} className="mt-6 min-h-28 animate-in fade-in font-serif text-2xl italic md:text-3xl">„{r.text}"</blockquote>
      <p className="mt-4 font-semibold">— {r.name}</p>
      <div className="mt-6 flex items-center justify-center gap-4">
        <button aria-label="Предишен" className="rounded-full p-2 hover:bg-muted" onClick={() => setI((i - 1 + REVIEWS.length) % REVIEWS.length)}><ChevronLeft /></button>
        {REVIEWS.map((_, k) => (
          <button key={k} aria-label={`Отзив ${k + 1}`} onClick={() => setI(k)} className={`h-2.5 rounded-full transition-all ${k === i ? "w-6 bg-terracotta" : "w-2.5 bg-border"}`} />
        ))}
        <button aria-label="Следващ" className="rounded-full p-2 hover:bg-muted" onClick={() => setI((i + 1) % REVIEWS.length)}><ChevronRight /></button>
      </div>
    </section>
  );
}
