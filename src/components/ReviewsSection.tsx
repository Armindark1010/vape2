"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Product, Review } from "@/lib/types";
import { useStore } from "@/store/store";
import { Stars, Button, Field } from "@/components/ui";
import { IcStar, IcChevronDown } from "@/components/icons";
import { formatDate, initials, cn } from "@/lib/utils";

export function ReviewsSection({ product: p, reviews }: { product: Product; reviews: Review[] }) {
  const [writing, setWriting] = useState(false);
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useStore();
  const router = useRouter();

  const dist = useMemo(() => {
    const d = [0, 0, 0, 0, 0];
    reviews.forEach((r) => {
      d[Math.min(4, Math.max(0, r.rating - 1))] += 1;
    });
    return d;
  }, [reviews]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (author.trim().length < 2) errs.author = "Please tell us who you are.";
    if (body.trim().length < 12) errs.body = "A few more words, please — at least 12 characters.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSubmitting(true);
    try {
      const r = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: p.id, author: author.trim(), title: title.trim(), body: body.trim(), rating }),
      });
      if (!r.ok) throw new Error("failed");
      toast({ title: "Thank you", body: "Your review is live.", kind: "success" });
      setWriting(false);
      router.refresh();
    } catch {
      toast({ title: "Couldn't submit", body: "Please try again in a moment.", kind: "error" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[320px_1fr]">
      {/* summary */}
      <div>
        <div className="card-surface rounded-xl p-6">
          <div className="flex items-end gap-3">
            <span className="font-display text-5xl text-cream tnum">{p.rating.toFixed(1)}</span>
            <div className="pb-1.5">
              <Stars value={p.rating} size={14} />
              <p className="mt-1 text-xs text-faint tnum">{p.reviewCount} verified reviews</p>
            </div>
          </div>
          <div className="mt-6 space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const n = dist[star - 1];
              const pct = reviews.length ? (n / reviews.length) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-3">
                  <span className="w-3 text-right text-xs text-muted tnum">{star}</span>
                  <IcStar size={11} filled className="text-gold" />
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
                    <div className="h-full rounded-full bg-gradient-to-r from-gold to-goldsoft" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-6 text-xs text-faint tnum">{n}</span>
                </div>
              );
            })}
          </div>
        </div>
        <Button variant="outline" className="mt-4 w-full" onClick={() => setWriting((w) => !w)} aria-expanded={writing}>
          {writing ? "Cancel" : "Write a review"}
        </Button>
      </div>

      {/* list + form */}
      <div>
        {writing && (
          <form onSubmit={submit} className="card-surface fade-in mb-8 space-y-4 rounded-xl p-6">
            <h3 className="font-display text-xl text-cream">Your review of the {p.name}</h3>
            <div className="flex items-center gap-1" role="radiogroup" aria-label="Your rating">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={rating === n}
                  aria-label={`${n} star${n > 1 ? "s" : ""}`}
                  onMouseEnter={() => setHover(n)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(n)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <IcStar size={24} filled={n <= (hover || rating)} className={n <= (hover || rating) ? "text-gold" : "text-line2"} />
                </button>
              ))}
              <span className="ml-2 text-sm text-muted tnum">{hover || rating} / 5</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name" error={errors.author}>
                <input className="input" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Your name" />
              </Field>
              <Field label="Title" hint="optional">
                <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Sum it up in a line" />
              </Field>
            </div>
            <Field label="Review" error={errors.body}>
              <textarea
                className="input min-h-[110px] resize-y"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="How has it been living in your room?"
              />
            </Field>
            <Button type="submit" loading={submitting}>
              Submit review
            </Button>
          </form>
        )}

        {reviews.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line2 p-10 text-center">
            <p className="font-display text-xl text-cream">No written reviews yet</p>
            <p className="mt-2 text-sm text-muted">The ratings above come from verified orders. Be the first to write one.</p>
          </div>
        ) : (
          <ul className="space-y-5">
            {reviews.map((r) => (
              <li key={r.id} className="card-surface rounded-xl p-6 transition-colors duration-300 hover:border-line2">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-gold/15 font-display text-sm text-goldsoft">
                      {initials(r.author)}
                    </span>
                    <div>
                      <p className="text-[13px] font-semibold text-cream">{r.author}</p>
                      <p className="text-[11px] text-faint">Verified purchase · {formatDate(r.createdAt)}</p>
                    </div>
                  </div>
                  <Stars value={r.rating} size={12} />
                </div>
                {r.title && <h4 className={cn("mt-4 text-[15px] font-semibold text-cream")}>{r.title}</h4>}
                <p className="mt-2 text-sm leading-relaxed text-muted">{r.body}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
