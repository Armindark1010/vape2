import Link from "next/link";
import { IcLogo, IcInstagram, IcX, IcYoutube } from "@/components/icons";
import { FOOTER_LINKS } from "@/lib/content";

export function Footer() {
  return (
    <footer className="hairline-t mt-28 bg-[#08080a]">
      <div className="wrap grid gap-12 py-16 md:grid-cols-[1.4fr_repeat(4,1fr)] md:gap-8">
        <div className="max-w-xs">
          <Link href="/" className="flex items-center gap-2.5" aria-label="NOCTURNE home">
            <span className="text-gold"><IcLogo size={22} /></span>
            <span className="font-display text-[15px] tracking-[0.4em] text-cream">NOCTURNE</span>
          </Link>
          <p className="mt-5 text-sm leading-relaxed text-muted">
            Objects for the quiet hours. Designed in Copenhagen, built to be repaired, kept and occasionally inherited.
          </p>
          <div className="mt-6 flex gap-1.5">
            {[{ I: IcInstagram, l: "Instagram" }, { I: IcX, l: "X" }, { I: IcYoutube, l: "YouTube" }].map(({ I, l }) => (
              <a
                key={l}
                href="#"
                aria-label={l}
                className="grid h-10 w-10 place-items-center rounded-full border border-line text-muted transition-all duration-300 hover:border-gold/40 hover:text-cream"
              >
                <I size={16} />
              </a>
            ))}
          </div>
        </div>

        {FOOTER_LINKS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <p className="mb-5 text-[11px] font-semibold tracking-[0.24em] text-faint uppercase">{col.title}</p>
            <ul className="space-y-3">
              {col.links.map((l) => (
                <li key={l.href + l.label}>
                  <Link href={l.href} className="text-sm text-muted transition-colors duration-300 hover:text-cream">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="hairline-t">
        <div className="wrap flex flex-col items-center justify-between gap-3 py-6 text-[11px] tracking-[0.08em] text-faint md:flex-row">
          <p>© 2026 NOCTURNE ApS · CVR 44 22 10 87 · Designed in Copenhagen</p>
          <div className="flex items-center gap-5">
            <span>Visa · Mastercard · Amex · Klarna</span>
            <Link href="/privacy" className="hover:text-muted">Privacy</Link>
            <Link href="/terms" className="hover:text-muted">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
