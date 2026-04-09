import type { Language } from '../contexts/I18nContext'

export function nameForLang(
  item: { nameFr: string; nameEn: string; nameKr: string },
  lang: Language,
) {
  if (lang === 'fr') return item.nameFr
  if (lang === 'en') return item.nameEn
  return item.nameKr
}

export function descForLang(
  item: { descriptionFr: string; descriptionEn: string; descriptionKr: string },
  lang: Language,
) {
  if (lang === 'fr') return item.descriptionFr
  if (lang === 'en') return item.descriptionEn
  return item.descriptionKr
}
