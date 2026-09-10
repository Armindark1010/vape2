"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useStore } from "@/store/store";
import { fmt, formatDate, cn } from "@/lib/utils";
import { AreaChart, BarChart } from "@/components/Charts";
import { Badge, Button, Stars } from "@/components/ui";
import {
  IcChart,
  IcBox,
  IcPackage,
  IcUsers,
  IcStar,
  IcTag,
  IcGrid,
  IcSliders,
  IcLogo,
  IcTrash,
  IcPlus,
  IcMinus,
  IcArrowRight,
} from "@/components/icons";

type Stats = {
  revenue: { m: string; total: number }[];
  ordersSeries: { m: string; n: number }[];
  recentOrders: {
    id: number;
    number: string;
    name: string;
    email: string;
    total: number;
    status: string;
    createdAt: string;
    items: { name: string; qty: number }[];
  }[];
  topProducts: { name: string; image: string | null; qty: number; revenue: number }[];
  lowStock: { id: number; name: string; stock: number; slug: string }[];
  byStatus: { status: string; n: number }[];
  kpi: { revenue30: number; orders30: number; customers: number; newCustomers30: number };
  customers: { email: string; name: string; orders: number; spent: number; last: string }[];
};

type Props = {
  tab: string;
  stats: Stats;
  stockProducts: { id: number; slug: string; name: string; stock: number; price: number; discountPrice: number | null }[];
  coupons: { id: number; code: string; description: string; percent: number | null; minSubtotal: number; active: boolean }[];
  reviews: { id: number; author: string; rating: number; title: string | null; body: string; productName: string; createdAt: string }[];
  products: {
    id: number;
    slug: string;
    name: string;
    price: number;
    discountPrice: number | null;
    rating: number;
    reviewCount: number;
    stock: number;
    featured: boolean;
    newArrival: boolean;
    bestSeller: boolean;
    createdAt: string;
  }[];
  categories: { name: string; slug: string; count: number; description: string | null }[];
};

const TABS = [
  { id: "overview", label: "Overview", icon: IcChart },
  { id: "products", label: "Products", icon: IcBox },
  { id: "orders", label: "Orders", icon: IcPackage },
  { id: "customers", label: "Customers", icon: IcUsers },
  { id: "reviews", label: "Reviews", icon: IcStar },
  { id: "coupons", label: "Coupons", icon: IcTag },
  { id: "inventory", label: "Inventory", icon: IcGrid },
  { id: "categories", label: "Categories", icon: IcGrid },
  { id: "settings", label: "Settings", icon: IcSliders },
] as const;

const STATUS_TONE: Record<string, "neutral" | "gold" | "success" | "danger" | "warn"> = {
  pending: "neutral",
  processing: "warn",
  shipped: "gold",
  delivered: "success",
  refunded: "danger",
};

export function AdminPanel(props: Props) {
  const { tab, stats } = props;
  const router = useRouter();
  const { toast } = useStore();
  const [busy, setBusy] = useState<string | null>(null);

  async function post(action: string, payload: Record<string, unknown>, key: string, msg: string) {
    setBusy(key);
    try {
      const r = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...payload }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error ?? "failed");
      toast({ title: msg, kind: "success" });
      router.refresh();
    } catch (e) {
      toast({ title: "Action failed", body: e instanceof Error ? e.message : undefined, kind: "error" });
    } finally {
      setBusy(null);
    }
  }

  const title = TABS.find((t) => t.id === tab)?.label ?? "Overview";

  return (
    <div className="flex min-h-screen">
      {/* sidebar */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-line bg-[#0b0b0e] p-5 lg:flex">
        <Link href="/admin" className="flex items-center gap-2.5 px-2 py-2">
          <span className="text-gold"><IcLogo size={22} /></span>
          <span className="font-display text-[13px] tracking-[0.3em] text-cream">NOCTURNE</span>
          <Badge tone="gold" className="ml-auto">Admin</Badge>
        </Link>
        <nav className="mt-8 flex-1 space-y-1" aria-label="Admin sections">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => router.replace(`/admin?tab=${t.id}`)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-[13px] font-medium transition-all duration-200",
                tab === t.id ? "bg-gold/12 text-goldsoft" : "text-muted hover:bg-white/[0.04] hover:text-cream"
              )}
              aria-current={tab === t.id ? "page" : undefined}
            >
              <t.icon size={16} />
              {t.label}
              {tab === t.id && <span className="ml-auto h-1 w-1 rounded-full bg-gold" />}
            </button>
          ))}
        </nav>
        <Link
          href="/"
          className="mt-6 flex items-center gap-2 rounded-lg border border-line px-3.5 py-2.5 text-[13px] text-muted transition-colors hover:border-cream/40 hover:text-cream"
        >
          View store <IcArrowRight size={14} />
        </Link>
      </aside>

      {/* mobile tabs */}
      <div className="fixed inset-x-0 top-0 z-40 border-b border-line bg-[#0b0b0e]/90 backdrop-blur lg:hidden">
        <div className="flex items-center gap-3 px-4 py-3">
          <span className="text-gold"><IcLogo size={18} /></span>
          <span className="font-display text-[12px] tracking-[0.25em] text-cream">ADMIN</span>
        </div>
        <div className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-3">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => router.replace(`/admin?tab=${t.id}`)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-1.5 text-[12px] font-medium transition-colors",
                tab === t.id ? "border-gold/50 bg-gold/12 text-goldsoft" : "border-line text-muted"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* content */}
      <main className="min-w-0 flex-1 p-5 pt-32 md:p-8 lg:pt-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl text-cream">{title}</h1>
            <p className="mt-1 text-[13px] text-muted">NOCTURNE store · Copenhagen HQ · {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
          </div>
          <Link
            href="/"
            className="hidden items-center gap-2 rounded-[10px] border border-line px-4 py-2.5 text-[12px] font-medium text-muted transition-colors hover:text-cream lg:inline-flex"
          >
            View store <IcArrowRight size={13} />
          </Link>
        </div>

        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          {tab === "overview" && <Overview stats={stats} />}
          {tab === "products" && <ProductsTable products={props.products} />}
          {tab === "orders" && <OrdersTable stats={stats} post={post} busy={busy} />}
          {tab === "customers" && <CustomersTable stats={stats} />}
          {tab === "reviews" && <ReviewsTable reviews={props.reviews} post={post} busy={busy} />}
          {tab === "coupons" && <Coupons coupons={props.coupons} post={post} busy={busy} />}
          {tab === "inventory" && <Inventory stockProducts={props.stockProducts} post={post} busy={busy} />}
          {tab === "categories" && <CategoriesTable categories={props.categories} />}
          {tab === "settings" && <Settings toast={toast} />}
        </motion.div>
      </main>
    </div>
  );
}

/* ---------------- Overview ---------------- */

function Overview({ stats }: { stats: Stats }) {
  const kpis = [
    { l: "Revenue · 30 days", v: fmt(stats.kpi.revenue30), sub: "all channels" },
    { l: "Orders · 30 days", v: String(stats.kpi.orders30), sub: "live count" },
    { l: "Customers", v: String(stats.kpi.customers), sub: "lifetime" },
    { l: "New customers · 30 days", v: String(stats.kpi.newCustomers30), sub: "first orders" },
  ];
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.l} className="card-surface rounded-xl p-5">
            <p className="text-[11px] font-semibold tracking-[0.14em] text-faint uppercase">{k.l}</p>
            <p className="mt-2 font-display text-3xl text-cream tnum">{k.v}</p>
            <p className="mt-1 text-[11px] text-faint">{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="card-surface rounded-xl p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[14px] font-semibold text-cream">Revenue · last 6 months</h2>
            <Badge tone="gold">USD</Badge>
          </div>
          <AreaChart data={stats.revenue} />
        </div>
        <div className="card-surface rounded-xl p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[14px] font-semibold text-cream">Orders · last 6 months</h2>
            <div className="flex gap-1.5">
              {stats.byStatus.slice(0, 3).map((s) => (
                <Badge key={s.status} tone={STATUS_TONE[s.status] ?? "neutral"}>{s.status} {s.n}</Badge>
              ))}
            </div>
          </div>
          <BarChart data={stats.ordersSeries} />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        {/* recent orders */}
        <div className="card-surface overflow-hidden rounded-xl">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="text-[14px] font-semibold text-cream">Recent orders</h2>
            <Link href="/admin?tab=orders" className="text-[12px] text-goldsoft hover:underline">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-line text-[10px] tracking-[0.16em] text-faint uppercase">
                  <th className="px-5 py-3 font-semibold">Order</th>
                  <th className="px-5 py-3 font-semibold">Customer</th>
                  <th className="hidden px-5 py-3 font-semibold md:table-cell">Date</th>
                  <th className="px-5 py-3 text-right font-semibold">Total</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {stats.recentOrders.map((o) => (
                  <tr key={o.id} className="transition-colors hover:bg-white/[0.02]">
                    <td className="px-5 py-3.5 font-semibold text-cream tnum">{o.number}</td>
                    <td className="px-5 py-3.5">
                      <span className="block text-cream/90">{o.name}</span>
                      <span className="block text-[11px] text-faint">{o.email}</span>
                    </td>
                    <td className="hidden px-5 py-3.5 text-muted md:table-cell">{formatDate(o.createdAt)}</td>
                    <td className="px-5 py-3.5 text-right font-semibold text-cream tnum">{fmt(o.total)}</td>
                    <td className="px-5 py-3.5"><Badge tone={STATUS_TONE[o.status] ?? "neutral"}>{o.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          {/* best sellers */}
          <div className="card-surface rounded-xl p-5">
            <h2 className="mb-4 text-[14px] font-semibold text-cream">Best sellers</h2>
            <ul className="space-y-3.5">
              {stats.topProducts.map((p, i) => (
                <li key={p.name} className="flex items-center gap-3">
                  <span className="w-4 font-display text-sm text-gold tnum">{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-cream">{p.name}</p>
                    <p className="text-[11px] text-faint tnum">{p.qty} units · {fmt(p.revenue)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {/* low stock */}
          <div className="card-surface rounded-xl p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[14px] font-semibold text-cream">Low stock</h2>
              <Link href="/admin?tab=inventory" className="text-[12px] text-goldsoft hover:underline">Inventory</Link>
            </div>
            {stats.lowStock.length === 0 ? (
              <p className="text-[13px] text-muted">Everything is comfortably stocked.</p>
            ) : (
              <ul className="space-y-2.5">
                {stats.lowStock.slice(0, 5).map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-3 text-[13px]">
                    <Link href={`/product/${p.slug}`} className="truncate text-cream/90 hover:text-goldsoft">{p.name}</Link>
                    <Badge tone={p.stock === 0 ? "danger" : "warn"}>{p.stock === 0 ? "out" : `${p.stock} left`}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Products ---------------- */

function ProductsTable({ products }: { products: Props["products"] }) {
  return (
    <div className="card-surface overflow-hidden rounded-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-line text-[10px] tracking-[0.16em] text-faint uppercase">
              <th className="px-5 py-3.5 font-semibold">Product</th>
              <th className="px-5 py-3.5 font-semibold">Price</th>
              <th className="px-5 py-3.5 font-semibold">Rating</th>
              <th className="px-5 py-3.5 text-right font-semibold">Stock</th>
              <th className="hidden px-5 py-3.5 font-semibold md:table-cell">Flags</th>
              <th className="hidden px-5 py-3.5 text-right font-semibold lg:table-cell">Added</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {products.map((p) => (
              <tr key={p.id} className="transition-colors hover:bg-white/[0.02]">
                <td className="px-5 py-3.5">
                  <Link href={`/product/${p.slug}`} className="font-medium text-cream hover:text-goldsoft">{p.name}</Link>
                  <span className="block text-[11px] text-faint">/{p.slug}</span>
                </td>
                <td className="px-5 py-3.5 text-cream tnum">
                  {p.discountPrice ? (
                    <span>
                      <span className="text-faint line-through">{fmt(p.price)}</span> {fmt(p.discountPrice)}
                    </span>
                  ) : (
                    fmt(p.price)
                  )}
                </td>
                <td className="px-5 py-3.5">
                  <span className="flex items-center gap-2">
                    <Stars value={p.rating} size={11} />
                    <span className="text-[11px] text-faint tnum">{p.reviewCount}</span>
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <Badge tone={p.stock === 0 ? "danger" : p.stock < 10 ? "warn" : "success"}>{p.stock}</Badge>
                </td>
                <td className="hidden px-5 py-3.5 md:table-cell">
                  <span className="flex gap-1.5">
                    {p.featured && <Badge tone="gold">featured</Badge>}
                    {p.newArrival && <Badge tone="neutral">new</Badge>}
                    {p.bestSeller && <Badge tone="neutral">best</Badge>}
                  </span>
                </td>
                <td className="hidden px-5 py-3.5 text-right text-faint lg:table-cell">{formatDate(p.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------- Orders ---------------- */

function OrdersTable({ stats, post, busy }: { stats: Stats; post: (a: string, p: Record<string, unknown>, k: string, m: string) => void; busy: string | null }) {
  return (
    <div className="card-surface overflow-hidden rounded-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-line text-[10px] tracking-[0.16em] text-faint uppercase">
              <th className="px-5 py-3.5 font-semibold">Order</th>
              <th className="px-5 py-3.5 font-semibold">Customer</th>
              <th className="hidden px-5 py-3.5 font-semibold sm:table-cell">Items</th>
              <th className="hidden px-5 py-3.5 font-semibold md:table-cell">Date</th>
              <th className="px-5 py-3.5 text-right font-semibold">Total</th>
              <th className="px-5 py-3.5 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {stats.recentOrders.slice(0, 40).map((o) => (
              <tr key={o.id} className="transition-colors hover:bg-white/[0.02]">
                <td className="px-5 py-3.5 font-semibold text-cream tnum">{o.number}</td>
                <td className="px-5 py-3.5">
                  <span className="block text-cream/90">{o.name}</span>
                  <span className="block text-[11px] text-faint">{o.email}</span>
                </td>
                <td className="hidden px-5 py-3.5 text-muted tnum sm:table-cell">
                  {o.items.reduce((s, i) => s + i.qty, 0)}
                </td>
                <td className="hidden px-5 py-3.5 text-muted md:table-cell">{formatDate(o.createdAt)}</td>
                <td className="px-5 py-3.5 text-right font-semibold text-cream tnum">{fmt(o.total)}</td>
                <td className="px-5 py-3.5">
                  <select
                    value={o.status}
                    disabled={busy === `o${o.id}`}
                    onChange={(e) => post("order-status", { id: o.id, status: e.target.value }, `o${o.id}`, `Order ${o.number} → ${e.target.value}`)}
                    className="h-8 rounded-lg border border-line bg-panel px-2 text-[12px] text-cream outline-none transition-colors focus:border-gold/50"
                    aria-label={`Status for order ${o.number}`}
                  >
                    {["pending", "processing", "shipped", "delivered", "refunded"].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------- Customers ---------------- */

function CustomersTable({ stats }: { stats: Stats }) {
  return (
    <div className="card-surface overflow-hidden rounded-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-line text-[10px] tracking-[0.16em] text-faint uppercase">
              <th className="px-5 py-3.5 font-semibold">Customer</th>
              <th className="px-5 py-3.5 text-right font-semibold">Orders</th>
              <th className="px-5 py-3.5 text-right font-semibold">Lifetime spend</th>
              <th className="px-5 py-3.5 text-right font-semibold">Last order</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {stats.customers.map((c) => (
              <tr key={c.email} className="transition-colors hover:bg-white/[0.02]">
                <td className="px-5 py-3.5">
                  <span className="block font-medium text-cream">{c.name}</span>
                  <span className="block text-[11px] text-faint">{c.email}</span>
                </td>
                <td className="px-5 py-3.5 text-right text-cream tnum">{c.orders}</td>
                <td className="px-5 py-3.5 text-right font-semibold text-cream tnum">{fmt(c.spent)}</td>
                <td className="px-5 py-3.5 text-right text-muted">{formatDate(c.last)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------- Reviews ---------------- */

function ReviewsTable({ reviews, post, busy }: { reviews: Props["reviews"]; post: (a: string, p: Record<string, unknown>, k: string, m: string) => void; busy: string | null }) {
  return (
    <div className="card-surface divide-y divide-line rounded-xl">
      {reviews.length === 0 ? (
        <p className="p-8 text-center text-sm text-muted">No reviews yet.</p>
      ) : (
        reviews.map((r) => (
          <div key={r.id} className="flex items-start gap-4 p-5 transition-colors hover:bg-white/[0.02]">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold/15 font-display text-sm text-goldsoft">
              {r.author.slice(0, 1).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="text-[13px] font-semibold text-cream">{r.author}</span>
                <Stars value={r.rating} size={11} />
                <span className="text-[11px] text-faint">{formatDate(r.createdAt)}</span>
              </div>
              <p className="mt-1 text-[12px] text-goldsoft">{r.productName}{r.title ? ` — ${r.title}` : ""}</p>
              <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-muted">{r.body}</p>
            </div>
            <button
              onClick={() => post("review-delete", { id: r.id }, `r${r.id}`, "Review removed")}
              disabled={busy === `r${r.id}`}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-faint transition-colors hover:bg-danger/10 hover:text-danger"
              aria-label="Delete review"
            >
              <IcTrash size={15} />
            </button>
          </div>
        ))
      )}
    </div>
  );
}

/* ---------------- Coupons ---------------- */

function Coupons({ coupons, post, busy }: { coupons: Props["coupons"]; post: (a: string, p: Record<string, unknown>, k: string, m: string) => void; busy: string | null }) {
  const [code, setCode] = useState("");
  const [percent, setPercent] = useState(10);
  const [min, setMin] = useState(0);
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="card-surface overflow-hidden rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-line text-[10px] tracking-[0.16em] text-faint uppercase">
                <th className="px-5 py-3.5 font-semibold">Code</th>
                <th className="px-5 py-3.5 font-semibold">Value</th>
                <th className="hidden px-5 py-3.5 font-semibold sm:table-cell">Min subtotal</th>
                <th className="px-5 py-3.5 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {coupons.map((c) => (
                <tr key={c.id} className="transition-colors hover:bg-white/[0.02]">
                  <td className="px-5 py-3.5 font-mono text-[13px] font-semibold tracking-wider text-goldsoft">{c.code}</td>
                  <td className="px-5 py-3.5 text-cream">{c.percent != null ? `${c.percent}% off` : fmt(c.id)} · {c.description}</td>
                  <td className="hidden px-5 py-3.5 text-muted tnum sm:table-cell">{c.minSubtotal ? fmt(c.minSubtotal) : "—"}</td>
                  <td className="px-5 py-3.5"><Badge tone={c.active ? "success" : "neutral"}>{c.active ? "active" : "off"}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          post("coupon-create", { code, percent, minSubtotal: min }, "coupon", `Coupon ${code.toUpperCase()} created`);
          setCode("");
        }}
        className="card-surface h-fit space-y-4 rounded-xl p-6"
      >
        <h2 className="text-[14px] font-semibold text-cream">Create coupon</h2>
        <label className="block">
          <span className="mb-2 block text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">Code</span>
          <input className="input uppercase" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="WINTER20" />
        </label>
        <label className="block">
          <span className="mb-2 block text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">Percent off</span>
          <input className="input" type="number" min={1} max={90} value={percent} onChange={(e) => setPercent(Number(e.target.value))} />
        </label>
        <label className="block">
          <span className="mb-2 block text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">Min subtotal ($)</span>
          <input className="input" type="number" min={0} step={10} value={min} onChange={(e) => setMin(Number(e.target.value))} />
        </label>
        <Button type="submit" className="w-full" disabled={!code || busy === "coupon"}>
          Create coupon
        </Button>
      </form>
    </div>
  );
}

/* ---------------- Inventory ---------------- */

function Inventory({ stockProducts, post, busy }: { stockProducts: Props["stockProducts"]; post: (a: string, p: Record<string, unknown>, k: string, m: string) => void; busy: string | null }) {
  return (
    <div className="card-surface overflow-hidden rounded-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-line text-[10px] tracking-[0.16em] text-faint uppercase">
              <th className="px-5 py-3.5 font-semibold">Product</th>
              <th className="hidden px-5 py-3.5 text-right font-semibold sm:table-cell">Unit price</th>
              <th className="px-5 py-3.5 font-semibold">Stock level</th>
              <th className="px-5 py-3.5 text-right font-semibold">Adjust</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {stockProducts.map((p) => (
              <tr key={p.id} className="transition-colors hover:bg-white/[0.02]">
                <td className="px-5 py-3.5 font-medium text-cream">{p.name}</td>
                <td className="hidden px-5 py-3.5 text-right text-muted tnum sm:table-cell">{fmt(p.discountPrice ?? p.price)}</td>
                <td className="px-5 py-3.5">
                  <Badge tone={p.stock === 0 ? "danger" : p.stock < 10 ? "warn" : "success"}>
                    {p.stock === 0 ? "out of stock" : `${p.stock} in stock`}
                  </Badge>
                </td>
                <td className="px-5 py-3.5">
                  <span className="ml-auto flex justify-end gap-2">
                    <button
                      onClick={() => post("stock", { id: p.id, stock: p.stock - 1 }, `s${p.id}`, `${p.name}: stock −1`)}
                      disabled={p.stock <= 0 || busy === `s${p.id}`}
                      className="grid h-8 w-8 place-items-center rounded-lg border border-line text-muted transition-colors hover:text-cream disabled:opacity-30"
                      aria-label={`Decrease ${p.name} stock`}
                    >
                      <IcMinus size={13} />
                    </button>
                    <span className="grid h-8 w-10 place-items-center rounded-lg bg-white/[0.04] text-[12px] font-semibold text-cream tnum">{p.stock}</span>
                    <button
                      onClick={() => post("stock", { id: p.id, stock: p.stock + 1 }, `s${p.id}`, `${p.name}: stock +1`)}
                      disabled={busy === `s${p.id}`}
                      className="grid h-8 w-8 place-items-center rounded-lg border border-line text-muted transition-colors hover:text-cream"
                      aria-label={`Increase ${p.name} stock`}
                    >
                      <IcPlus size={13} />
                    </button>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------- Categories ---------------- */

function CategoriesTable({ categories }: { categories: Props["categories"] }) {
  return (
    <div className="card-surface overflow-hidden rounded-xl">
      <div className="border-b border-line px-5 py-4 text-[12px] text-faint">
        Categories are managed with the storefront CMS — display only here.
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-line text-[10px] tracking-[0.16em] text-faint uppercase">
              <th className="px-5 py-3.5 font-semibold">Category</th>
              <th className="px-5 py-3.5 font-semibold">Slug</th>
              <th className="hidden px-5 py-3.5 font-semibold md:table-cell">Description</th>
              <th className="px-5 py-3.5 text-right font-semibold">Objects</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {categories.map((c) => (
              <tr key={c.slug} className="transition-colors hover:bg-white/[0.02]">
                <td className="px-5 py-3.5 font-medium text-cream">{c.name}</td>
                <td className="px-5 py-3.5 font-mono text-[12px] text-faint">/{c.slug}</td>
                <td className="hidden max-w-md truncate px-5 py-3.5 text-muted md:table-cell">{c.description}</td>
                <td className="px-5 py-3.5 text-right text-cream tnum">{c.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------- Settings ---------------- */

function Settings({ toast }: { toast: (t: { title: string; body?: string; kind: "success" | "error" | "info" }) => void }) {
  const [settings, setSettings] = useState({
    storeName: "NOCTURNE ApS",
    currency: "USD",
    timezone: "Europe/Copenhagen",
    publicStore: true,
    maintenance: false,
    autoApplyCoupons: true,
    newsletter: true,
  });
  const Toggles = [
    { k: "publicStore" as const, l: "Public store", s: "Storefront visible to everyone" },
    { k: "maintenance" as const, l: "Maintenance mode", s: "Show a maintenance page instead of the shop" },
    { k: "autoApplyCoupons" as const, l: "Auto-apply best coupon", s: "Choose the strongest valid code at checkout" },
    { k: "newsletter" as const, l: "Evening dispatch", s: "Weekly newsletter is collecting subscribers" },
  ];
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="card-surface space-y-4 rounded-xl p-6">
        <h2 className="text-[14px] font-semibold text-cream">Store profile</h2>
        <label className="block">
          <span className="mb-2 block text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">Store name</span>
          <input className="input" value={settings.storeName} onChange={(e) => setSettings((s) => ({ ...s, storeName: e.target.value }))} />
        </label>
        <label className="block">
          <span className="mb-2 block text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">Currency</span>
          <select className="input" value={settings.currency} onChange={(e) => setSettings((s) => ({ ...s, currency: e.target.value }))}>
            {["USD", "EUR", "DKK", "GBP"].map((c) => (
              <option key={c} className="bg-panel">{c}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-2 block text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">Timezone</span>
          <input className="input" value={settings.timezone} onChange={(e) => setSettings((s) => ({ ...s, timezone: e.target.value }))} />
        </label>
      </div>
      <div className="card-surface rounded-xl p-6">
        <h2 className="mb-5 text-[14px] font-semibold text-cream">Behaviour</h2>
        <div className="space-y-4">
          {Toggles.map((t) => (
            <label key={t.k} className="flex cursor-pointer items-center justify-between gap-4">
              <span>
                <span className="block text-[13px] font-medium text-cream">{t.l}</span>
                <span className="block text-[11px] text-faint">{t.s}</span>
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={settings[t.k]}
                aria-label={t.l}
                onClick={() => setSettings((s) => ({ ...s, [t.k]: !s[t.k] }))}
                className={cn(
                  "relative h-6 w-11 shrink-0 rounded-full border transition-colors duration-300",
                  settings[t.k] ? "border-gold bg-gold/30" : "border-line2 bg-white/[0.04]"
                )}
              >
                <span
                  className={cn(
                    "absolute top-[3px] h-4 w-4 rounded-full transition-all duration-300",
                    settings[t.k] ? "left-[24px] bg-gold" : "left-[3px] bg-muted"
                  )}
                />
              </button>
            </label>
          ))}
        </div>
        <Button
          className="mt-7"
          onClick={() => toast({ title: "Settings saved", body: "Demo mode — changes are not persisted.", kind: "success" })}
        >
          Save settings
        </Button>
      </div>
    </div>
  );
}
