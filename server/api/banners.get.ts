import { getBanners } from "../db/queries";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const position = query.position as string | undefined;

  const banners = await getBanners({
    position,
    activeOnly: true,
  });

  return banners;
});
