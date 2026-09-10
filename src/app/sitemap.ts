import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/content";
import { getProducts } from "@/db/queries";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/shop",
    "/categories",
    "/search",
    "/wishlist",
    "/cart",
    "/checkout",
    "/account",
    "/orders",
    "/about",
    "/contact",
    "/faq",
    "/terms",
    "/privacy",
    "/admin",
  ].map((path) => ({
    url: `${BRAND.domain}${path}`,
    lastModified: new Date(),
    changeFrequency: (path === "/shop" ? "daily" : "weekly") as "daily" | "weekly",
    priority: path === "" ? 1 : path === "/shop" ? 0.9 : 0.5,
  }));

  try {
    const products = await getProducts({}, 200);
    const productRoutes = products.map((p) => ({
      url: `${BRAND.domain}/product/${p.slug}`,
      lastModified: new Date(p.createdAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
    return [...staticRoutes, ...productRoutes];
  } catch {
    return staticRoutes;
  }
}
