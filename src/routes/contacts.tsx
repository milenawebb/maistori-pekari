import { createFileRoute } from "@tanstack/react-router";
import { Phone, Mail, MapPin, MessageCircle, Facebook } from "lucide-react";
import { BUSINESS } from "@/lib/bakery";
import { Hours, MapEmbed, seo } from "@/components/site";

export const Route = createFileRoute("/contacts")({
  head: () => ({
    meta: seo(
      "Контакти – пекарна Младост 4, София | Майстори Пекари",
      "Адрес, телефон, Viber и работно време на пекарна Майстори Пекари в ж.к. Младост 4, бл. 459, София.",
    ),
  }),
  component: Contacts,
});

function Contacts() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <h1 className="text-4xl font-bold">Контакти</h1>
      <div className="mt-8 grid gap-10 md:grid-cols-2">
        <div className="space-y-4">
          <a href={BUSINESS.phoneHref} className="btn btn-primary w-full text-lg"><Phone className="h-5 w-5" />{BUSINESS.phone}</a>
          <a href={BUSINESS.viber} className="btn btn-honey w-full"><MessageCircle className="h-5 w-5" />Пишете ни във Viber</a>
          <div className="space-y-3 rounded-3xl bg-card p-6 shadow-warm">
            <p className="flex gap-3"><MapPin className="h-5 w-5 text-terracotta" />{BUSINESS.address}</p>
            <a href={`mailto:${BUSINESS.email}`} className="flex gap-3"><Mail className="h-5 w-5 text-terracotta" />{BUSINESS.email}</a>
            <a href={BUSINESS.facebook} target="_blank" rel="noreferrer" className="flex gap-3"><Facebook className="h-5 w-5 text-terracotta" />Facebook</a>
          </div>
          <div className="rounded-3xl bg-card p-6 shadow-warm">
            <h2 className="mb-2 text-xl font-bold">Работно време</h2>
            <Hours />
          </div>
        </div>
        <MapEmbed />
      </div>
    </div>
  );
}
