import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

const { Pool } = pg;
const databaseUrl = process.env.DATABASE_URL;

const globalForDb = globalThis as typeof globalThis & {
  __arenaNuxtPostgresqlPool?: pg.Pool;
};

export const pool = databaseUrl
  ? globalForDb.__arenaNuxtPostgresqlPool ??
    new Pool({
      connectionString: databaseUrl,
      connectionTimeoutMillis: 5000,
    })
  : null;

if (pool && process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNuxtPostgresqlPool = pool;
}

export const db = pool ? drizzle(pool) : (null as unknown as ReturnType<typeof drizzle>);
