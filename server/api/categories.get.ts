import { getCategories } from "../db/queries";

export default defineEventHandler(async () => {
  return await getCategories();
});
