import { SITE } from "~/utils/vape";
import { getProducts } from "../db/queries";

export default defineEventHandler(async (event) => {
  const staticRoutes = [
    "",
    "/shop",
    "/categories",
    "/cart",
    "/checkout",
    "/account",
  ];

  let productSlugs: string[] = [];
  try {
    const products = await getProducts({}, 200);
    productSlugs = products.map((p) => p.slug);
  } catch {
    /* fallback */
  }

  const urls = [
    ...staticRoutes.map(
      (path) => `  <url>
    <loc>${SITE.domain}${path}</loc>
    <changefreq>${path === "" || path === "/shop" ? "daily" : "weekly"}</changefreq>
    <priority>${path === "" ? "1.0" : path === "/shop" ? "0.9" : "0.7"}</priority>
  </url>`
    ),
    ...productSlugs.map(
      (slug) => `  <url>
    <loc>${SITE.domain}/product/${slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    ),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  setResponseHeader(event, "Content-Type", "application/xml");
  return xml;
});
