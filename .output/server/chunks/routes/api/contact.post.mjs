import { c as defineEventHandler, r as readBody, e as createError } from '../../_/nitro.mjs';
import { h as createContact } from '../../_/queries.mjs';
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

const contact_post = defineEventHandler(async (event) => {
  var _a;
  try {
    const body = await readBody(event);
    if (!(body == null ? void 0 : body.name) || !emailOk((_a = body.email) != null ? _a : "") || !(body == null ? void 0 : body.message)) {
      throw createError({ statusCode: 400, message: "Please complete all required fields." });
    }
    await createContact({
      name: String(body.name).slice(0, 120),
      email: String(body.email).slice(0, 160),
      subject: body.subject ? String(body.subject).slice(0, 120) : "General",
      message: String(body.message).slice(0, 4e3)
    });
    return { ok: true };
  } catch (e) {
    if (e == null ? void 0 : e.statusCode) throw e;
    console.error("contact error", e);
    throw createError({ statusCode: 500, message: "Couldn't send your message." });
  }
});

export { contact_post as default };
//# sourceMappingURL=contact.post.mjs.map
