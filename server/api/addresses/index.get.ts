import { defineEventHandler, getQuery } from 'h3'
import { getUserAddresses } from '~~/server/db/queries'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const userId = query.userId ? String(query.userId) : undefined
  const phone = query.phone ? String(query.phone) : undefined

  // In authenticated context or query param
  const addresses = await getUserAddresses(userId, phone)
  return {
    success: true,
    data: addresses
  }
})
