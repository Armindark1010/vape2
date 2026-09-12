import { SITE } from "~/utils/vape";

export default defineEventHandler((event) => {
  setResponseHeader(event, "Content-Type", "text/plain");
  return `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/
Disallow: /cart
Disallow: /checkout

Sitemap: ${SITE.domain}/sitemap.xml
`;
});
