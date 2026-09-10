"use client";

import { Button } from "@/components/ui";
import { IcRefresh } from "@/components/icons";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="wrap flex min-h-[60vh] flex-col items-center justify-center py-32 text-center">
      <p className="text-[11px] font-semibold tracking-[0.34em] text-gold uppercase">Something went quiet</p>
      <h1 className="mt-5 font-display text-4xl text-cream md:text-5xl">
        The lights <em className="text-goldsoft">flickered.</em>
      </h1>
      <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
        {error.message || "An unexpected error occurred."} If this keeps happening, our support team is one email away.
      </p>
      <div className="mt-10 flex gap-4">
        <Button onClick={reset}>
          <IcRefresh size={15} /> Try again
        </Button>
        <Button href="/" variant="outline">
          Back home
        </Button>
      </div>
    </div>
  );
}
