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

const products_get = defineEventHandler(async (event) => {
  const query = getQuery(event);
  const filters = {
    category: query.category,
    brand: query.brand,
    min: query.min ? Number(query.min) : void 0,
    max: query.max ? Number(query.max) : void 0,
    rating: query.rating ? Number(query.rating) : void 0,
    stock: query.stock === "in" ? "in" : void 0,
    sort: query.sort,
    q: query.q
  };
  const limit = query.limit ? Number(query.limit) : 60;
  return await getProducts(filters, limit);
});

export { products_get as default };
//# sourceMappingURL=products.get.mjs.map
