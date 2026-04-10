// @ts-nocheck — @blinkdotnew/ui prop types conflict with React 19 / r3f in this toolchain
import React, { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  Persona,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@blinkdotnew/ui'
import { Cake, Languages, LayoutDashboard, LogOut, Menu } from 'lucide-react'
import { useI18n } from '../../contexts/I18nContext'
import { useStaffAuth } from '../../contexts/StaffAuthContext'

export function Navbar() {
  const { setLanguage, t } = useI18n()
  const { isStaff, staff, logout } = useStaffAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const mobileNav = (
    <nav className="flex flex-col gap-1 pt-2">
      <SheetClose asChild>
        <Link
          to="/"
          className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
        >
          {t('nav.home')}
        </Link>
      </SheetClose>
      <SheetClose asChild>
        <Link
          to="/cakes"
          className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
        >
          {t('nav.cakes')}
        </Link>
      </SheetClose>
      {isStaff && (
        <SheetClose asChild>
          <Link
            to="/dashboard"
            className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            {t('nav.dashboard')}
          </Link>
        </SheetClose>
      )}
      <SheetClose asChild>
        <Link
          to="/login"
          className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          {t('nav.staffLogin')}
        </Link>
      </SheetClose>
    </nav>
  )

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-background/75">
      <div className="container mx-auto flex h-16 items-center justify-between gap-2 px-4">
        <div className="flex min-w-0 flex-1 items-center gap-2 md:gap-4">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0 md:hidden" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[min(100vw,320px)]">
              <SheetHeader>
                <SheetTitle className="text-left">{t('nav.menu')}</SheetTitle>
              </SheetHeader>
              {mobileNav}
            </SheetContent>
          </Sheet>

          <Link
            to="/"
            className="flex min-w-0 cursor-pointer items-center gap-2 rounded-md transition-opacity duration-normal hover:opacity-90"
          >
            <Cake className="h-8 w-8 shrink-0 text-primary" aria-hidden />
            <span className="font-heading truncate text-xl font-semibold tracking-tight text-primary sm:text-2xl">
              DzB Cake
            </span>
          </Link>
        </div>

        <div className="hidden items-center gap-1 md:flex md:gap-2">
          <Link
            to="/"
            className="cursor-pointer rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors duration-normal hover:bg-secondary/80 hover:text-primary"
          >
            {t('nav.home')}
          </Link>
          <Link
            to="/cakes"
            className="cursor-pointer rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors duration-normal hover:bg-secondary/80 hover:text-primary"
          >
            {t('nav.cakes')}
          </Link>
          {isStaff && (
            <Link
              to="/dashboard"
              className="cursor-pointer rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors duration-normal hover:bg-secondary/80 hover:text-primary"
            >
              {t('nav.dashboard')}
            </Link>
          )}
          <Link
            to="/login"
            className="cursor-pointer rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors duration-normal hover:bg-secondary/60 hover:text-foreground"
          >
            {t('nav.staffLogin')}
          </Link>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Languages className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage('fr')}>
                {t('lang.fr')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('en')}>
                {t('lang.en')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('kr')}>
                {t('lang.kr')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {isStaff ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-0 hover:bg-transparent">
                  <Persona
                    name={staff?.email || 'Staff'}
                    className="cursor-pointer"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate({ to: '/dashboard' })}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  {t('nav.dashboard')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={async () => {
                    await logout()
                    await navigate({ to: '/', replace: true })
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4 text-destructive" />
                  <span className="text-destructive">{t('nav.logout')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      </div>
    </nav>
  )
}
