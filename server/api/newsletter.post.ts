import { subscribe } from "../db/queries";
import { emailOk } from "~/utils/format";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    if (!emailOk(body?.email ?? "")) {
      throw createError({ statusCode: 400, message: "Invalid email." });
    }
    await subscribe(String(body.email).toLowerCase());
    return { ok: true };
  } catch (e: any) {
    if (e?.statusCode) throw e;
    console.error("newsletter error", e);
    throw createError({ statusCode: 500, message: "Couldn't subscribe." });
  }
});
