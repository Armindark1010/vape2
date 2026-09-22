import { defineEventHandler, createError } from 'h3'
import { setDefaultAddress } from '~~/server/db/queries'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  if (!id || isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'شناسه نشانی نامعتبر است.'
    })
  }

  const success = await setDefaultAddress(id)
  return {
    success,
    message: success ? 'نشانی پیش‌فرض به‌روزرسانی شد.' : 'نشانی یافت نشد.'
  }
})
