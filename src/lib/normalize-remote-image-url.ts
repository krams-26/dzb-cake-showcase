import { PLACEHOLDER_CAKE_IMAGE } from './placeholder-images'

/**
 * Rend une URL d’image exploitable en production (HTTPS, pas de localhost dans la DB).
 * Unsplash et d’autres CDN peuvent bloquer les requêtes avec un Referer « site déployé » ;
 * utiliser `referrerPolicy="no-referrer"` sur la balise img (voir SafeImage).
 */
export function normalizeRemoteImageUrl(url: string | null | undefined): string {
  let raw = url?.trim()
  if (!raw) return PLACEHOLDER_CAKE_IMAGE

  // URL protocol-relative souvent valide en local, à risque en prod selon la page
  if (raw.startsWith('//')) {
    raw = `https:${raw}`
  }

  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/i.test(raw)) {
    return PLACEHOLDER_CAKE_IMAGE
  }

  if (raw.startsWith('/')) {
    const base = typeof import.meta.env.VITE_API_BASE_URL === 'string'
      ? import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')
      : ''
    if (base) return `${base}${raw}`
    return PLACEHOLDER_CAKE_IMAGE
  }

  if (raw.startsWith('http://')) {
    const onHttps =
      typeof window !== 'undefined' && window.location?.protocol === 'https:'
    if (onHttps) return `https://${raw.slice('http://'.length)}`
  }

  return raw
}
