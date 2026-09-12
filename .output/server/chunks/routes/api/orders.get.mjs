import { c as defineEventHandler, g as getQuery } from '../../_/nitro.mjs';
import { j as getOrdersByEmail } from '../../_/queries.mjs';
import { D as DEMO_USER } from '../../_/vape.mjs';
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

const orders_get = defineEventHandler(async (event) => {
  const query = getQuery(event);
  const email = query.email || DEMO_USER.email;
  return await getOrdersByEmail(email);
});

export { orders_get as default };
//# sourceMappingURL=orders.get.mjs.map
