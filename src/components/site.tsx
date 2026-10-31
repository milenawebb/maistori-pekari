import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Phone, ShoppingBag, Menu, X, Clock, MapPin } from "lucide-react";
import { BUSINESS, fmt, type Product } from "@/lib/bakery";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";

const NAV = [
  { to: "/", label: "Начало" },
  { to: "/menu", label: "Меню" },
  { to: "/catering", label: "Кетъринг" },
  { to: "/contacts", label: "Контакти" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link to="/" className="font-serif text-xl font-bold">
          Майстори <span className="text-terracotta">Пекари</span>
        </Link>
        <nav className="hidden gap-7 md:flex">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className="font-semibold hover:text-terracotta" activeProps={{ className: "text-terracotta" }} activeOptions={{ exact: true }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/menu" hash="cart" className="relative rounded-full p-2 hover:bg-muted" aria-label="Количка">
            <ShoppingBag className="h-6 w-6" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-terracotta px-1 text-xs font-bold text-terracotta-foreground">{count}</span>
            )}
          </Link>
          <button className="rounded-full p-2 hover:bg-muted md:hidden" onClick={() => setOpen(!open)} aria-label="Меню">
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="flex flex-col border-t border-border px-5 py-3 md:hidden">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="py-3 font-serif text-lg">
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-foreground pb-28 pt-12 text-background md:pb-12">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 md:grid-cols-3">
        <div>
          <p className="font-serif text-2xl font-bold">Майстори Пекари</p>
          <p className="mt-2 opacity-75">Едновремешни мекици, пирожки и понички – ръчно, всяка сутрин.</p>
        </div>
        <div className="space-y-1 opacity-90">
          <p className="flex gap-2"><MapPin className="h-5 w-5 shrink-0" />{BUSINESS.address}</p>
          <a href={BUSINESS.phoneHref} className="flex gap-2"><Phone className="h-5 w-5" />{BUSINESS.phone}</a>
        </div>
        <div className="space-y-1 opacity-90">
          {BUSINESS.hours.map(([d, h]) => (
            <p key={d} className="flex gap-2"><Clock className="h-5 w-5 shrink-0" />{d}: {h}</p>
          ))}
        </div>
      </div>
      <p className="mt-10 text-center text-sm opacity-60">© {new Date().getFullYear()} Майстори Пекари · Младост 4, София</p>
    </footer>
  );
}

export function MobileBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex gap-3 border-t border-border bg-background/95 p-3 backdrop-blur md:hidden">
      <a href={BUSINESS.phoneHref} className="btn btn-outline flex-1"><Phone className="h-5 w-5" />Обади се</a>
      <Link to="/menu" className="btn btn-primary flex-1"><ShoppingBag className="h-5 w-5" />Поръчай</Link>
    </div>
  );
}

export function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          el.classList.add("in");
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}

export function ProductCard({ p }: { p: Product }) {
  const { add } = useCart();
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl bg-card shadow-warm">
      <img src={p.image} alt={p.name} loading="lazy" width={1024} height={1024} className="aspect-[4/3] w-full object-cover" />
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-lg font-bold">{p.name}</h3>
        <p className="mt-1 flex-1 text-sm text-muted-foreground">{p.desc}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="font-serif text-xl font-bold text-terracotta">{fmt(p.price)}</span>
          <button
            className="btn btn-honey px-4 py-2 text-sm"
            onClick={() => {
              add(p.id);
              toast.success(`${p.name} – добавено в количката`);
            }}
          >
            Добави
          </button>
        </div>
      </div>
    </article>
  );
}

export function Hours() {
  return (
    <ul className="space-y-1">
      {BUSINESS.hours.map(([d, h]) => (
        <li key={d} className="flex justify-between gap-4 border-b border-border/60 py-2">
          <span>{d}</span>
          <span className="font-semibold">{h}</span>
        </li>
      ))}
    </ul>
  );
}

export function MapEmbed() {
  return (
    <iframe
      title="Карта – Майстори Пекари"
      src={BUSINESS.mapSrc}
      loading="lazy"
      className="h-72 w-full rounded-2xl border-0 shadow-warm md:h-full md:min-h-80"
    />
  );
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

export function Field({ label, name, type = "text", error }: { label: string; name: string; type?: string; error?: string | undefined }) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <input name={name} type={type} maxLength={200} className="field mt-1 font-normal" />
      {error && <span className="mt-1 block text-destructive">{error}</span>}
    </label>
  );
}
