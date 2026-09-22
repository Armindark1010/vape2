import { getAdminBanners } from "../../db/queries";

export default defineEventHandler(async () => {
  return await getAdminBanners();
});
