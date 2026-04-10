import { PLACEHOLDER_CAKE_IMAGE } from './placeholder-images'

/**
 * Images optionnelles par id de catégorie (aligné sur les seeds SQL : cat_wedding, …).
 */
export const CATEGORY_COVER_IMAGE: Record<string, string> = {
  cat_wedding:
    'https://images.unsplash.com/photo-1535254973040-607b474cb80d?auto=format&fit=crop&q=85&w=800&fm=webp',
  cat_birthday:
    'https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&q=85&w=800&fm=webp',
  cat_pastry:
    'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=85&w=800&fm=webp',
  cat_custom:
    'https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?auto=format&fit=crop&q=85&w=800&fm=webp',
}

/** Images supplémentaires pour les ids inconnus (prod : UUID, autre schéma, etc.). */
const EXTRA_COVER_URLS: string[] = [
  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=85&w=800&fm=webp',
  'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&q=85&w=800&fm=webp',
  'https://images.unsplash.com/photo-1562440499-64c9a111f713?auto=format&fit=crop&q=85&w=800&fm=webp',
  'https://images.unsplash.com/photo-1558636508-e0db86a17613?auto=format&fit=crop&q=85&w=800&fm=webp',
]

const COVER_IMAGE_POOL: string[] = [...Object.values(CATEGORY_COVER_IMAGE), ...EXTRA_COVER_URLS]

function stableIndexFromId(id: string, modulo: number): number {
  let h = 2166136261
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h) % modulo
}

export function coverImageForCategoryId(id: string): string {
  const known = CATEGORY_COVER_IMAGE[id]
  if (known) return known
  if (!id?.trim()) return PLACEHOLDER_CAKE_IMAGE
  return COVER_IMAGE_POOL[stableIndexFromId(id.trim(), COVER_IMAGE_POOL.length)] ?? PLACEHOLDER_CAKE_IMAGE
}
