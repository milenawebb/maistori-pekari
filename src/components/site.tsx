import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Phone, ShoppingBag, Menu, X, MapPin } from "lucide-react";
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
    <div className="flex items-center gap-1 text-xs font-semibold tracking-wider">
      {(["bg", "en"] as const).map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && <span className="opacity-40">/</span>}
          <button onClick={() => setLang(l)} aria-pressed={lang === l} className={`uppercase transition-opacity ${lang === l ? "opacity-100" : "opacity-50 hover:opacity-80"}`}>{l}</button>
        </span>
      ))}
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const { count } = useCart();
  const { t } = useI18n();
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const overHero = (pathname === "/" || pathname === "/catering") && !scrolled && !open;
  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${overHero ? "bg-transparent text-ink-foreground" : "border-b border-border bg-card/95 text-foreground backdrop-blur"}`}>
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-4 px-5 md:h-20">
        <Link to="/" className="font-display text-xl font-medium tracking-tight md:text-2xl">Майстори Пекари</Link>
        <div className="flex items-center gap-5 md:gap-8">
          <nav className="hidden gap-8 text-sm font-medium md:flex">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} className="opacity-80 transition-opacity hover:opacity-100" activeProps={{ className: "!opacity-100" }} activeOptions={{ exact: true }}>{t.nav[n.k]}</Link>
            ))}
          </nav>
          <LangToggle />
          <Link to="/menu" hash="order" className="relative" aria-label={t.cart}>
            <ShoppingBag className="h-5 w-5" strokeWidth={1.6} />
            {count > 0 && <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">{count}</span>}
          </Link>
          <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="h-5 w-5" strokeWidth={1.6} /> : <Menu className="h-5 w-5" strokeWidth={1.6} />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="flex flex-col border-t border-border bg-card px-5 py-2 md:hidden">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="border-b border-border py-4 font-display text-xl last:border-0">{t.nav[n.k]}</Link>
          ))}
        </nav>
      )}
    </header>
  );
}

/** Spacer for pages without a full-bleed photo under the fixed header. */
export const HeaderSpacer = () => <div className="h-16 md:h-20" />;

export function useFreshAt() {
  return useQuery({
    queryKey: ["site_status"],
    queryFn: async () => (await supabase.from("site_status").select("fresh_at").eq("id", 1).maybeSingle()).data?.fresh_at ?? null,
    staleTime: 60_000,
  });
}

export function LiveStatus({ className = "", overlay = false }: { className?: string; overlay?: boolean }) {
  const { t } = useI18n();
  const [open, setOpen] = useState<boolean | null>(null);
  const fresh = useFreshAt();
  useEffect(() => {
    const tick = () => setOpen(isOpenAt(new Date()));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);
  if (open === null) return <div className={`h-8 ${className}`} />;
  return (
    <div className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium ${overlay ? "bg-card/15 text-ink-foreground ring-1 ring-card/30 backdrop-blur-md" : "bg-tint text-foreground"} ${className}`}>
      <span className={`h-2 w-2 rounded-full ${open ? "bg-success" : "bg-muted-foreground"}`} />
      <span>{open ? t.open : t.closed}</span>
      {fresh.data && <span className="opacity-80">· {t.freshShort} {fresh.data}</span>}
    </div>
  );
}

export function Footer() {
  const { t, lang } = useI18n();
  return (
    <footer className="bg-ink pb-32 pt-16 text-ink-foreground md:pb-16 md:pt-24">
      <div className="mx-auto grid max-w-[1200px] gap-12 px-5 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl">Майстори Пекари</p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed opacity-70">{t.footer}</p>
        </div>
        <div className="space-y-3 text-sm opacity-80">
          <p className="flex gap-3"><MapPin className="h-4 w-4 shrink-0" strokeWidth={1.6} />{BUSINESS.address[lang]}</p>
          <a href={BUSINESS.phoneHref} className="flex gap-3"><Phone className="h-4 w-4" strokeWidth={1.6} />{BUSINESS.phone}</a>
        </div>
        <div className="text-sm opacity-80"><Hours dark /></div>
      </div>
      <p className="mx-auto mt-16 max-w-[1200px] border-t border-ink-foreground/10 px-5 pt-8 text-xs opacity-50">© {new Date().getFullYear()} Майстори Пекари · Младост 4, София</p>
    </footer>
  );
}

export function MobileBar() {
  const { t } = useI18n();
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex gap-3 border-t border-border bg-card p-3 md:hidden">
      <a href={BUSINESS.phoneHref} className="btn btn-secondary flex-1"><Phone className="h-4 w-4" strokeWidth={1.8} />{t.call}</a>
      <Link to="/menu" hash="order" className="btn btn-primary flex-1"><ShoppingBag className="h-4 w-4" strokeWidth={1.8} />{t.order}</Link>
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
    }, { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}

export function Price({ eur, bgn, className = "" }: { eur: number; bgn: number; className?: string }) {
  return (
    <span className={`inline-flex items-baseline gap-2 ${className}`}>
      <span className="font-semibold">{fmt(eur)}</span>
      <span className="text-xs text-muted-foreground">{fmtBgn(bgn)}</span>
    </span>
  );
}

export function ProductCard({ p }: { p: Product }) {
  const { add } = useCart();
  const { t, lang } = useI18n();
  return (
    <article className="group flex flex-col">
      <div className="overflow-hidden rounded-[18px] bg-tint">
        <img src={p.image} alt={p.name[lang]} loading="lazy" width={1024} height={768} className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
      </div>
      <div className="flex flex-1 flex-col pt-4">
        <h3 className="text-xl">{p.name[lang]}</h3>
        <p className="mt-1 flex-1 text-sm text-muted-foreground">{p.desc[lang]}</p>
        <div className="mt-4 flex items-center justify-between">
          <Price eur={p.price} bgn={p.bgn} />
          <button className="btn btn-secondary px-4 py-2 text-sm" onClick={() => { add(p.id); toast.success(`${p.name[lang]} ✓`); }}>{t.menu.add}</button>
        </div>
      </div>
    </article>
  );
}

export function Hours({ dark = false }: { dark?: boolean }) {
  const { t } = useI18n();
  const order = [1, 2, 3, 4, 5, 6, 0];
  return (
    <ul>
      {order.map((d) => (
        <li key={d} className={`flex justify-between gap-4 border-b py-2 text-sm last:border-0 ${dark ? "border-ink-foreground/10" : "border-border"}`}>
          <span className={dark ? "" : "text-muted-foreground"}>{t.hours.days[d]}</span>
          <span className="font-medium tabular-nums">{HOURS[d]![0]} – {HOURS[d]![1]}</span>
        </li>
      ))}
    </ul>
  );
}

export function MapEmbed() {
  return <iframe title="Map – Майстори Пекари" src={BUSINESS.mapSrc} loading="lazy" className="h-80 w-full rounded-[18px] border-0 shadow-soft md:h-full md:min-h-96" />;
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
    <label className="block text-sm font-medium">
      {label}
      <input name={name} type={type} maxLength={200} placeholder={placeholder} defaultValue={defaultValue} className="field mt-1.5 font-normal" />
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}
