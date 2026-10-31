import { getOrdersForUser, getOrderByNumber, getAllOrders } from "../db/queries";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  if (query.number) {
    const order = await getOrderByNumber(String(query.number));
    if (!order) {
      throw createError({ statusCode: 404, message: "Order not found" });
    }
    return order;
  }

  const email = query.email ? String(query.email) : undefined;
  const phone = query.phone ? String(query.phone) : undefined;
  const numbers = query.numbers ? String(query.numbers).split(",").map((s) => s.trim()) : undefined;

  if (email || phone || (numbers && numbers.length > 0)) {
    return await getOrdersForUser({ email, phone, numbers });
  }

  return await getAllOrders();
});
