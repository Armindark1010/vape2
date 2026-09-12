import { c as defineEventHandler } from '../../_/nitro.mjs';
import { b as getCategories } from '../../_/queries.mjs';
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

const categories_get = defineEventHandler(async () => {
  return await getCategories();
});

export { categories_get as default };
//# sourceMappingURL=categories.get.mjs.map
