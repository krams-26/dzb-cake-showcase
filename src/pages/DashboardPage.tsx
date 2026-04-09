// @ts-nocheck — @blinkdotnew/ui prop types conflict with React 19 / r3f in this toolchain
import React, { useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Page,
  PageHeader,
  PageTitle,
  PageDescription,
  PageActions,
  PageBody,
  Button,
  DataTable,
  StatGroup,
  Stat,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Badge,
  toast,
  Persona,
  EmptyState,
  IconBadge,
  Card,
  CardContent,
} from '@blinkdotnew/ui'
import { Skeleton } from '../components/ui/Skeleton'
import {
  Plus,
  LayoutDashboard,
  ShoppingBag,
  PieChart,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  Cake,
  Utensils,
  AlertTriangle,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { database } from '../blink/db'
import { useI18n } from '../contexts/I18nContext'
import { nameForLang } from '../lib/catalog-i18n'
import { CakeEditorModal } from '../components/dashboard/CakeEditorModal'
import type { OrderRow, CakeItem } from '../types/catalog'

const INVENTORY_PREVIEW_KEYS = [
  { itemKey: 'inv.flour', qtyKey: 'inv.flour.qty', status: 'dashboard.inv.ok' as const },
  { itemKey: 'inv.butter', qtyKey: 'inv.butter.qty', status: 'dashboard.inv.ok' as const },
  { itemKey: 'inv.sugar', qtyKey: 'inv.sugar.qty', status: 'dashboard.inv.low' as const },
  { itemKey: 'inv.chocolate', qtyKey: 'inv.chocolate.qty', status: 'dashboard.inv.ok' as const },
]

function last7DaysOrderCounts(orders: OrderRow[]) {
  const rows: { label: string; count: number }[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    d.setDate(d.getDate() - i)
    const iso = d.toISOString().slice(0, 10)
    const count = orders.filter((o) => o.createdAt.slice(0, 10) === iso).length
    rows.push({
      label: d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
      count,
    })
  }
  return rows
}

export function DashboardPage() {
  const { t, language } = useI18n()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState('overview')
  const [cakeModalOpen, setCakeModalOpen] = useState(false)
  const [editingCake, setEditingCake] = useState<CakeItem | null>(null)

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => database.orders.list({ orderBy: { createdAt: 'desc' } }),
  })

  const { data: cakes, isLoading: cakesLoading } = useQuery({
    queryKey: ['cakes-admin'],
    queryFn: () => database.cakes.list(),
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => database.categories.list(),
  })

  const { data: inventoryFromDb, isError: inventoryError } = useQuery({
    queryKey: ['inventory'],
    queryFn: () => database.inventory_items.list(),
    retry: false,
  })

  const chartData = useMemo(() => last7DaysOrderCounts(orders ?? []), [orders])

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      database.orders.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      toast.success(t('dashboard.statusUpdated'))
    },
  })

  const statusConfig = (status: string) => {
    const variants: Record<string, { variant: string; icon: React.ReactNode; labelKey: string }> = {
      pending: { variant: 'outline', icon: <Clock className="mr-1 h-3 w-3" />, labelKey: 'dashboard.status.pending' },
      preparing: {
        variant: 'secondary',
        icon: <Utensils className="mr-1 h-3 w-3" />,
        labelKey: 'dashboard.status.preparing',
      },
      ready: {
        variant: 'default',
        icon: <CheckCircle2 className="mr-1 h-3 w-3" />,
        labelKey: 'dashboard.status.ready',
      },
      delivered: {
        variant: 'success',
        icon: <Package className="mr-1 h-3 w-3" />,
        labelKey: 'dashboard.status.delivered',
      },
      cancelled: {
        variant: 'destructive',
        icon: <XCircle className="mr-1 h-3 w-3" />,
        labelKey: 'dashboard.status.cancelled',
      },
    }
    const c = variants[status] || variants.pending
    return { ...c, label: t(c.labelKey) }
  }

  const orderColumns = [
    {
      accessorKey: 'customerName',
      header: t('dashboard.col.client'),
      cell: ({ row }: { row: { original: OrderRow } }) => (
        <Persona name={row.original.customerName} subtitle={row.original.customerPhone} />
      ),
    },
    {
      accessorKey: 'total',
      header: t('dashboard.col.total'),
      cell: ({ row }: { row: { original: OrderRow } }) => (
        <span className="font-medium">{row.original.total.toLocaleString()} BIF</span>
      ),
    },
    {
      accessorKey: 'status',
      header: t('dashboard.col.status'),
      cell: ({ row }: { row: { original: OrderRow } }) => {
        const cfg = statusConfig(row.original.status)
        return (
          <Badge variant={cfg.variant as 'default'} className="flex w-fit items-center">
            {cfg.icon}
            {cfg.label}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'createdAt',
      header: t('dashboard.col.date'),
      cell: ({ row }: { row: { original: OrderRow } }) =>
        new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }: { row: { original: OrderRow } }) => (
        <div className="flex gap-2">
          {row.original.status === 'pending' && (
            <Button
              size="sm"
              onClick={() => updateStatusMutation.mutate({ id: row.original.id, status: 'preparing' })}
            >
              {t('dashboard.action.prepare')}
            </Button>
          )}
          {row.original.status === 'preparing' && (
            <Button
              size="sm"
              onClick={() => updateStatusMutation.mutate({ id: row.original.id, status: 'ready' })}
            >
              {t('dashboard.action.ready')}
            </Button>
          )}
        </div>
      ),
    },
  ]

  const totalRevenue =
    orders?.reduce((acc, order) => acc + (order.status !== 'cancelled' ? order.total : 0), 0) || 0
  const pendingOrders = orders?.filter((o) => o.status === 'pending' || o.status === 'preparing').length || 0

  const openNewCake = () => {
    setEditingCake(null)
    setCakeModalOpen(true)
  }

  const openEditCake = (c: CakeItem) => {
    setEditingCake(c)
    setCakeModalOpen(true)
  }

  return (
    <Page>
      <PageHeader>
        <div className="flex items-center gap-3">
          <IconBadge icon={<LayoutDashboard />} size="lg" className="bg-primary/10 text-primary" />
          <div>
            <PageTitle>{t('nav.dashboard')}</PageTitle>
            <PageDescription>{t('dashboard.desc')}</PageDescription>
          </div>
        </div>
        <PageActions>
          <Button
            onClick={() => {
              openNewCake()
              setActiveTab('catalog')
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            {t('dashboard.newCake')}
          </Button>
        </PageActions>
      </PageHeader>

      <PageBody>
        <StatGroup className="mb-8">
          <Stat
            label={t('dashboard.revenue')}
            value={`${totalRevenue.toLocaleString()} BIF`}
            icon={<PieChart />}
            trend={12.5}
            trendLabel={t('dashboard.revenueTrend')}
          />
          <Stat label={t('dashboard.pendingOrders')} value={pendingOrders} icon={<ShoppingBag />} />
          <Stat label={t('dashboard.cakeCount')} value={cakes?.length || 0} icon={<Cake />} />
        </StatGroup>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 flex flex-wrap gap-1">
            <TabsTrigger value="overview">{t('dashboard.tab.overview')}</TabsTrigger>
            <TabsTrigger value="orders">{t('dashboard.tab.orders')}</TabsTrigger>
            <TabsTrigger value="catalog">{t('dashboard.tab.catalog')}</TabsTrigger>
            <TabsTrigger value="inventory">{t('dashboard.tab.inventory')}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="mb-8 rounded-xl border bg-card p-4">
              <h3 className="mb-4 text-sm font-semibold">{t('dashboard.chart.title')}</h3>
              {chartData.every((d) => d.count === 0) ? (
                <p className="text-sm text-muted-foreground">{t('dashboard.chart.empty')}</p>
              ) : (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name={t('dashboard.tab.orders')} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-bold">{t('dashboard.urgent')}</h3>
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  </div>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {t('dashboard.urgentCount').replace('{n}', String(pendingOrders))}
                  </p>
                  <Button variant="outline" className="w-full" onClick={() => setActiveTab('orders')}>
                    {t('dashboard.viewOrders')}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-bold">{t('dashboard.marketTitle')}</h3>
                    <ShoppingBag className="h-5 w-5 text-primary" />
                  </div>
                  <p className="mb-4 text-sm text-muted-foreground">{t('dashboard.marketDesc')}</p>
                  <Button variant="outline" className="w-full" onClick={() => setActiveTab('inventory')}>
                    {t('dashboard.manageMarket')}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders">
            {ordersLoading ? (
              <div className="space-y-4">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
              </div>
            ) : orders?.length === 0 ? (
              <EmptyState
                icon={<ShoppingBag className="h-12 w-12 text-muted-foreground" />}
                title={t('dashboard.ordersEmptyTitle')}
                description={t('dashboard.ordersEmptyDesc')}
              />
            ) : (
              <DataTable columns={orderColumns} data={orders || []} searchable searchColumn="customerName" />
            )}
          </TabsContent>

          <TabsContent value="catalog">
            <div className="mb-4 flex justify-end">
              <Button onClick={openNewCake}>
                <Plus className="mr-2 h-4 w-4" />
                {t('dashboard.newCake')}
              </Button>
            </div>
            {cakesLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-40 w-full rounded-xl" />
                  ))}
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {(cakes ?? []).map((c) => (
                  <Card key={c.id}>
                    <CardContent className="flex flex-col gap-3 pt-6">
                      <div className="font-semibold">{nameForLang(c, language)}</div>
                      <div className="text-sm text-muted-foreground">
                        {c.price.toLocaleString()} BIF
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => openEditCake(c)}>
                          {t('dashboard.editCake')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="inventory">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">{t('dashboard.inventoryTitle')}</h3>
              <p className="text-sm text-muted-foreground">{t('dashboard.inventoryDesc')}</p>
            </div>
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">{t('dashboard.inventory.col.item')}</th>
                    <th className="px-4 py-3 text-left font-medium">{t('dashboard.inventory.col.qty')}</th>
                    <th className="px-4 py-3 text-left font-medium">{t('dashboard.inventory.col.status')}</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryFromDb && inventoryFromDb.length > 0 ? (
                    inventoryFromDb.map((row) => (
                      <tr key={row.id} className="border-t border-border">
                        <td className="px-4 py-3">{nameForLang(row, language)}</td>
                        <td className="px-4 py-3 text-muted-foreground">{row.quantityLabel}</td>
                        <td className="px-4 py-3">
                          {row.status === 'low' ? t('dashboard.inv.low') : t('dashboard.inv.ok')}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <>
                      <tr>
                        <td colSpan={3} className="px-4 py-3 text-sm text-muted-foreground">
                          {inventoryError ? t('dashboard.inventoryFallback') : t('dashboard.inventoryDesc')}
                        </td>
                      </tr>
                      {INVENTORY_PREVIEW_KEYS.map((row) => (
                        <tr key={row.itemKey} className="border-t border-border">
                          <td className="px-4 py-3">{t(row.itemKey)}</td>
                          <td className="px-4 py-3 text-muted-foreground">{t(row.qtyKey)}</td>
                          <td className="px-4 py-3">{t(row.status)}</td>
                        </tr>
                      ))}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </PageBody>

      <CakeEditorModal
        open={cakeModalOpen}
        categories={categories}
        initial={editingCake}
        onClose={() => {
          setCakeModalOpen(false)
          setEditingCake(null)
        }}
      />
    </Page>
  )
}
