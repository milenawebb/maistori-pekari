import { createFileRoute } from "@tanstack/react-router";
import { Phone, Mail, MapPin, MessageCircle, Facebook } from "lucide-react";
import { BUSINESS } from "@/lib/bakery";
import { useI18n } from "@/lib/i18n";
import { Hours, LiveStatus, MapEmbed, seo } from "@/components/site";

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
    <div className="mx-auto max-w-6xl px-5 py-12">
      <h1 className="enamel px-4 py-2 text-3xl md:text-4xl">{t.contacts.title}</h1>
      <LiveStatus className="mt-4" />
      <div className="mt-8 grid gap-10 md:grid-cols-2">
        <div className="space-y-4">
          <a href={BUSINESS.phoneHref} className="btn btn-primary w-full text-lg"><Phone className="h-5 w-5" />{BUSINESS.phone}</a>
          <a href={BUSINESS.viber} className="btn btn-mustard w-full"><MessageCircle className="h-5 w-5" />{t.contacts.viber}</a>
          <div className="paper space-y-3 p-6">
            <p className="flex gap-3"><MapPin className="h-5 w-5 text-primary" />{BUSINESS.address[lang]}</p>
            <a href={`mailto:${BUSINESS.email}`} className="flex gap-3"><Mail className="h-5 w-5 text-primary" />{BUSINESS.email}</a>
            <a href={BUSINESS.facebook} target="_blank" rel="noreferrer" className="flex gap-3"><Facebook className="h-5 w-5 text-primary" />Facebook</a>
          </div>
          <div className="paper p-6">
            <h2 className="mb-2 text-xl">{t.hours.title}</h2>
            <Hours />
          </div>
        </div>
        <MapEmbed />
      </div>
    </div>
  );
}
