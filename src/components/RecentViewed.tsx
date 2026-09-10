"use client";

import Link from "next/link";
import { useStore } from "@/store/store";
import { SectionHead, Price } from "@/components/ui";

type Mini = {
  id: number;
  slug: string;
  name: string;
  image: string;
  price: number;
  compareAt: number | null;
};

export function RecentViewed({ currentId, index }: { currentId: number; index: Mini[] }) {
  const { recent, hydrated } = useStore();
  const items = (hydrated ? recent : [])
    .filter((id) => id !== currentId)
    .map((id) => index.find((x) => x.id === id))
    .filter(Boolean) as Mini[];

  if (items.length === 0) return null;

  return (
    <section className="mt-28">
      <SectionHead eyebrow="Picked up earlier" title="Recently viewed" />
      <div className="no-scrollbar flex gap-4 overflow-x-auto pb-1">
        {items.map((p) => (
          <Link
            key={p.id}
            href={`/product/${p.slug}`}
            className="group w-[200px] shrink-0 sm:w-[240px]"
          >
            <div className="overflow-hidden rounded-xl border border-line bg-card">
              <img
                src={p.image}
                alt={p.name}
                loading="lazy"
                decoding="async"
                className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
              />
            </div>
            <p className="mt-3 truncate text-[13px] font-medium text-cream group-hover:text-goldsoft">{p.name}</p>
            <div className="mt-1">
              <Price price={p.price} compareAt={p.compareAt} size="sm" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
