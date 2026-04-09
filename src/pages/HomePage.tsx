import React from 'react'
import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@blinkdotnew/ui'
import { Skeleton } from '../components/ui/Skeleton'
import { motion } from 'framer-motion'
import { Cake, Star, Clock, MapPin, ChevronRight, ShoppingBag } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useI18n } from '../contexts/I18nContext'
import { database } from '../blink/db'
import { coverImageForCategoryId } from '../lib/category-media'
import { nameForLang } from '../lib/catalog-i18n'
import { PLACEHOLDER_CAKE_IMAGE } from '../lib/placeholder-images'
import { SafeImage } from '../components/ui/SafeImage'

const CATEGORY_ICONS: LucideIcon[] = [Cake, Star, Clock, ShoppingBag]

const HERO_IMG =
  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=1920'
const ABOUT_IMG =
  'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?auto=format&fit=crop&q=80&w=800'

export function HomePage() {
  const { t, language } = useI18n()

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => database.categories.list(),
  })

  return (
    <div className="flex flex-col overflow-x-hidden">
      <section className="relative flex min-h-[min(75vh,560px)] w-full flex-col justify-center overflow-hidden sm:min-h-[600px] lg:h-[80vh] lg:max-h-[920px]">
        <div className="absolute inset-0 z-0">
          <SafeImage
            src={HERO_IMG}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="container relative z-10 mx-auto flex flex-1 flex-col justify-center px-4 py-16 sm:py-20">
          <div className="max-w-2xl text-white">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-4 text-3xl font-bold leading-tight sm:mb-6 sm:text-5xl md:text-6xl lg:text-7xl"
            >
              {t('hero.title')}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6 text-base text-white/90 sm:mb-8 sm:text-lg md:text-xl"
            >
              {t('hero.subtitle')}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col gap-3 sm:flex-row sm:gap-4"
            >
              <Button size="lg" asChild className="bg-primary text-white hover:bg-primary/90">
                <Link to="/cakes">
                  {t('hero.cta')}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <MapPin className="mr-2 h-4 w-4" />
                {t('hero.location')}
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-secondary/30 py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center sm:mb-16">
            <h2 className="mb-4 text-2xl font-bold sm:text-4xl">{t('categories.title')}</h2>
            <div className="mx-auto h-1 w-20 rounded-full bg-primary" />
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-4">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-72 rounded-2xl sm:h-80" />
                ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-4">
              {(categories ?? []).map((category, i) => {
                const Icon = CATEGORY_ICONS[i % CATEGORY_ICONS.length]
                const label = nameForLang(category, language)
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="group relative h-72 overflow-hidden rounded-2xl shadow-elegant sm:h-80"
                  >
                    <SafeImage
                      src={coverImageForCategoryId(category.id)}
                      fallbackSrc={PLACEHOLDER_CAKE_IMAGE}
                      alt={label}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-4 text-white sm:p-6">
                      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 backdrop-blur-md">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg font-bold sm:text-xl">{label}</h3>
                      <Link
                        to="/cakes"
                        search={{ category: category.id }}
                        className="mt-2 inline-flex items-center text-sm font-medium text-primary hover:underline"
                      >
                        {t('categories.seeMore')} <ChevronRight className="ml-1 h-3 w-3" />
                      </Link>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
            <div className="relative mx-auto w-full max-w-lg md:max-w-none">
              <SafeImage
                src={ABOUT_IMG}
                alt=""
                className="w-full rounded-3xl shadow-2xl"
              />
              <div className="mt-4 flex justify-center sm:absolute sm:bottom-4 sm:right-4 sm:mt-0 md:-bottom-4 md:-right-4 lg:-bottom-6 lg:-right-6">
                <div className="flex h-28 w-28 flex-col justify-center rounded-full bg-primary p-4 text-center text-white shadow-lg sm:h-32 sm:w-32">
                  <span className="text-2xl font-bold">100%</span>
                  <span className="text-[10px] uppercase">{t('about.artisan')}</span>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <h2 className="text-2xl font-bold sm:text-4xl">{t('about.title')}</h2>
              <p className="text-base italic text-muted-foreground sm:text-lg">&quot;{t('about.quote')}&quot;</p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <span className="font-medium text-foreground">{t('about.bullet1')}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <span className="font-medium text-foreground">{t('about.bullet2')}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <span className="font-medium text-foreground">{t('about.bullet3')}</span>
                </div>
              </div>
              <Button size="lg" variant="outline" className="mt-4 w-full sm:w-auto">
                {t('about.cta')}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
