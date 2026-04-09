import type { CakeItem, Category, InventoryItem, OrderRow } from '../types/catalog'

/** Chemin relatif après `/api`, ex. `/categories` */
export function apiUrl(path: string): string {
  const root = import.meta.env.VITE_API_BASE_URL as string | undefined
  if (root && root.length > 0) {
    return `${root.replace(/\/$/, '')}/api${path}`
  }
  return `/api${path}`
}

const withCredentials: RequestInit = { credentials: 'include' }

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(apiUrl(path), {
    ...withCredentials,
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers as Record<string, string>),
    },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || res.statusText)
  }
  if (res.status === 204) {
    return undefined as T
  }
  return res.json() as Promise<T>
}

interface ListOptions {
  orderBy?: Record<string, 'asc' | 'desc'>
}

/** Accès données via API Node → MySQL `dzb_cake` (npm run server). */
export const database = {
  categories: {
    list: (): Promise<Category[]> => fetchJson('/categories'),
  },

  cakes: {
    list: (): Promise<CakeItem[]> => fetchJson('/cakes'),
    get: async (id: string): Promise<CakeItem | null> => {
      const res = await fetch(apiUrl(`/cakes/${encodeURIComponent(id)}`), withCredentials)
      if (res.status === 404) return null
      if (!res.ok) throw new Error(await res.text())
      return res.json() as Promise<CakeItem>
    },
    create: (data: Partial<CakeItem>): Promise<CakeItem> =>
      fetchJson('/cakes', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<CakeItem>): Promise<CakeItem> =>
      fetchJson(`/cakes/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    delete: async (id: string): Promise<void> => {
      const res = await fetch(apiUrl(`/cakes/${encodeURIComponent(id)}`), {
        ...withCredentials,
        method: 'DELETE',
      })
      if (!res.ok && res.status !== 204) {
        throw new Error(await res.text())
      }
    },
  },

  orders: {
    list: (opts?: ListOptions): Promise<OrderRow[]> => {
      const q =
        opts?.orderBy?.createdAt === 'desc' ? '?orderBy=createdAt%3Adesc' : ''
      return fetchJson(`/orders${q}`)
    },
    create: (data: Record<string, unknown>): Promise<OrderRow> =>
      fetchJson('/orders', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<OrderRow>): Promise<OrderRow> =>
      fetchJson(`/orders/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
  },

  inventory_items: {
    list: (): Promise<InventoryItem[]> => fetchJson('/inventory_items'),
  },
}
