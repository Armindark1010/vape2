import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

var _a;
const { Pool } = pg;
const databaseUrl = process.env.DATABASE_URL;
const globalForDb = globalThis;
const pool = databaseUrl ? (_a = globalForDb.__arenaNuxtPostgresqlPool) != null ? _a : new Pool({
  connectionString: databaseUrl,
  connectionTimeoutMillis: 5e3
}) : null;
const db = pool ? drizzle(pool) : null;

export { db as d };
//# sourceMappingURL=index.mjs.map
