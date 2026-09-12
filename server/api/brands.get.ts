import { getBrands } from "../db/queries";

export default defineEventHandler(async () => {
  return await getBrands();
});
