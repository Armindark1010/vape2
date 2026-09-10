import { NextResponse } from "next/server";
import { getProducts } from "@/db/queries";

export const dynamic = "force-dynamic";

/** جستجوی سریع برای نوار پایین و صفحه جستجو */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") ?? "").trim();
  if (q.length < 2) return NextResponse.json([]);
  const rows = await getProducts({ q }, 12);
  return NextResponse.json(
    rows.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      price: p.discountPrice ?? p.price,
      image: p.images[0] ?? "",
      tagline: p.tagline,
    }))
  );
}
