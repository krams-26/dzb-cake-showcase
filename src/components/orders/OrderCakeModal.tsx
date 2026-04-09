import React from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Button, toast } from '@blinkdotnew/ui'
import { X } from 'lucide-react'
import { database } from '../../blink/db'
import { useI18n } from '../../contexts/I18nContext'
import type { CakeItem } from '../../types/catalog'

function buildSchema(t: (k: string) => string) {
  return z.object({
    customerName: z.string().min(2, t('order.name')),
    customerPhone: z.string().min(6, t('order.phone')),
    quantity: z.preprocess((v) => Number(v), z.number().int().min(1).max(99)),
    deliveryDate: z.string().optional(),
    note: z.string().optional(),
  })
}

type FormValues = z.infer<ReturnType<typeof buildSchema>>

interface OrderCakeModalProps {
  cake: CakeItem | null
  cakeDisplayName: string
  onClose: () => void
}

export function OrderCakeModal({ cake, cakeDisplayName, onClose }: OrderCakeModalProps) {
  const { t } = useI18n()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const schema = React.useMemo(() => buildSchema(t), [t])

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: {
      customerName: '',
      customerPhone: '',
      quantity: 1,
      deliveryDate: '',
      note: '',
    },
  })

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      if (!cake) throw new Error('no cake')
      const qty = values.quantity
      const line = {
        cakeId: cake.id,
        name: cakeDisplayName,
        quantity: qty,
        unitPrice: cake.price,
        note: values.note || undefined,
      }
      const total = cake.price * qty
      return database.orders.create({
        customerName: values.customerName,
        customerPhone: values.customerPhone,
        total,
        status: 'pending',
        createdAt: new Date().toISOString(),
        deliveryDate: values.deliveryDate || undefined,
        items: JSON.stringify([line]),
      })
    },
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      toast.success(t('order.success'))
      onClose()
      form.reset()
      const id = created && typeof created === 'object' && 'id' in created ? String((created as { id: string }).id) : undefined
      navigate({ to: '/order/confirmed', search: id ? { id } : {} })
    },
    onError: () => {
      toast.error(t('order.error'))
    },
  })

  if (!cake) return null

  const inputClass =
    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label={t('order.cancel')}
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md rounded-xl border bg-card p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">{t('order.title')}</h2>
            <p className="text-sm text-muted-foreground">{cakeDisplayName}</p>
          </div>
          <Button type="button" size="icon" variant="ghost" onClick={onClose} className="shrink-0">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form
          className="space-y-4"
          onSubmit={form.handleSubmit((v: FormValues) => mutation.mutate(v))}
        >
          <div>
            <label className="mb-1 block text-sm font-medium">{t('order.name')}</label>
            <input className={inputClass} {...form.register('customerName')} />
            {form.formState.errors.customerName && (
              <p className="mt-1 text-xs text-destructive">{form.formState.errors.customerName.message}</p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">{t('order.phone')}</label>
            <input className={inputClass} {...form.register('customerPhone')} />
            {form.formState.errors.customerPhone && (
              <p className="mt-1 text-xs text-destructive">{form.formState.errors.customerPhone.message}</p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">{t('order.qty')}</label>
            <input className={inputClass} type="number" min={1} max={99} {...form.register('quantity')} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">{t('order.date')}</label>
            <input className={inputClass} type="date" {...form.register('deliveryDate')} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">{t('order.note')}</label>
            <textarea className={`${inputClass} min-h-[80px]`} {...form.register('note')} />
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              {t('order.cancel')}
            </Button>
            <Button type="submit" className="flex-1" disabled={mutation.isPending}>
              {t('order.submit')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
