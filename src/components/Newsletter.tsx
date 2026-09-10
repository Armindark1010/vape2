"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { emailOk } from "@/lib/utils";
import { IcCheck } from "@/components/icons";

export function Newsletter({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "ok" | "err">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!emailOk(email)) {
      setState("err");
      return;
    }
    setState("loading");
    try {
      const r = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setState(r.ok ? "ok" : "err");
    } catch {
      setState("err");
    }
  }

  if (state === "ok") {
    return (
      <div className="fade-in flex items-center gap-3 rounded-[10px] border border-success/30 bg-success/10 px-5 py-4 text-sm text-success">
        <IcCheck size={16} sw={2.4} />
        You're on the list. First dispatch arrives next Tuesday — quiet, as ever.
      </div>
    );
  }

  return (
    <form onSubmit={submit} className={compact ? "max-w-md" : "mx-auto max-w-md"} noValidate>
      <div className="flex gap-2">
        <label className="sr-only" htmlFor={`nl-${compact ? "c" : "f"}`}>
          Email address
        </label>
        <input
          id={`nl-${compact ? "c" : "f"}`}
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === "err") setState("idle");
          }}
          placeholder="you@quiet.com"
          className="input flex-1"
          autoComplete="email"
        />
        <Button type="submit" loading={state === "loading"}>
          Subscribe
        </Button>
      </div>
      {state === "err" && <p role="alert" className="mt-2 text-xs text-danger">Please enter a valid email address.</p>}
      <p className="mt-3 text-[11px] leading-relaxed text-faint">
        One email a week. No noise, no spam — unsubscribe with a single click.
      </p>
    </form>
  );
}
