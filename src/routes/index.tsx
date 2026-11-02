import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Flame, Wheat, Timer, Building2, Phone, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import hero from "@/assets/mekitsi.jpg";
import interior from "@/assets/interior.jpg";
import { BUSINESS, HERO_VIDEO_SRC, PRODUCTS, REVIEWS } from "@/lib/bakery";
import { useI18n } from "@/lib/i18n";
import { Hours, LiveStatus, MapEmbed, ProductRow, Reveal, seo } from "@/components/site";

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
  const icons = [Flame, Wheat, Timer, Building2];
  return (
    <>
      <section className="relative h-[100svh] min-h-[560px] overflow-hidden">
        {HERO_VIDEO_SRC ? (
          <video className="absolute inset-0 h-full w-full object-cover" src={HERO_VIDEO_SRC} poster={hero} autoPlay muted loop playsInline preload="metadata" aria-hidden />
        ) : (
          <img src={hero} alt="Мекици" width={1280} height={1024} fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/60 to-foreground/10" />
        <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-end px-5 pb-28 text-background md:pb-20">
          <LiveStatus className="mb-5" />
          <p className="enamel enamel-mustard self-start px-3 py-1 text-xs md:text-sm">{t.hero.kicker}</p>
          <h1 className="mt-4 max-w-2xl text-5xl leading-[0.95] md:text-7xl">{t.hero.title}</h1>
          <p className="mt-4 max-w-md text-lg opacity-90">{t.hero.sub}</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link to="/menu" hash="order" className="btn btn-primary text-lg">{t.hero.cta}</Link>
            <Link to="/catering" className="btn btn-mustard">{t.hero.cta2}</Link>
          </div>
        </div>
      </section>

      <section className="border-y-4 border-foreground bg-mustard text-mustard-foreground">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 px-5 py-4 md:grid-cols-4">
          {t.trust.map((label, i) => {
            const I = icons[i]!;
            return <div key={label} className="flex items-center gap-2 font-display text-sm uppercase"><I className="h-5 w-5 shrink-0" />{label}</div>;
          })}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-14">
        <Reveal>
          <h2 className="enamel px-4 py-2 text-2xl md:text-3xl">{t.menu.title}</h2>
          <p className="mt-3 text-muted-foreground">{t.menu.sub}</p>
          <div className="paper mt-6 px-4 md:px-6">
            {PRODUCTS.map((p) => <ProductRow key={p.id} p={p} />)}
            <div className="py-5 text-center"><Link to="/menu" hash="order" className="btn btn-primary">{t.hero.cta}</Link></div>
          </div>
        </Reveal>
      </section>

      <section className="kraft border-y-4 border-foreground">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 md:grid-cols-2">
          <Reveal><img src={interior} alt="" loading="lazy" width={1280} height={896} className="rotate-[-1.5deg] rounded-md border-4 border-foreground" /></Reveal>
          <Reveal>
            <p className="font-hand text-3xl text-primary">{t.story.k}</p>
            <h2 className="mt-1 text-3xl md:text-4xl">{t.story.t}</h2>
            <p className="mt-4 text-lg">{t.story.p}</p>
          </Reveal>
        </div>
      </section>

      <Reviews />

      <section className="mx-auto max-w-6xl px-5 pb-16">
        <Reveal className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-3xl">{t.visit}</h2>
            <p className="mt-4 flex gap-2 text-lg"><MapPin className="h-6 w-6 text-primary" />{BUSINESS.address[lang]}</p>
            <a href={BUSINESS.phoneHref} className="mt-2 flex gap-2 text-lg font-bold"><Phone className="h-6 w-6 text-primary" />{BUSINESS.phone}</a>
            <div className="mt-6"><Hours /></div>
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
    const id = setInterval(() => setI((x) => (x + 1) % REVIEWS.length), 5000);
    return () => clearInterval(id);
  }, []);
  const r = REVIEWS[i]!;
  return (
    <section className="mx-auto max-w-3xl px-5 py-14 text-center">
      <p className="mx-auto inline-block rounded-md border-2 border-dashed border-primary px-3 py-1 text-xs font-bold uppercase text-primary">{t.reviewsPlaceholder}</p>
      <blockquote key={i} className="mt-6 min-h-24 animate-in fade-in font-hand text-4xl leading-tight">„{r.text[lang]}"</blockquote>
      <p className="mt-2 font-bold">— {r.name}</p>
      <div className="mt-6 flex items-center justify-center gap-4">
        <button aria-label="Prev" className="p-2" onClick={() => setI((i - 1 + REVIEWS.length) % REVIEWS.length)}><ChevronLeft /></button>
        {REVIEWS.map((_, k) => <button key={k} aria-label={`${k + 1}`} onClick={() => setI(k)} className={`h-2.5 rounded-full transition-all ${k === i ? "w-6 bg-primary" : "w-2.5 bg-foreground/25"}`} />)}
        <button aria-label="Next" className="p-2" onClick={() => setI((i + 1) % REVIEWS.length)}><ChevronRight /></button>
      </div>
    </section>
  );
}
