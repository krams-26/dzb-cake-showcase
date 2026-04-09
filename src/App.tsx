import React, { Suspense, lazy } from 'react'
import {
  createRouter,
  createRoute,
  createRootRouteWithContext,
  RouterProvider,
  Outlet,
  redirect,
  useRouterState,
} from '@tanstack/react-router'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { Shell } from './Shell'
import { DashboardSidebar } from './components/dashboard/DashboardSidebar'
import { useI18n } from './contexts/I18nContext'
import { useStaffAuth } from './contexts/StaffAuthContext'
import { z } from 'zod'

const HomePage = lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })))
const CakesPage = lazy(() => import('./pages/CakesPage').then((m) => ({ default: m.CakesPage })))
const CakeDetailPage = lazy(() => import('./pages/CakeDetailPage').then((m) => ({ default: m.CakeDetailPage })))
const OrderConfirmedPage = lazy(() =>
  import('./pages/OrderConfirmedPage').then((m) => ({ default: m.OrderConfirmedPage })),
)
const DashboardPage = lazy(() => import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage })))
const LoginPage = lazy(() => import('./pages/LoginPage').then((m) => ({ default: m.LoginPage })))

function RouteFallback() {
  const { t } = useI18n()
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 px-4">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      <p className="text-sm text-muted-foreground">{t('loading.app')}</p>
    </div>
  )
}

function withSuspense(LazyComponent: React.LazyExoticComponent<React.ComponentType>) {
  return function SuspenseWrap() {
    return (
      <Suspense fallback={<RouteFallback />}>
        <LazyComponent />
      </Suspense>
    )
  }
}

export interface AppRouterContext {
  auth: {
    isStaff: boolean
  }
}

function RootLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const isDashboard = pathname.startsWith('/dashboard')
  const isLogin = pathname.startsWith('/login')

  if (isDashboard || isLogin) {
    return <Outlet />
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

function DashboardRoute() {
  return (
    <Shell sidebar={<DashboardSidebar />} appName="DzB Cake">
      <Suspense fallback={<RouteFallback />}>
        <DashboardPage />
      </Suspense>
    </Shell>
  )
}

const rootRoute = createRootRouteWithContext<AppRouterContext>()({
  component: RootLayout,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: withSuspense(HomePage),
})

const cakesSearchSchema = z.object({
  category: z.string().optional(),
})

const cakesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cakes',
  validateSearch: (search) => cakesSearchSchema.parse(search),
  component: withSuspense(CakesPage),
})

const cakeDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cakes/$cakeId',
  component: withSuspense(CakeDetailPage),
})

const orderConfirmedSearchSchema = z.object({
  id: z.string().optional(),
})

const orderConfirmedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/order/confirmed',
  validateSearch: (search) => orderConfirmedSearchSchema.parse(search),
  component: withSuspense(OrderConfirmedPage),
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  beforeLoad: ({ context }) => {
    if (context.auth.isStaff) {
      throw redirect({ to: '/dashboard', replace: true })
    }
  },
  component: withSuspense(LoginPage),
})

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  beforeLoad: ({ context }) => {
    if (!context.auth.isStaff) {
      throw redirect({ to: '/login', replace: true })
    }
  },
  component: DashboardRoute,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  cakesRoute,
  cakeDetailRoute,
  orderConfirmedRoute,
  loginRoute,
  dashboardRoute,
])

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  context: {
    auth: { isStaff: false },
  },
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export default function App() {
  const { authReady, isStaff } = useStaffAuth()
  const { t } = useI18n()

  if (!authReady) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
          <p className="text-sm font-medium text-muted-foreground">{t('loading.app')}</p>
        </div>
      </div>
    )
  }

  return <RouterProvider router={router} context={{ auth: { isStaff } }} />
}
