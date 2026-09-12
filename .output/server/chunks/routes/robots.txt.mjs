import { c as defineEventHandler, h as setResponseHeader } from '../_/nitro.mjs';
import { S as SITE } from '../_/vape.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const robots_txt = defineEventHandler((event) => {
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

export { robots_txt as default };
//# sourceMappingURL=robots.txt.mjs.map
