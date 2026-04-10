import React from 'react'
import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@blinkdotnew/ui'
import { Skeleton } from '../components/ui/Skeleton'
import { motion, useReducedMotion } from 'framer-motion'
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
  const reduceMotion = useReducedMotion()
  const heroMotion = reduceMotion
    ? { initial: false as const, animate: { opacity: 1, y: 0 } }
    : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }

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
            className="h-full w-full object-cover motion-reduce:scale-100 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/55 via-black/35 to-primary/25" />
        </div>

        <div className="container relative z-10 mx-auto flex flex-1 flex-col justify-center px-4 py-16 sm:py-20">
          <div className="max-w-2xl text-white">
            <motion.h1
              {...heroMotion}
              transition={{ duration: reduceMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="font-heading mb-4 text-4xl font-semibold leading-[1.1] tracking-tight sm:mb-6 sm:text-5xl md:text-6xl lg:text-7xl"
            >
              {t('hero.title')}
            </motion.h1>
            <motion.p
              {...heroMotion}
              transition={{
                duration: reduceMotion ? 0 : 0.55,
                delay: reduceMotion ? 0 : 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mb-6 max-w-xl text-base leading-relaxed text-white/92 sm:mb-8 sm:text-lg md:text-xl"
            >
              {t('hero.subtitle')}
            </motion.p>
            <motion.div
              {...heroMotion}
              transition={{
                duration: reduceMotion ? 0 : 0.55,
                delay: reduceMotion ? 0 : 0.22,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex flex-col gap-3 sm:flex-row sm:gap-4"
            >
              <Button
                size="lg"
                asChild
                className="cursor-pointer bg-accent text-accent-foreground shadow-lg transition-all duration-normal ease-smooth hover:bg-accent/92 hover:shadow-xl"
              >
                <Link to="/cakes" className="cursor-pointer">
                  {t('hero.cta')}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="cursor-pointer border-white/80 bg-white/5 text-white backdrop-blur-sm transition-colors duration-normal hover:bg-white/15"
              >
                <MapPin className="mr-2 h-4 w-4" />
                {t('hero.location')}
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-secondary/40 py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center sm:mb-16">
            <h2 className="font-heading mb-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              {t('categories.title')}
            </h2>
            <div className="mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-primary via-accent to-primary/60" />
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
                    initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
                    whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: reduceMotion ? 0 : 0.45, delay: reduceMotion ? 0 : i * 0.08 }}
                    className="group relative h-72 overflow-hidden rounded-2xl shadow-card ring-1 ring-black/[0.04] transition-shadow duration-normal hover:shadow-lg sm:h-80"
                  >
                    <SafeImage
                      src={coverImageForCategoryId(category.id)}
                      fallbackSrc={PLACEHOLDER_CAKE_IMAGE}
                      alt={label}
                      className={`h-full w-full object-cover ${reduceMotion ? '' : 'transition-transform duration-slow ease-smooth group-hover:scale-105'}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-4 text-white sm:p-6">
                      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 backdrop-blur-md">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="font-heading text-xl font-semibold sm:text-2xl">{label}</h3>
                      <Link
                        to="/cakes"
                        search={{ category: category.id }}
                        className="mt-2 inline-flex cursor-pointer items-center text-sm font-medium text-white/95 underline-offset-4 transition-colors duration-normal hover:text-accent hover:underline"
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
                className="w-full rounded-3xl shadow-soft ring-1 ring-border/60"
              />
              <div className="mt-4 flex justify-center sm:absolute sm:bottom-4 sm:right-4 sm:mt-0 md:-bottom-4 md:-right-4 lg:-bottom-6 lg:-right-6">
                <div className="flex h-28 w-28 flex-col justify-center rounded-full bg-primary p-4 text-center text-primary-foreground shadow-card sm:h-32 sm:w-32">
                  <span className="font-heading text-3xl font-semibold">100%</span>
                  <span className="text-[10px] font-medium uppercase tracking-wider opacity-90">{t('about.artisan')}</span>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">{t('about.title')}</h2>
              <p className="font-serif text-lg italic leading-relaxed text-muted-foreground sm:text-xl">
                &quot;{t('about.quote')}&quot;
              </p>
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
              <Button
                size="lg"
                variant="outline"
                className="mt-4 w-full cursor-pointer border-primary/25 transition-colors duration-normal hover:border-primary/40 hover:bg-secondary/50 sm:w-auto"
              >
                {t('about.cta')}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
