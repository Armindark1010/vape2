import { defineEventHandler, readBody, createError } from 'h3'
import { addAddress } from '~~/server/db/queries'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.recipientName || !body.recipientPhone || !body.city || !body.line1) {
    throw createError({
      statusCode: 400,
      statusMessage: 'نام گیرنده، شماره تماس، شهر و نشانی کامل الزامی است.'
    })
  }

  const newAddress = await addAddress({
    userId: body.userId ? String(body.userId) : undefined,
    title: body.title || 'منزل',
    recipientName: body.recipientName,
    recipientPhone: body.recipientPhone,
    line1: body.line1,
    line2: body.line2 || '',
    city: body.city,
    zip: body.zip || '',
    country: body.country || 'IR',
    isDefault: Boolean(body.isDefault)
  })

  return {
    success: true,
    data: newAddress,
    message: 'نشانی با موفقیت ذخیره شد.'
  }
})
