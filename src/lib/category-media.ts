import { PLACEHOLDER_CAKE_IMAGE } from './placeholder-images'

/** Image optionnelle par id de catégorie (les catégories API n’ont pas de champ image). */
export const CATEGORY_COVER_IMAGE: Record<string, string> = {
  cat_wedding: 'https://images.unsplash.com/photo-1535254973040-607b474cb80d?auto=format&fit=crop&q=80&w=800',
  cat_birthday: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&q=80&w=800',
  cat_pastry: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=800',
  cat_custom: 'https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?auto=format&fit=crop&q=80&w=800',
}

export function coverImageForCategoryId(id: string): string {
  return CATEGORY_COVER_IMAGE[id] ?? PLACEHOLDER_CAKE_IMAGE
}
