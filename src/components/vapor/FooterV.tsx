import Link from "next/link";
import { SITE, DISCLAIMER } from "@/lib/vape";
import { DropletIcon } from "@/components/vapor/VIcons";

export function FooterV() {
  const cols: { t: string; links: [string, string][] }[] = [
    {
      t: "دسترسی سریع",
      links: [
        ["خانه", "/"],
        ["دسته‌بندی‌ها", "/categories"],
        ["فروشگاه", "/shop"],
        ["جدیدترین‌ها", "/shop?sort=newest"],
      ],
    },
    {
      t: "خدمات",
      links: [
        ["پیگیری سفارش", "/account"],
        ["سبد خرید", "/cart"],
        ["تکمیل خرید", "/checkout"],
        ["حساب کاربری", "/account"],
      ],
    },
    {
      t: "خرید مطمئن",
      links: [
        ["ضمانت اصالت کالا", "/categories"],
        ["راهنمای انتخاب", "/categories"],
        ["پرداخت در محل", "/checkout"],
        ["تماس: ۰۲۱-۹۱۰۰۲۲۳۳", "tel:02191002233"],
      ],
    },
  ];

  return (
    <footer className="mt-16 border-t border-white/8 bg-[#0b0b0f]">
      <div className="wrap grid gap-10 py-12 md:grid-cols-[1.3fr_repeat(3,1fr)]">
        <div>
          <Link href="/" className="flex items-center gap-2.5">
            <span className="text-vio"><DropletIcon size={22} /></span>
            <span dir="ltr" className="text-[15px] font-extrabold tracking-[0.3em] text-snow">{SITE.latin}</span>
          </Link>
          <p className="mt-4 max-w-xs text-[12.5px] leading-6 text-dim">
            فروشگاه تخصصی ویپ، سالت و پاد — فقط با کالای اورجینال و هولوگرام‌دار. {SITE.tagline}.
          </p>
          <p className="mt-4 text-[12px] font-bold text-mist" dir="ltr">{SITE.phone}</p>
        </div>
        {cols.map((c) => (
          <nav key={c.t} aria-label={c.t}>
            <p className="mb-4 text-[12px] font-extrabold text-snow">{c.t}</p>
            <ul className="space-y-2.5">
              {c.links.map(([l, h]) => (
                <li key={l}>
                  <Link href={h} className="text-[12.5px] text-dim transition-colors hover:text-vio">{l}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-white/8 px-5 py-6">
        <p className="mx-auto max-w-3xl text-center text-[10.5px] leading-5 text-dim/80">{DISCLAIMER}</p>
        <p className="mt-3 text-center text-[11px] text-dim">
          © ۱۴۰۴ {SITE.name} — کلیه حقوق محفوظ است. فروش فقط به افراد بالای ۱۸ سال.
        </p>
      </div>
    </footer>
  );
}
