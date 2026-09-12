import { getProducts } from "../db/queries";
import type { ShopFilters } from "~/types";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const filters: ShopFilters = {
    category: query.category as string | undefined,
    brand: query.brand as string | undefined,
    min: query.min ? Number(query.min) : undefined,
    max: query.max ? Number(query.max) : undefined,
    rating: query.rating ? Number(query.rating) : undefined,
    stock: query.stock === "in" ? "in" : undefined,
    sort: query.sort as string | undefined,
    q: query.q as string | undefined,
  };
  const limit = query.limit ? Number(query.limit) : 60;
  return await getProducts(filters, limit);
});
