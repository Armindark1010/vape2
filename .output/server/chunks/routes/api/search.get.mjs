import { c as defineEventHandler, g as getQuery } from '../../_/nitro.mjs';
import { g as getProducts } from '../../_/queries.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'drizzle-orm';
import '../../_/index.mjs';
import 'drizzle-orm/node-postgres';
import 'pg';
import 'drizzle-orm/pg-core';

const search_get = defineEventHandler(async (event) => {
  var _a;
  const query = getQuery(event);
  const q = ((_a = query.q) != null ? _a : "").trim();
  if (q.length < 2) return [];
  const rows = await getProducts({ q }, 12);
  return rows.map((p) => {
    var _a2, _b;
    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      price: (_a2 = p.discountPrice) != null ? _a2 : p.price,
      image: (_b = p.images[0]) != null ? _b : "",
      tagline: p.tagline
    };
  });
});

export { search_get as default };
//# sourceMappingURL=search.get.mjs.map
