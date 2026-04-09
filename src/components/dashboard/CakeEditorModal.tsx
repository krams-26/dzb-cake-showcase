import React from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, toast } from '@blinkdotnew/ui'
import { X } from 'lucide-react'
import { database } from '../../blink/db'
import { useI18n } from '../../contexts/I18nContext'
import { nameForLang } from '../../lib/catalog-i18n'
import type { CakeItem, Category } from '../../types/catalog'

const cakeFormSchema = z.object({
  categoryId: z.string().min(1),
  nameFr: z.string().min(1),
  nameEn: z.string().min(1),
  nameKr: z.string().min(1),
  descriptionFr: z.string().min(1),
  descriptionEn: z.string().min(1),
  descriptionKr: z.string().min(1),
  price: z.preprocess((v) => Number(v), z.number().positive()),
  imageUrl: z.union([z.string().url(), z.literal('')]),
})

type CakeFormValues = z.infer<typeof cakeFormSchema>

interface CakeEditorModalProps {
  open: boolean
  categories: Category[] | undefined
  initial: CakeItem | null
  onClose: () => void
}

export function CakeEditorModal({ open, categories, initial, onClose }: CakeEditorModalProps) {
  const { t, language } = useI18n()
  const queryClient = useQueryClient()
  const isEdit = Boolean(initial?.id)

  const form = useForm<CakeFormValues>({
    resolver: zodResolver(cakeFormSchema) as Resolver<CakeFormValues>,
    defaultValues: {
      categoryId: '',
      nameFr: '',
      nameEn: '',
      nameKr: '',
      descriptionFr: '',
      descriptionEn: '',
      descriptionKr: '',
      price: 10000,
      imageUrl: '',
    },
  })

  React.useEffect(() => {
    if (!open) return
    if (initial) {
      form.reset({
        categoryId: initial.categoryId,
        nameFr: initial.nameFr,
        nameEn: initial.nameEn,
        nameKr: initial.nameKr,
        descriptionFr: initial.descriptionFr,
        descriptionEn: initial.descriptionEn,
        descriptionKr: initial.descriptionKr,
        price: initial.price,
        imageUrl: initial.imageUrl || '',
      })
    } else {
      form.reset({
        categoryId: categories?.[0]?.id ?? '',
        nameFr: '',
        nameEn: '',
        nameKr: '',
        descriptionFr: '',
        descriptionEn: '',
        descriptionKr: '',
        price: 10000,
        imageUrl: '',
      })
    }
  }, [open, initial, categories, form])

  const saveMutation = useMutation({
    mutationFn: async (values: CakeFormValues) => {
      const payload = {
        ...values,
        imageUrl: values.imageUrl || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800',
      }
      if (isEdit && initial) {
        await database.cakes.update(initial.id, payload)
      } else {
        await database.cakes.create(payload)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cakes'] })
      queryClient.invalidateQueries({ queryKey: ['cakes-admin'] })
      toast.success(t('dashboard.cakeSaved'))
      onClose()
    },
    onError: () => {
      toast.error(t('order.error'))
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await database.cakes.delete(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cakes'] })
      queryClient.invalidateQueries({ queryKey: ['cakes-admin'] })
      toast.success(t('dashboard.cakeDeleted'))
      onClose()
    },
    onError: () => {
      toast.error(t('order.error'))
    },
  })

  if (!open) return null

  const inputClass =
    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-black/50" aria-label={t('dashboard.cakeForm.cancel')} onClick={onClose} />
      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border bg-card p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="text-lg font-semibold">
            {isEdit ? t('dashboard.cakeForm.titleEdit') : t('dashboard.cakeForm.titleNew')}
          </h2>
          <Button type="button" size="icon" variant="ghost" onClick={onClose} className="shrink-0">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form className="space-y-3" onSubmit={form.handleSubmit((v: CakeFormValues) => saveMutation.mutate(v))}>
          <div>
            <label className="mb-1 block text-sm font-medium">{t('dashboard.cakeForm.category')}</label>
            <select className={inputClass} {...form.register('categoryId')}>
              {categories?.map((c) => (
                <option key={c.id} value={c.id}>
                  {nameForLang(c, language)}
                </option>
              ))}
            </select>
          </div>
          {(['nameFr', 'nameEn', 'nameKr'] as const).map((field) => (
            <div key={field}>
              <label className="mb-1 block text-sm font-medium">{t(`dashboard.cakeForm.${field}`)}</label>
              <input className={inputClass} {...form.register(field)} />
            </div>
          ))}
          {(['descriptionFr', 'descriptionEn', 'descriptionKr'] as const).map((field) => (
            <div key={field}>
              <label className="mb-1 block text-sm font-medium">{t(`dashboard.cakeForm.${field}`)}</label>
              <textarea className={`${inputClass} min-h-[60px]`} {...form.register(field)} />
            </div>
          ))}
          <div>
            <label className="mb-1 block text-sm font-medium">{t('dashboard.cakeForm.price')}</label>
            <input className={inputClass} type="number" step="1" min="1" {...form.register('price')} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">{t('dashboard.cakeForm.imageUrl')}</label>
            <input className={inputClass} type="url" placeholder="https://..." {...form.register('imageUrl')} />
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              {t('dashboard.cakeForm.cancel')}
            </Button>
            <Button type="submit" disabled={saveMutation.isPending}>
              {t('dashboard.cakeForm.save')}
            </Button>
            {isEdit && initial && (
              <Button
                type="button"
                variant="destructive"
                disabled={deleteMutation.isPending}
                onClick={() => {
                  if (window.confirm(t('dashboard.confirmDelete'))) deleteMutation.mutate(initial.id)
                }}
              >
                {t('dashboard.deleteCake')}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
