import { c as defineEventHandler, g as getQuery, e as createError } from '../../_/nitro.mjs';
import { v as validateCoupon } from '../../_/queries.mjs';
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

const coupon_get = defineEventHandler(async (event) => {
  var _a;
  const query = getQuery(event);
  const code = (_a = query.code) == null ? void 0 : _a.trim().toUpperCase();
  if (!code) {
    throw createError({ statusCode: 400, message: "Missing code." });
  }
  const coupon = await validateCoupon(code);
  if (!coupon) {
    throw createError({ statusCode: 404, message: "That code isn't valid or has expired." });
  }
  return { coupon };
});

export { coupon_get as default };
//# sourceMappingURL=coupon.get.mjs.map
