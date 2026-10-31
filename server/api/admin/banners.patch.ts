import { updateBanner } from "../../db/queries";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const id = Number(body?.id);

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "شناسه بنر الزامی است",
    });
  }

  const updated = await updateBanner(id, {
    title: body.title,
    subtitle: body.subtitle,
    badge: body.badge,
    image: body.image,
    mobileImage: body.mobileImage,
    link: body.link,
    buttonText: body.buttonText,
    bgGradient: body.bgGradient,
    textColor: body.textColor,
    position: body.position,
    sortOrder: body.sortOrder !== undefined ? Number(body.sortOrder) : undefined,
    active: body.active !== undefined ? Boolean(body.active) : undefined,
  });

  if (!updated) {
    throw createError({
      statusCode: 404,
      statusMessage: "بنر مورد نظر یافت نشد",
    });
  }

  return {
    ok: true,
    banner: updated,
  };
});
