import { ref, computed } from 'vue'
import type { Address } from '~/types'
import { useAuth } from './useAuth'

const addresses = ref<Address[]>([])
const loading = ref(false)
const initialized = ref(false)

const STORAGE_KEY = 'vapora.saved_addresses'

export function useAddresses() {
  const { user } = useAuth()

  const loadFromStorage = (): Address[] => {
    if (typeof window === 'undefined') return []
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  }

  const saveToStorage = (list: Address[]) => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    } catch {
      /* ignore */
    }
  }

  const fetchAddresses = async (force = false) => {
    if (initialized.value && !force && addresses.value.length > 0) return addresses.value

    loading.value = true
    try {
      // 1. First populate instantly from localStorage for zero layout shift
      const local = loadFromStorage()
      if (local.length > 0 && addresses.value.length === 0) {
        addresses.value = local
      }

      // 2. Fetch from server API
      const params = new URLSearchParams()
      if (user.value?.id) params.set('userId', String(user.value.id))
      if (user.value?.phone) params.set('phone', String(user.value.phone))

      const res = await $fetch<{ success: boolean; data: Address[] }>(`/api/addresses?${params.toString()}`)
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        addresses.value = res.data
        saveToStorage(res.data)
      } else if (local.length > 0) {
        addresses.value = local
      }
      initialized.value = true
    } catch (err) {
      console.warn('Could not fetch remote addresses, using local:', err)
      const local = loadFromStorage()
      if (local.length > 0) {
        addresses.value = local
      }
    } finally {
      loading.value = false
    }
    return addresses.value
  }

  const addAddress = async (payload: {
    title?: string
    recipientName: string
    recipientPhone: string
    city: string
    line1: string
    line2?: string
    zip?: string
    isDefault?: boolean
  }) => {
    loading.value = true
    try {
      const res = await $fetch<{ success: boolean; data: Address; message: string }>('/api/addresses', {
        method: 'POST',
        body: {
          ...payload,
          userId: user.value?.id ? String(user.value.id) : undefined
        }
      })

      if (res && res.success && res.data) {
        // If this one is default, unset previous defaults
        if (res.data.isDefault) {
          addresses.value.forEach(a => a.isDefault = false)
        }
        addresses.value.unshift(res.data)
        saveToStorage(addresses.value)
        return res.data
      }
      throw new Error('خطا در ثبت نشانی')
    } catch (err: any) {
      // Offline fallback: create local address
      const fallbackId = Date.now()
      const fallbackAddr: Address = {
        id: fallbackId,
        userId: user.value?.id ? String(user.value.id) : undefined,
        title: payload.title || 'منزل',
        recipientName: payload.recipientName,
        recipientPhone: payload.recipientPhone,
        city: payload.city,
        line1: payload.line1,
        line2: payload.line2 || '',
        zip: payload.zip || '',
        country: 'IR',
        isDefault: Boolean(payload.isDefault),
        createdAt: new Date().toISOString()
      }
      if (fallbackAddr.isDefault) {
        addresses.value.forEach(a => a.isDefault = false)
      }
      addresses.value.unshift(fallbackAddr)
      saveToStorage(addresses.value)
      return fallbackAddr
    } finally {
      loading.value = false
    }
  }

  const deleteAddress = async (id: number) => {
    loading.value = true
    try {
      await $fetch(`/api/addresses/${id}`, { method: 'DELETE' })
    } catch (e) {
      console.warn('Server delete failed, applying locally:', e)
    } finally {
      addresses.value = addresses.value.filter(a => a.id !== id)
      saveToStorage(addresses.value)
      loading.value = false
    }
  }

  const setDefault = async (id: number) => {
    loading.value = true
    try {
      await $fetch(`/api/addresses/${id}`, { method: 'PATCH' })
    } catch (e) {
      console.warn('Server patch failed, applying locally:', e)
    } finally {
      addresses.value = addresses.value.map(a => ({
        ...a,
        isDefault: a.id === id
      }))
      saveToStorage(addresses.value)
      loading.value = false
    }
  }

  const defaultAddress = computed(() => {
    return addresses.value.find(a => a.isDefault) || addresses.value[0] || null
  })

  return {
    addresses,
    loading,
    initialized,
    defaultAddress,
    fetchAddresses,
    addAddress,
    deleteAddress,
    setDefault
  }
}
