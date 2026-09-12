import { createContact } from "../db/queries";
import { emailOk } from "~/utils/format";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    if (!body?.name || !emailOk(body.email ?? "") || !body?.message) {
      throw createError({ statusCode: 400, message: "Please complete all required fields." });
    }
    await createContact({
      name: String(body.name).slice(0, 120),
      email: String(body.email).slice(0, 160),
      subject: body.subject ? String(body.subject).slice(0, 120) : "General",
      message: String(body.message).slice(0, 4000),
    });
    return { ok: true };
  } catch (e: any) {
    if (e?.statusCode) throw e;
    console.error("contact error", e);
    throw createError({ statusCode: 500, message: "Couldn't send your message." });
  }
});
