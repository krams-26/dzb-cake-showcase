import * as React from 'react'
import { cn } from '../../lib/utils'

/** Placeholder de chargement (équivalent Blink UI) — évite une référence manquante au bundle. */
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-[hsl(var(--muted))]', className)}
      {...props}
    />
  )
}
