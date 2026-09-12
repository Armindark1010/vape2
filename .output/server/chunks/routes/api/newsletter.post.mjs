import { c as defineEventHandler, r as readBody, e as createError } from '../../_/nitro.mjs';
import { i as subscribe } from '../../_/queries.mjs';
import { e as emailOk } from '../../_/format.mjs';
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

const newsletter_post = defineEventHandler(async (event) => {
  var _a;
  try {
    const body = await readBody(event);
    if (!emailOk((_a = body == null ? void 0 : body.email) != null ? _a : "")) {
      throw createError({ statusCode: 400, message: "Invalid email." });
    }
    await subscribe(String(body.email).toLowerCase());
    return { ok: true };
  } catch (e) {
    if (e == null ? void 0 : e.statusCode) throw e;
    console.error("newsletter error", e);
    throw createError({ statusCode: 500, message: "Couldn't subscribe." });
  }
});

export { newsletter_post as default };
//# sourceMappingURL=newsletter.post.mjs.map
