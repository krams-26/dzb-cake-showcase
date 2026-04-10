import React, { useState } from 'react'
import {
  FALLBACK_CAKE_IMAGE,
  PLACEHOLDER_CAKE_IMAGE,
  TERTIARY_CAKE_IMAGE,
} from '../../lib/placeholder-images'
import { normalizeRemoteImageUrl } from '../../lib/normalize-remote-image-url'

type SafeImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  fallbackSrc?: string
}

/**
 * Affiche une image ; en cas d’erreur de chargement, bascule vers des URLs de repli.
 */
function uniqueUrls(...urls: (string | undefined)[]): string[] {
  const out: string[] = []
  for (const u of urls) {
    const s = u?.trim()
    if (s && !out.includes(s)) out.push(s)
  }
  return out
}

export function SafeImage({ src, fallbackSrc, onError, alt, referrerPolicy, ...rest }: SafeImageProps) {
  const [step, setStep] = useState(0)
  const primary = normalizeRemoteImageUrl(src)
  const chain = uniqueUrls(
    primary,
    fallbackSrc ? normalizeRemoteImageUrl(fallbackSrc) : undefined,
    PLACEHOLDER_CAKE_IMAGE,
    FALLBACK_CAKE_IMAGE,
    TERTIARY_CAKE_IMAGE,
  )

  const current = chain[Math.min(step, chain.length - 1)] ?? PLACEHOLDER_CAKE_IMAGE

  return (
    <img
      {...rest}
      src={current}
      alt={alt ?? ''}
      referrerPolicy={referrerPolicy ?? 'no-referrer'}
      loading={rest.loading ?? 'lazy'}
      decoding={rest.decoding ?? 'async'}
      onError={(e) => {
        if (step < chain.length - 1) setStep((s) => s + 1)
        onError?.(e)
      }}
    />
  )
}
