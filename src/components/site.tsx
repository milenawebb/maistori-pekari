import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Phone, ShoppingBag, Menu, X, MapPin, Flame } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { BUSINESS, fmt, fmtBgn, type Product } from "@/lib/bakery";
import { HOURS, isOpenAt } from "@/lib/hours";
import { useCart } from "@/lib/cart";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";

const NAV = [
  { to: "/", k: "home" },
  { to: "/menu", k: "menu" },
  { to: "/catering", k: "catering" },
  { to: "/contacts", k: "contacts" },
] as const;

export function LangToggle() {
  const { lang, setLang } = useI18n();
  return (
    <div className="flex overflow-hidden rounded-md border-2 border-foreground text-xs font-bold">
      {(["bg", "en"] as const).map((l) => (
        <button key={l} onClick={() => setLang(l)} aria-pressed={lang === l} className={`px-2 py-1 uppercase ${lang === l ? "bg-foreground text-background" : ""}`}>
          {l}
        </button>
      ))}
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const { t } = useI18n();
  return (
    <header className="sticky top-0 z-40 border-b-4 border-primary bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5">
        <Link to="/" className="enamel px-3 py-1 text-base md:text-lg">Майстори Пекари</Link>
        <nav className="hidden gap-6 md:flex">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className="font-display uppercase tracking-wide hover:text-primary" activeProps={{ className: "text-primary" }} activeOptions={{ exact: true }}>
              {t.nav[n.k]}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LangToggle />
          <Link to="/menu" hash="order" className="relative p-2" aria-label={t.cart}>
            <ShoppingBag className="h-6 w-6" />
            {count > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-xs font-bold text-primary-foreground">{count}</span>}
          </Link>
          <button className="p-2 md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="flex flex-col border-t-2 border-foreground/20 px-5 py-2 md:hidden">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="py-3 font-display text-lg uppercase">{t.nav[n.k]}</Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function useFreshAt() {
  return useQuery({
    queryKey: ["site_status"],
    queryFn: async () => (await supabase.from("site_status").select("fresh_at").eq("id", 1).maybeSingle()).data?.fresh_at ?? null,
    staleTime: 60_000,
  });
}

export function LiveStatus({ className = "" }: { className?: string }) {
  const { t } = useI18n();
  const [open, setOpen] = useState<boolean | null>(null);
  const fresh = useFreshAt();
  useEffect(() => {
    const tick = () => setOpen(isOpenAt(new Date()));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {open !== null && (
        <span className={`inline-flex items-center gap-2 rounded-md border-2 px-3 py-1 font-display text-sm uppercase ${open ? "border-success bg-success text-success-foreground" : "border-background/60 bg-foreground/60 text-background"}`}>
          <span className={`h-2.5 w-2.5 rounded-full ${open ? "animate-pulse bg-success-foreground" : "bg-background/60"}`} />
          {open ? t.open : t.closed}
        </span>
      )}
      {fresh.data && (
        <span className="inline-flex items-center gap-1.5 rounded-md bg-mustard px-3 py-1 font-bold text-mustard-foreground">
          <Flame className="h-4 w-4" />{t.fresh} <span className="font-hand text-xl leading-none">{fresh.data}</span>
        </span>
      )}
    </div>
  );
}

export function Footer() {
  const { t, lang } = useI18n();
  return (
    <footer className="kraft-dark pb-28 pt-12 text-background md:pb-12">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 md:grid-cols-3">
        <div>
          <p className="enamel inline-block px-3 py-1 text-xl">Майстори Пекари</p>
          <p className="mt-3 opacity-80">{t.footer}</p>
        </div>
        <div className="space-y-2 opacity-90">
          <p className="flex gap-2"><MapPin className="h-5 w-5 shrink-0" />{BUSINESS.address[lang]}</p>
          <a href={BUSINESS.phoneHref} className="flex gap-2"><Phone className="h-5 w-5" />{BUSINESS.phone}</a>
        </div>
        <Hours dark />
      </div>
      <p className="mt-10 text-center text-sm opacity-60">© {new Date().getFullYear()} Майстори Пекари · Младост 4</p>
    </footer>
  );
}

export function MobileBar() {
  const { t } = useI18n();
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex gap-3 border-t-4 border-primary bg-background p-3 md:hidden">
      <a href={BUSINESS.phoneHref} className="btn btn-outline flex-1"><Phone className="h-5 w-5" />{t.call}</a>
      <Link to="/menu" hash="order" className="btn btn-primary flex-1"><ShoppingBag className="h-5 w-5" />{t.order}</Link>
    </div>
  );
}

export function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e?.isIntersecting) {
        el.classList.add("in");
        io.disconnect();
      }
    }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}

export function Price({ eur, bgn, className = "" }: { eur: number; bgn: number; className?: string }) {
  return (
    <span className={`inline-flex items-baseline gap-2 ${className}`}>
      <span className="font-hand text-3xl leading-none text-primary">{fmt(eur)}</span>
      <span className="text-sm text-muted-foreground">{fmtBgn(bgn)}</span>
    </span>
  );
}

export function ProductRow({ p }: { p: Product }) {
  const { add } = useCart();
  const { t, lang } = useI18n();
  return (
    <article className="flex items-center gap-4 border-b-2 border-dashed border-foreground/25 py-4">
      <img src={p.image} alt={p.name[lang]} loading="lazy" width={96} height={96} className="h-20 w-20 shrink-0 rounded-md border-2 border-foreground object-cover md:h-24 md:w-24" />
      <div className="min-w-0 flex-1">
        <h3 className="font-display text-lg uppercase leading-tight">{p.name[lang]}</h3>
        <p className="text-sm text-muted-foreground">{p.desc[lang]}</p>
        <Price eur={p.price} bgn={p.bgn} className="mt-1" />
      </div>
      <button className="btn btn-mustard shrink-0 px-4 py-2 text-sm" onClick={() => { add(p.id); toast.success(`${p.name[lang]} ✓`); }}>
        {t.menu.add}
      </button>
    </article>
  );
}

export function Hours({ dark = false }: { dark?: boolean }) {
  const { t } = useI18n();
  const order = [1, 2, 3, 4, 5, 6, 0];
  return (
    <ul className="space-y-0.5">
      {order.map((d) => (
        <li key={d} className={`flex justify-between gap-4 border-b border-dashed py-1.5 ${dark ? "border-background/25" : "border-foreground/25"}`}>
          <span>{t.hours.days[d]}</span>
          <span className="font-bold">{HOURS[d]![0]} – {HOURS[d]![1]}</span>
        </li>
      ))}
    </ul>
  );
}

export function MapEmbed() {
  return <iframe title="Map – Майстори Пекари" src={BUSINESS.mapSrc} loading="lazy" className="h-72 w-full rounded-md border-4 border-foreground md:h-full md:min-h-80" />;
}

export function seo(title: string, description: string) {
  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ];
}

export function Field({ label, name, type = "text", error, placeholder, defaultValue }: { label: string; name: string; type?: string; error?: string | undefined; placeholder?: string; defaultValue?: string }) {
  return (
    <label className="block text-sm font-bold">
      {label}
      <input name={name} type={type} maxLength={200} placeholder={placeholder} defaultValue={defaultValue} className="field mt-1 font-normal" />
      {error && <span className="mt-1 block text-destructive">{error}</span>}
    </label>
  );
}
