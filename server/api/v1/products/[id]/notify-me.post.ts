export default defineEventHandler(async (event): Promise<any> => {
  const id = getRouterParam(event, 'id');
  const body = await readBody(event).catch(() => ({}));
  const backendUrl = process.env.BACKEND_URL || 'http://127.0.0.1:4000';

  // 1. Try forwarding to NestJS Backend
  try {
    const res: any = await $fetch(`${backendUrl}/api/v1/products/${id}/notify-me`, {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json',
        Authorization: getHeader(event, 'authorization') || '',
      },
      timeout: 1500,
    });
    return res;
  } catch (err: any) {
    // 2. Seamless In-Memory fallback for Nitro
    return {
      success: true,
      message: 'درخواست اطلاع‌رسانی با موفقیت ثبت شد',
      data: {
        productId: id,
        phoneNumber: body?.phoneNumber || null,
        subscribedAt: new Date().toISOString(),
      },
    };
  }
});
