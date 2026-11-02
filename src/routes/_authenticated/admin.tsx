import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { fmt } from "@/lib/bakery";
import { useFreshAt } from "@/components/site";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Поръчки | Майстори Пекари" },
      { name: "description", content: "Табло на собственика." },
      { property: "og:title", content: "Поръчки | Майстори Пекари" },
      { property: "og:description", content: "Табло на собственика." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

type Item = { name: string; qty: number };
const sofia = (iso: string) => new Date(iso).toLocaleString("bg-BG", { timeZone: "Europe/Sofia", weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

function Admin() {
  const qc = useQueryClient();
  const nav = useNavigate();
  const { user } = Route.useRouteContext();
  const role = useQuery({
    queryKey: ["is_admin", user.id],
    queryFn: async () => !!(await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle()).data,
  });
  const fresh = useFreshAt();
  const [freshInput, setFreshInput] = useState("");
  const orders = useQuery({
    queryKey: ["orders"],
    enabled: role.data === true,
    refetchInterval: 30_000,
    queryFn: async () => (await supabase.from("orders").select("*").gte("pickup_at", new Date(Date.now() - 6 * 3600_000).toISOString()).order("pickup_at")).data ?? [],
  });
  const subs = useQuery({
    queryKey: ["subs"],
    enabled: role.data === true,
    queryFn: async () => (await supabase.from("office_subscriptions").select("*").order("created_at", { ascending: false })).data ?? [],
  });

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    nav({ to: "/auth", replace: true });
  }

  async function saveFresh(value: string) {
    const { error } = await supabase.from("site_status").update({ fresh_at: value, updated_at: new Date().toISOString() }).eq("id", 1);
    if (error) return toast.error(error.message);
    toast.success("Записано");
    qc.invalidateQueries({ queryKey: ["site_status"] });
  }

  async function setStatus(id: string, status: string) {
    await supabase.from("orders").update({ status }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["orders"] });
  }

  if (role.isLoading) return <p className="p-10">…</p>;
  if (!role.data)
    return (
      <section className="mx-auto max-w-md px-5 py-16">
        <p>Този акаунт няма достъп до поръчките.</p>
        <button className="btn btn-outline mt-4" onClick={signOut}>Изход</button>
      </section>
    );

  const nowHHMM = new Date().toLocaleTimeString("bg-BG", { timeZone: "Europe/Sofia", hour: "2-digit", minute: "2-digit", hour12: false });

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-5 py-10">
      <div className="flex items-center justify-between">
        <h1 className="enamel px-4 py-2 text-2xl">Табло</h1>
        <button className="btn btn-outline" onClick={signOut}>Изход</button>
      </div>

      <section className="paper p-5">
        <h2 className="text-xl">Пресни мекици излязоха в…</h2>
        <p className="mt-1 text-sm text-muted-foreground">Сега на сайта: <span className="font-hand text-2xl">{fresh.data ?? "—"}</span></p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button className="btn btn-primary" onClick={() => saveFresh(nowHHMM)}>Току-що ({nowHHMM})</button>
          <input type="time" value={freshInput} onChange={(e) => setFreshInput(e.target.value)} className="field w-36" />
          <button className="btn btn-mustard" disabled={!freshInput} onClick={() => saveFresh(freshInput)}>Запиши</button>
        </div>
      </section>

      <section>
        <h2 className="text-xl">Поръчки за вземане</h2>
        {orders.data?.length === 0 && <p className="mt-2 text-muted-foreground">Няма предстоящи поръчки.</p>}
        <ul className="mt-3 space-y-3">
          {orders.data?.map((o) => (
            <li key={o.id} className={`paper p-4 ${o.status === "done" ? "opacity-50" : ""}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-display text-lg">{sofia(o.pickup_at)}</p>
                <p className="font-hand text-2xl text-primary">{fmt(Number(o.total_eur))}</p>
              </div>
              <p className="font-bold">{o.name} · <a href={`tel:${o.phone}`} className="underline">{o.phone}</a></p>
              <p className="text-sm">{(o.items as Item[]).map((i) => `${i.qty}× ${i.name}`).join(", ")}</p>
              {o.free_mekitsa && <p className="mt-1 text-sm font-bold text-primary">🎁 10-та поръчка – безплатна мекица</p>}
              {o.notes && <p className="mt-1 text-sm italic">{o.notes}</p>}
              <button className="btn btn-outline mt-2 px-3 py-1 text-xs" onClick={() => setStatus(o.id, o.status === "done" ? "new" : "done")}>
                {o.status === "done" ? "Върни" : "Взета ✓"}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl">Абонаменти за офис закуска</h2>
        {subs.data?.length === 0 && <p className="mt-2 text-muted-foreground">Още няма заявки.</p>}
        <ul className="mt-3 space-y-3">
          {subs.data?.map((s) => (
            <li key={s.id} className="paper p-4 text-sm">
              <p className="font-display text-base">{s.company} · {s.people} души · {s.day}</p>
              <p>{s.contact_name} · <a href={`tel:${s.phone}`} className="underline">{s.phone}</a> · {s.email}</p>
              <p>{s.address}</p>
              {s.notes && <p className="italic">{s.notes}</p>}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
