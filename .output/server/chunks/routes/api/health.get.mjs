import { c as defineEventHandler, e as createError } from '../../_/nitro.mjs';
import { sql } from 'drizzle-orm';
import { d as db } from '../../_/index.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'drizzle-orm/node-postgres';
import 'pg';

const health_get = defineEventHandler(async () => {
  try {
    if (db) {
      await db.execute(sql`select 1`);
    }
    return { ok: true };
  } catch {
    throw createError({ statusCode: 500, message: "Database unhealthy" });
  }
});

export { health_get as default };
//# sourceMappingURL=health.get.mjs.map
