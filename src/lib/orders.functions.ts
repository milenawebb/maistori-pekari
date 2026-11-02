import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { findProduct, unitPrice, validQty } from "./bakery";
import { isFreeOrder, slotsFor, sofiaToIso, STAMPS_FOR_FREE } from "./hours";

const phoneRe = /^[+\d\s()-]{8,20}$/;
export const normPhone = (p: string) => {
  const d = p.replace(/\D/g, "");
  if (d.startsWith("359")) return "+" + d;
  if (d.startsWith("0")) return "+359" + d.slice(1);
  return "+" + d;
};

const orderSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().regex(phoneRe),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  notes: z.string().trim().max(500).optional(),
  lang: z.enum(["bg", "en"]),
  items: z.array(z.object({ id: z.string(), variant: z.string().optional(), qty: z.number().min(0.5).max(100) })).min(1).max(40),
});

export const placeOrder = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => orderSchema.parse(d))
  .handler(async ({ data }) => {
    if (!slotsFor(data.date, new Date()).includes(data.time)) throw new Error("SLOT_UNAVAILABLE");
    const lines = data.items.map((i) => {
      const p = findProduct(i.id);
      const u = p && unitPrice(p, i.variant);
      if (!p || !u || !validQty(p, i.qty)) throw new Error("BAD_ITEM");
      const v = p.variants?.find((x) => x.id === i.variant);
      return { id: p.id, name: p.name.bg + (v ? ` (${v.name.bg})` : "") + (p.unit === "kg" ? " /кг" : ""), qty: i.qty, price: u.eur };
    });
    const total = Math.round(lines.reduce((s, l) => s + l.price * l.qty, 0) * 100) / 100;
    const phone = normPhone(data.phone);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: stamps, error: se } = await supabaseAdmin.rpc("add_stamp", { _phone: phone });
    if (se) throw new Error(se.message);
    const free = isFreeOrder(stamps as number);

    const { data: row, error } = await supabaseAdmin
      .from("orders")
      .insert({ name: data.name, phone, pickup_at: sofiaToIso(data.date, data.time), items: lines, total_eur: total, free_mekitsa: free, notes: data.notes || null, lang: data.lang })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id, total, stamps: (stamps as number) % STAMPS_FOR_FREE, free, date: data.date, time: data.time };
  });

const subSchema = z.object({
  company: z.string().trim().min(2).max(120),
  contact_name: z.string().trim().min(2).max(100),
  phone: z.string().trim().regex(phoneRe),
  email: z.string().trim().email().max(255),
  people: z.number().int().min(3).max(500),
  day: z.enum(["friday", "thursday", "wednesday", "tuesday", "monday"]),
  address: z.string().trim().min(3).max(200),
  notes: z.string().trim().max(1000).optional(),
});

export const subscribeOffice = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => subSchema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("office_subscriptions").insert({ ...data, phone: normPhone(data.phone), notes: data.notes || null });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
