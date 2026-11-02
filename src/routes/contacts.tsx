import { createFileRoute } from "@tanstack/react-router";
import { Phone, Mail, MapPin, MessageCircle, Facebook } from "lucide-react";
import { BUSINESS } from "@/lib/bakery";
import { useI18n } from "@/lib/i18n";
import { HeaderSpacer, Hours, LiveStatus, MapEmbed, seo } from "@/components/site";

export const Route = createFileRoute("/contacts")({
  head: () => ({
    meta: seo(
      "Контакти – закусвалня Младост 4, София | Майстори Пекари",
      "Адрес, телефон, Viber и работно време на Майстори Пекари в ж.к. Младост 4, бл. 459, София.",
    ),
  }),
  component: Contacts,
});

function Contacts() {
  const { t, lang } = useI18n();
  return (
    <>
    <HeaderSpacer />
    <div className="mx-auto max-w-[1200px] px-5 py-14 md:py-20">
      <h1 className="text-5xl">{t.contacts.title}</h1>
      <LiveStatus className="mt-6" />
      <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-16">
        <div className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href={BUSINESS.phoneHref} className="btn btn-primary flex-1"><Phone className="h-4 w-4" />{BUSINESS.phone}</a>
            <a href={BUSINESS.viber} className="btn btn-secondary flex-1"><MessageCircle className="h-4 w-4" />{t.contacts.viber}</a>
          </div>
          <div className="card space-y-4 p-6">
            <p className="flex gap-3"><MapPin className="h-5 w-5 text-primary" strokeWidth={1.5} />{BUSINESS.address[lang]}</p>
            <a href={`mailto:${BUSINESS.email}`} className="flex gap-3"><Mail className="h-5 w-5 text-primary" strokeWidth={1.5} />{BUSINESS.email}</a>
            <a href={BUSINESS.facebook} target="_blank" rel="noreferrer" className="flex gap-3"><Facebook className="h-5 w-5 text-primary" strokeWidth={1.5} />Facebook</a>
          </div>
          <div className="card p-6">
            <h2 className="mb-3 text-2xl">{t.hours.title}</h2>
            <Hours />
          </div>
        </div>
        <MapEmbed />
      </div>
    </div>
    </>
  );
}
