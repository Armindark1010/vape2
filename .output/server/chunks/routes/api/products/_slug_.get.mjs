import { c as defineEventHandler, f as getRouterParam, e as createError } from '../../../_/nitro.mjs';
import { k as getProductBySlug } from '../../../_/queries.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'drizzle-orm';
import '../../../_/index.mjs';
import 'drizzle-orm/node-postgres';
import 'pg';
import 'drizzle-orm/pg-core';

const _slug__get = defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");
  if (!slug) {
    throw createError({ statusCode: 400, message: "Missing slug" });
  }
  const product = await getProductBySlug(slug);
  if (!product) {
    throw createError({ statusCode: 404, message: "Product not found" });
  }
  return product;
});

export { _slug__get as default };
//# sourceMappingURL=_slug_.get.mjs.map
