import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Field, HeaderSpacer } from "@/components/site";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Вход за собственика | Майстори Пекари" },
      { name: "description", content: "Вход за персонала на Майстори Пекари." },
      { property: "og:title", content: "Вход за собственика | Майстори Пекари" },
      { property: "og:description", content: "Вход за персонала на Майстори Пекари." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email")).trim();
    const password = String(f.get("password"));
    setBusy(true);
    setMsg("");
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return setMsg(error.message);
      nav({ to: "/admin" });
    } else {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } });
      setBusy(false);
      setMsg(error ? error.message : "Проверете имейла си, за да потвърдите акаунта. / Check your email to confirm.");
    }
  }

  return (
    <><HeaderSpacer /><section className="mx-auto max-w-sm px-5 py-16">
      <h1 className="text-4xl">{mode === "in" ? "Вход" : "Регистрация"}</h1>
      <p className="mt-3 text-sm text-muted-foreground">Само за собственика. Първият регистриран акаунт получава достъп до поръчките.</p>
      <form onSubmit={submit} className="card mt-6 space-y-3 p-5">
        <Field label="Имейл" name="email" type="email" />
        <Field label="Парола" name="password" type="password" />
        {msg && <p className="text-sm font-bold">{msg}</p>}
        <button disabled={busy} className="btn btn-primary w-full">{mode === "in" ? "Влез" : "Създай акаунт"}</button>
      </form>
      <button className="mt-4 text-sm underline" onClick={() => setMode(mode === "in" ? "up" : "in")}>
        {mode === "in" ? "Нямате акаунт? Регистрация" : "Имате акаунт? Вход"}
      </button>
    </section></>
  );
}
