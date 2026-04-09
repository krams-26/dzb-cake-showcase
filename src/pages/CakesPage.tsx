import React, { useState } from 'react'
import { useSearch, useNavigate, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Button, Card, CardContent, CardFooter, Badge, EmptyState } from '@blinkdotnew/ui'
import { Skeleton } from '../components/ui/Skeleton'
import { ShoppingCart, Search, Cake } from 'lucide-react'
import { database } from '../blink/db'
import { useI18n } from '../contexts/I18nContext'
import { nameForLang, descForLang } from '../lib/catalog-i18n'
import { OrderCakeModal } from '../components/orders/OrderCakeModal'
import { SafeImage } from '../components/ui/SafeImage'
import { PLACEHOLDER_CAKE_IMAGE } from '../lib/placeholder-images'
import type { CakeItem } from '../types/catalog'

export function CakesPage() {
  const { t, language } = useI18n()
  const navigate = useNavigate()
  const search = useSearch({ from: '/cakes' }) as { category?: string }
  const selectedCategory = search.category ?? 'all'
  const [searchQuery, setSearchQuery] = useState('')
  const [orderCake, setOrderCake] = useState<CakeItem | null>(null)

  const setSelectedCategory = (id: string) => {
    navigate({
      to: '/cakes',
      search: id === 'all' ? {} : { category: id },
      replace: true,
    })
  }

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => database.categories.list(),
  })

  const { data: cakes, isLoading: cakesLoading } = useQuery({
    queryKey: ['cakes'],
    queryFn: () => database.cakes.list(),
  })

  const filteredCakes = cakes?.filter((cake) => {
    const matchesCategory = selectedCategory === 'all' || cake.categoryId === selectedCategory
    const cakeName = nameForLang(cake, language)?.toLowerCase() || ''
    const matchesSearch = cakeName.includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="container mx-auto max-w-7xl overflow-x-hidden px-4 py-8 sm:py-12">
      <div className="mb-8 flex flex-col items-center gap-6 text-center sm:mb-12 md:flex-row md:justify-between md:text-left">
        <div>
          <h1 className="mb-2 text-3xl font-bold sm:text-4xl">{t('nav.cakes')}</h1>
          <p className="text-muted-foreground">{t('cakes.subtitle')}</p>
        </div>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder={t('cakes.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-full border border-input bg-background pl-10 pr-4 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
      </div>

      <div className="mb-8 flex flex-wrap gap-2 sm:mb-12">
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('all')}
          className="rounded-full"
        >
          {t('cakes.all')}
        </Button>
        {categoriesLoading
          ? Array(4)
              .fill(0)
              .map((_, i) => <Skeleton key={i} className="h-10 w-24 rounded-full" />)
          : categories?.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(cat.id)}
                className="rounded-full"
              >
                {nameForLang(cat, language)}
              </Button>
            ))}
      </div>

      {cakesLoading ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-square w-full rounded-2xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
        </div>
      ) : filteredCakes?.length === 0 ? (
        <EmptyState
          icon={<Cake className="h-12 w-12 text-muted-foreground" />}
          title={t('cakes.emptyTitle')}
          description={t('cakes.emptyDesc')}
          action={{
            label: t('cakes.showAll'),
            onClick: () => {
              setSelectedCategory('all')
              setSearchQuery('')
            },
          }}
        />
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredCakes?.map((cake) => (
            <Card
              key={cake.id}
              className="group overflow-hidden border-none shadow-elegant transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="relative aspect-square overflow-hidden">
                <SafeImage
                  src={cake.imageUrl || PLACEHOLDER_CAKE_IMAGE}
                  fallbackSrc={PLACEHOLDER_CAKE_IMAGE}
                  alt={nameForLang(cake, language)}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute right-4 top-4">
                  <Badge className="bg-white/80 text-primary backdrop-blur-md">
                    {cake.price.toLocaleString()} BIF
                  </Badge>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="mb-2 text-xl font-bold">{nameForLang(cake, language)}</h3>
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {descForLang(cake, language)}
                </p>
                <Link
                  to="/cakes/$cakeId"
                  params={{ cakeId: cake.id }}
                  className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
                >
                  {t('cake.viewDetail')}
                </Link>
              </CardContent>
              <CardFooter className="flex gap-2 p-6 pt-0">
                <Button className="w-full gap-2" onClick={() => setOrderCake(cake)}>
                  <ShoppingCart className="h-4 w-4" />
                  {t('cakes.order')}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <OrderCakeModal
        cake={orderCake}
        cakeDisplayName={orderCake ? nameForLang(orderCake, language) : ''}
        onClose={() => setOrderCake(null)}
      />
    </div>
  )
}
