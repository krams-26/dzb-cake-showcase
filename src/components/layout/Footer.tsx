import React, { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Cake, Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react'
import { toast } from '@blinkdotnew/ui'
import { useI18n } from '../../contexts/I18nContext'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function Footer() {
  const { t } = useI18n()
  const year = new Date().getFullYear()
  const [newsletterEmail, setNewsletterEmail] = useState('')

  function onSubscribe(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = newsletterEmail.trim()
    if (!trimmed || !EMAIL_RE.test(trimmed)) {
      toast.error(t('footer.subscribeInvalid'))
      return
    }
    toast.success(t('footer.subscribeSuccess'))
    setNewsletterEmail('')
  }

  return (
    <footer className="border-t border-border/60 bg-secondary/25 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-10 sm:py-12">
        <div className="grid grid-cols-1 gap-10 sm:gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link
              to="/"
              className="flex cursor-pointer items-center gap-2 rounded-md transition-opacity duration-normal hover:opacity-90"
            >
              <Cake className="h-8 w-8 text-primary" aria-hidden />
              <span className="font-heading text-2xl font-semibold tracking-tight text-primary">DzB Cake</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              {t('hero.subtitle')}
            </p>
            <div className="flex gap-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex cursor-pointer rounded-md p-2 text-muted-foreground transition-colors duration-normal hover:bg-background/80 hover:text-primary"
              >
                <Instagram className="h-5 w-5" aria-hidden />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex cursor-pointer rounded-md p-2 text-muted-foreground transition-colors duration-normal hover:bg-background/80 hover:text-primary"
              >
                <Facebook className="h-5 w-5" aria-hidden />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex cursor-pointer rounded-md p-2 text-muted-foreground transition-colors duration-normal hover:bg-background/80 hover:text-primary"
              >
                <Twitter className="h-5 w-5" aria-hidden />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider">{t('nav.home')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-primary">{t('nav.home')}</Link></li>
              <li><Link to="/cakes" className="hover:text-primary">{t('nav.cakes')}</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider">{t('footer.contact')}</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                <span>{t('footer.phone')}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <span>{t('footer.email')}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 translate-y-1 text-primary" />
                <span>
                  {t('footer.addressLine1')}
                  <br />
                  {t('footer.addressLine2')}
                </span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider">{t('footer.newsletter')}</h4>
            <p className="text-sm text-muted-foreground">{t('footer.newsletterDesc')}</p>
            <form onSubmit={onSubscribe} className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
              <input
                type="email"
                name="newsletter-email"
                autoComplete="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder={t('footer.emailPlaceholder')}
                className="flex h-10 min-w-0 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <button
                type="submit"
                className="inline-flex h-10 shrink-0 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {t('footer.subscribe')}
              </button>
            </form>
          </div>
        </div>
        <div className="mt-10 space-y-4 border-t pt-8 text-center text-sm text-muted-foreground sm:mt-12">
          <p>&copy; {year} DzB Cake Bujumbura. {t('footer.rights')}</p>
          <p className="text-xs text-muted-foreground/90">{t('footer.credit')}</p>
        </div>
      </div>
    </footer>
  )
}
