import { c as defineEventHandler, h as setResponseHeader } from '../_/nitro.mjs';
import { S as SITE } from '../_/vape.mjs';
import { g as getProducts } from '../_/queries.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'drizzle-orm';
import '../_/index.mjs';
import 'drizzle-orm/node-postgres';
import 'pg';
import 'drizzle-orm/pg-core';

const sitemap_xml = defineEventHandler(async (event) => {
  const staticRoutes = [
    "",
    "/shop",
    "/categories",
    "/cart",
    "/checkout",
    "/account"
  ];
  let productSlugs = [];
  try {
    const products = await getProducts({}, 200);
    productSlugs = products.map((p) => p.slug);
  } catch {
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
    )
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;
  setResponseHeader(event, "Content-Type", "application/xml");
  return xml;
});

export { sitemap_xml as default };
//# sourceMappingURL=sitemap.xml.mjs.map
