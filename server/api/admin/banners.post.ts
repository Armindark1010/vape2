import { createBanner } from "../../db/queries";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body?.title || !body?.image) {
    throw createError({
      statusCode: 400,
      statusMessage: "عنوان بنر و آدرس تصویر الزامی است",
    });
  }

  const newBanner = await createBanner({
    title: body.title,
    subtitle: body.subtitle,
    badge: body.badge,
    image: body.image,
    mobileImage: body.mobileImage,
    link: body.link || "/shop",
    buttonText: body.buttonText || "مشاهده و خرید",
    bgGradient: body.bgGradient || "from-vio to-ice",
    textColor: body.textColor || "light",
    position: body.position || "hero",
    sortOrder: Number(body.sortOrder) || 0,
    active: body.active !== undefined ? Boolean(body.active) : true,
  });

  return {
    ok: true,
    banner: newBanner,
  };
});
