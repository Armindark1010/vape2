"use client";

import { useState } from "react";
import { Button, Field } from "@/components/ui";
import { emailOk } from "@/lib/utils";
import { IcCheck, IcMail } from "@/components/icons";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "Order support", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "loading" | "ok">("idle");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (form.name.trim().length < 2) errs.name = "Please add your name.";
    if (!emailOk(form.email)) errs.email = "A valid email helps us reply.";
    if (form.message.trim().length < 10) errs.message = "Tell us a little more — at least 10 characters.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setState("loading");
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!r.ok) throw new Error();
      setState("ok");
    } catch {
      setState("idle");
      setErrors({ message: "Something went wrong — please try again." });
    }
  }

  if (state === "ok") {
    return (
      <div className="fade-in card-surface flex flex-col items-center rounded-xl px-8 py-16 text-center">
        <span className="mb-6 grid h-16 w-16 place-items-center rounded-full border border-success/40 bg-success/10 text-success">
          <IcCheck size={26} sw={2.2} />
        </span>
        <h2 className="font-display text-2xl text-cream">Message received</h2>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
          Thanks, {form.name.split(" ")[0]}. We reply to everything within one business day — usually much faster.
        </p>
        <Button variant="outline" className="mt-8" onClick={() => setState("idle")}>
          Send another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card-surface space-y-5 rounded-xl p-6 md:p-8" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" error={errors.name}>
          <input className="input" value={form.name} onChange={set("name")} placeholder="Your name" autoComplete="name" />
        </Field>
        <Field label="Email" error={errors.email}>
          <input className="input" type="email" value={form.email} onChange={set("email")} placeholder="you@quiet.com" autoComplete="email" />
        </Field>
      </div>
      <Field label="Subject">
        <select className="input" value={form.subject} onChange={set("subject")}>
          {["Order support", "Repair request", "Returns", "Wholesale / B2B", "Press", "Something else"].map((s) => (
            <option key={s} className="bg-panel">
              {s}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Message" error={errors.message}>
        <textarea
          className="input min-h-[140px] resize-y"
          value={form.message}
          onChange={set("message")}
          placeholder="Order numbers, serial numbers and a few details help a lot."
        />
      </Field>
      <Button type="submit" size="lg" loading={state === "loading"}>
        <IcMail size={16} /> Send message
      </Button>
    </form>
  );
}
