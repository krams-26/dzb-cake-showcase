import React from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Button } from '@blinkdotnew/ui'
import { cn } from '../../lib/utils'
import { LayoutDashboard, Cake, ShoppingBag, Home, LogOut } from 'lucide-react'
import { useI18n } from '../../contexts/I18nContext'
import { useStaffAuth } from '../../contexts/StaffAuthContext'

const linkClass =
  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground'

export function DashboardSidebar() {
  const { t } = useI18n()
  const { logout } = useStaffAuth()
  const navigate = useNavigate()

  return (
    <nav className="flex flex-col gap-1 p-4">
      <Link to="/dashboard" className={cn(linkClass)}>
        <LayoutDashboard className="h-4 w-4 shrink-0" />
        {t('dashboard.tab.overview')}
      </Link>
      <Link to="/cakes" className={cn(linkClass)}>
        <Cake className="h-4 w-4 shrink-0" />
        {t('nav.cakes')}
      </Link>
      <Link to="/" className={cn(linkClass)}>
        <Home className="h-4 w-4 shrink-0" />
        {t('nav.home')}
      </Link>
      <p className="mt-4 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {t('dashboard.sidebar.quick')}
      </p>
      <span className={cn(linkClass, 'cursor-default opacity-60')} title={t('dashboard.sidebar.ordersHint')}>
        <ShoppingBag className="h-4 w-4 shrink-0" />
        {t('dashboard.tab.orders')}
      </span>

      <div className="mt-6 border-t border-border pt-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-destructive hover:text-destructive"
          onClick={async () => {
            await logout()
            await navigate({ to: '/login', replace: true })
          }}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {t('nav.logout')}
        </Button>
      </div>
    </nav>
  )
}
