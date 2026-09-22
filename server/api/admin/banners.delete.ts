import { deleteBanner } from "../../db/queries";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const body = event.node.req.method === "DELETE" ? await readBody(event).catch(() => ({})) : {};
  const id = Number(query.id || body?.id);

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "شناسه بنر الزامی است",
    });
  }

  const ok = await deleteBanner(id);
  return {
    ok,
    id,
  };
});
