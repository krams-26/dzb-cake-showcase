import React from 'react'
import { Link, useSearch } from '@tanstack/react-router'
import { Button } from '@blinkdotnew/ui'
import { CheckCircle2 } from 'lucide-react'
import { useI18n } from '../contexts/I18nContext'

export function OrderConfirmedPage() {
  const { t } = useI18n()
  const search = useSearch({ from: '/order/confirmed' }) as { id?: string }

  return (
    <div className="container mx-auto max-w-lg px-4 py-24 text-center">
      <div className="mb-6 flex justify-center">
        <CheckCircle2 className="h-16 w-16 text-primary" aria-hidden />
      </div>
      <h1 className="mb-4 text-2xl font-bold">{t('order.confirmedTitle')}</h1>
      <p className="mb-2 text-muted-foreground">{t('order.confirmedBody')}</p>
      {search.id ? (
        <p className="mb-8 font-mono text-xs text-muted-foreground">ID: {search.id}</p>
      ) : (
        <div className="mb-8" />
      )}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button asChild variant="outline">
          <Link to="/cakes">{t('order.backCatalog')}</Link>
        </Button>
        <Button asChild>
          <Link to="/">{t('order.backHome')}</Link>
        </Button>
      </div>
    </div>
  )
}
