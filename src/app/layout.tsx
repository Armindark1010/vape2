import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { VapeProvider } from "@/store/vapeStore";
import { BottomNav } from "@/components/vapor/BottomNav";
import { AgeGate } from "@/components/vapor/AgeGate";
import { CartSheet } from "@/components/vapor/CartSheet";
import { FooterV } from "@/components/vapor/FooterV";
import { Toasts } from "@/components/vapor/Toasts";
import { SITE } from "@/lib/vape";

const vazir = Vazirmatn({
  variable: "--font-vazir",
  subsets: ["latin", "arabic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: {
    default: `${SITE.name} | فروشگاه تخصصی ویپ، سالت و پاد — ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description:
    "فروشگاه تخصصی ویپورا — خرید آنلاین پاد یک‌بارمصرف، سالت نیکوتین، مود و لوازم جانبی اصل با هولوگرام. ارسال فوری تهران، پرداخت در محل، ضمانت اصالت کالا.",
  openGraph: {
    type: "website",
    locale: "fa_IR",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: "پاد یک‌بارمصرف، سالت نیکوتین و مود اصل با ضمانت اصالت و ارسال فوری.",
    images: [
      {
        url: "https://images.pexels.com/photos/19344605/pexels-photo-19344605.jpeg?auto=compress&cs=tinysrgb&w=1200",
        width: 800,
        height: 1200,
        alt: "محصولات ویپورا",
      },
    ],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect width='24' height='24' rx='7' fill='%2309090b'/%3E%3Cpath d='M12 4.5s5.2 5.4 5.2 9.2a5.2 5.2 0 0 1-10.4 0C6.8 9.9 12 4.5 12 4.5Z' fill='%23a78bfa'/%3E%3C/svg%3E",
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={vazir.variable}>
      <body className="font-sans antialiased">
        <VapeProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 focus:z-[130] focus:rounded-xl focus:bg-vio focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-ink"
          >
            پرش به محتوا
          </a>
          <BottomNav />
          <main id="main" className="pb-[92px] lg:pb-0">
            {children}
          </main>
          <FooterV />
          <CartSheet />
          <AgeGate />
          <Toasts />
        </VapeProvider>
      </body>
    </html>
  );
}
