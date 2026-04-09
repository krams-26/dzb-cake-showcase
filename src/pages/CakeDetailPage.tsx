import React from 'react'
import { Link, useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Button, Badge } from '@blinkdotnew/ui'
import { Skeleton } from '../components/ui/Skeleton'
import { ArrowLeft, ShoppingCart } from 'lucide-react'
import { database } from '../blink/db'
import { useI18n } from '../contexts/I18nContext'
import { nameForLang, descForLang } from '../lib/catalog-i18n'
import { OrderCakeModal } from '../components/orders/OrderCakeModal'
import { SafeImage } from '../components/ui/SafeImage'
import { PLACEHOLDER_CAKE_IMAGE } from '../lib/placeholder-images'
import type { CakeItem } from '../types/catalog'

export function CakeDetailPage() {
  const { cakeId } = useParams({ from: '/cakes/$cakeId' })
  const { t, language } = useI18n()
  const [orderCake, setOrderCake] = React.useState<CakeItem | null>(null)

  const { data: cake, isLoading, isError } = useQuery({
    queryKey: ['cake', cakeId],
    queryFn: async () => {
      const row = await database.cakes.get(cakeId)
      return row
    },
    enabled: Boolean(cakeId),
  })

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl overflow-x-hidden px-4 py-8 sm:py-12">
        <Skeleton className="mb-6 h-10 w-48" />
        <Skeleton className="aspect-video w-full rounded-2xl" />
        <Skeleton className="mt-6 h-8 w-2/3" />
        <Skeleton className="mt-4 h-24 w-full" />
      </div>
    )
  }

  if (isError || !cake) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="mb-4 text-2xl font-bold">{t('cake.notFound')}</h1>
        <Button asChild variant="outline">
          <Link to="/cakes">{t('cake.backToCatalog')}</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl overflow-x-hidden px-4 py-8 sm:py-12">
      <Button variant="ghost" className="mb-6 gap-2" asChild>
        <Link to="/cakes">
          <ArrowLeft className="h-4 w-4" />
          {t('cake.backToCatalog')}
        </Link>
      </Button>

      <div className="grid gap-8 sm:gap-10 md:grid-cols-2 md:items-start">
        <div className="relative overflow-hidden rounded-2xl shadow-elegant">
          <SafeImage
            src={cake.imageUrl || PLACEHOLDER_CAKE_IMAGE}
            fallbackSrc={PLACEHOLDER_CAKE_IMAGE}
            alt={nameForLang(cake, language)}
            className="aspect-square w-full object-cover md:aspect-auto md:max-h-[480px]"
          />
        </div>
        <div className="min-w-0">
          <Badge className="mb-4">{cake.price.toLocaleString()} BIF</Badge>
          <h1 className="mb-4 text-2xl font-bold sm:text-3xl">{nameForLang(cake, language)}</h1>
          <p className="mb-8 text-lg text-muted-foreground">{descForLang(cake, language)}</p>
          <Button size="lg" className="gap-2" onClick={() => setOrderCake(cake)}>
            <ShoppingCart className="h-5 w-5" />
            {t('cakes.order')}
          </Button>
        </div>
      </div>

      <OrderCakeModal
        cake={orderCake}
        cakeDisplayName={orderCake ? nameForLang(orderCake, language) : ''}
        onClose={() => setOrderCake(null)}
      />
    </div>
  )
}
