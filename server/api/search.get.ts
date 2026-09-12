import { getProducts } from "../db/queries";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const q = ((query.q as string) ?? "").trim();
  if (q.length < 2) return [];
  const rows = await getProducts({ q }, 12);
  return rows.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.discountPrice ?? p.price,
    image: p.images[0] ?? "",
    tagline: p.tagline,
  }));
});
