import { getOrdersByEmail } from "../db/queries";
import { DEMO_USER } from "~/utils/vape";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const email = (query.email as string) || DEMO_USER.email;
  return await getOrdersByEmail(email);
});
