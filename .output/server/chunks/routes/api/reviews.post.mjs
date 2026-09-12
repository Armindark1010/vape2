import { c as defineEventHandler, r as readBody, e as createError } from '../../_/nitro.mjs';
import { l as createReview } from '../../_/queries.mjs';
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

const reviews_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    if (!(body == null ? void 0 : body.productId) || !(body == null ? void 0 : body.author) || !(body == null ? void 0 : body.body)) {
      throw createError({ statusCode: 400, message: "Please complete all required fields." });
    }
    await createReview({
      productId: Number(body.productId),
      author: String(body.author),
      rating: Number(body.rating) || 5,
      title: body.title ? String(body.title) : "",
      body: String(body.body)
    });
    return { ok: true };
  } catch (e) {
    if (e == null ? void 0 : e.statusCode) throw e;
    console.error("review error", e);
    throw createError({ statusCode: 500, message: "Couldn't submit the review." });
  }
});

export { reviews_post as default };
//# sourceMappingURL=reviews.post.mjs.map
