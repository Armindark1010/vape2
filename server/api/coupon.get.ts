import { validateCoupon } from "../db/queries";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const code = (query.code as string)?.trim().toUpperCase();
  if (!code) {
    throw createError({ statusCode: 400, message: "Missing code." });
  }
  const coupon = await validateCoupon(code);
  if (!coupon) {
    throw createError({ statusCode: 404, message: "That code isn't valid or has expired." });
  }
  return { coupon };
});
