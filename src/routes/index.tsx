import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Flame, Wheat, Clock, Building2, Phone, MapPin } from "lucide-react";
import hero from "@/assets/hero-mekitsi.jpg";
import interior from "@/assets/bakery-interior.jpg";
import { BUSINESS, HERO_VIDEO_SRC, PRODUCTS, REVIEWS } from "@/lib/bakery";
import { useI18n } from "@/lib/i18n";
import { Hours, LiveStatus, MapEmbed, ProductCard, Reveal, seo } from "@/components/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: seo(
      "Майстори Пекари – горещи мекици всяка сутрин | Младост 4, София",
      "Пресни пържени мекици, пирожки и солени бухти в Младост 4. Поръчай предварително и вземи без опашка.",
    ),
  }),
  component: Home,
});

function Home() {
  const { t, lang } = useI18n();
  const icons = [Flame, Wheat, Clock, Building2];
  return (
    <>
      <section className="relative h-[100svh] min-h-[600px] overflow-hidden bg-ink">
        {HERO_VIDEO_SRC ? (
          <video className="absolute inset-0 h-full w-full object-cover" src={HERO_VIDEO_SRC} poster={hero} autoPlay muted loop playsInline preload="metadata" aria-hidden />
        ) : (
          <img src={hero} alt="Мекици с пудра захар, сладко и сирене" width={1920} height={1280} fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,color-mix(in_oklab,var(--ink)_78%,transparent)_0%,color-mix(in_oklab,var(--ink)_35%,transparent)_45%,transparent_75%)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/60 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-ink/55 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-[1200px] flex-col justify-end px-5 pb-28 text-ink-foreground md:pb-24">
          <LiveStatus overlay className="self-start" />
          <h1 className="mt-6 max-w-2xl text-5xl leading-[1.05] md:text-7xl">{t.hero.title}</h1>
          <p className="mt-5 max-w-md text-base leading-relaxed opacity-90 md:text-lg">{t.hero.sub}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/menu" hash="order" className="btn btn-primary">{t.hero.cta}</Link>
            <Link to="/catering" className="btn btn-secondary">{t.hero.cta2}</Link>
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-x-6 gap-y-5 px-5 py-8 md:grid-cols-4">
          {t.trust.map((label, i) => {
            const I = icons[i]!;
            return <div key={label} className="flex items-center gap-3 text-sm text-muted-foreground"><I className="h-5 w-5 shrink-0 text-primary" strokeWidth={1.4} />{label}</div>;
          })}
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-5 py-14 md:py-28">
        <Reveal className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">{t.story.k}</p>
            <h2 className="mt-3 text-4xl md:text-5xl">{t.menu.title}</h2>
            <p className="mt-3 max-w-md text-muted-foreground">{t.menu.sub}</p>
          </div>
          <Link to="/menu" hash="order" className="btn btn-primary self-start md:self-auto">{t.hero.cta}</Link>
        </Reveal>
        <div className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((p) => <Reveal key={p.id}><ProductCard p={p} /></Reveal>)}
        </div>
      </section>

      <section className="bg-tint">
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-5 py-14 md:grid-cols-2 md:gap-20 md:py-28">
          <Reveal><img src={interior} alt="" loading="lazy" width={1280} height={1024} className="aspect-[5/4] w-full rounded-[20px] object-cover shadow-soft" /></Reveal>
          <Reveal>
            <p className="eyebrow">{t.story.k}</p>
            <h2 className="mt-3 text-4xl leading-tight md:text-5xl">{t.story.t}</h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{t.story.p}</p>
          </Reveal>
        </div>
      </section>

      <Reviews />

      <section className="mx-auto max-w-[1200px] px-5 pb-14 md:pb-28">
        <Reveal className="grid gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <h2 className="text-4xl">{t.visit}</h2>
            <p className="mt-6 flex gap-3"><MapPin className="h-5 w-5 text-primary" strokeWidth={1.5} />{BUSINESS.address[lang]}</p>
            <a href={BUSINESS.phoneHref} className="mt-3 flex gap-3 font-medium"><Phone className="h-5 w-5 text-primary" strokeWidth={1.5} />{BUSINESS.phone}</a>
            <div className="mt-8"><Hours /></div>
          </div>
          <MapEmbed />
        </Reveal>
      </section>
    </>
  );
}

function Reviews() {
  const { t, lang } = useI18n();
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % REVIEWS.length), 6000);
    return () => clearInterval(id);
  }, []);
  const r = REVIEWS[i]!;
  return (
    <section className="mx-auto max-w-3xl px-5 py-14 text-center md:py-28">
      <blockquote key={i} className="min-h-28 animate-in fade-in font-display text-3xl italic leading-snug md:text-4xl">“{r.text[lang]}”</blockquote>
      <p className="mt-6 text-sm text-muted-foreground">{r.name}</p>
      <div className="mt-8 flex justify-center gap-2">
        {REVIEWS.map((_, k) => <button key={k} aria-label={`${k + 1}`} onClick={() => setI(k)} className={`h-1.5 rounded-full transition-all ${k === i ? "w-6 bg-primary" : "w-1.5 bg-input"}`} />)}
      </div>
      <p className="mt-8 text-xs text-muted-foreground/80">{t.reviewsPlaceholder}</p>
    </section>
  );
}
