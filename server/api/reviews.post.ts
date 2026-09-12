import { createReview } from "../db/queries";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    if (!body?.productId || !body?.author || !body?.body) {
      throw createError({ statusCode: 400, message: "Please complete all required fields." });
    }
    await createReview({
      productId: Number(body.productId),
      author: String(body.author),
      rating: Number(body.rating) || 5,
      title: body.title ? String(body.title) : "",
      body: String(body.body),
    });
    return { ok: true };
  } catch (e: any) {
    if (e?.statusCode) throw e;
    console.error("review error", e);
    throw createError({ statusCode: 500, message: "Couldn't submit the review." });
  }
});
