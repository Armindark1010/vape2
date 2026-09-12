import { sql } from "drizzle-orm";
import { db } from "../db";

export default defineEventHandler(async () => {
  try {
    if (db) {
      await db.execute(sql`select 1`);
    }
    return { ok: true };
  } catch {
    throw createError({ statusCode: 500, message: "Database unhealthy" });
  }
});
