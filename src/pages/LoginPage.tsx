// @ts-nocheck — @blinkdotnew/ui Label types conflict with React 19 in this toolchain
import React, { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle } from '@blinkdotnew/ui'
import { Cake } from 'lucide-react'
import { useI18n } from '../contexts/I18nContext'
import { useStaffAuth } from '../contexts/StaffAuthContext'

export function LoginPage() {
  const { t } = useI18n()
  const { login } = useStaffAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setPending(true)
    try {
      await login(email, password)
      await navigate({ to: '/dashboard', replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : t('login.error'))
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <Link to="/" className="mb-8 flex items-center gap-2 text-primary">
        <Cake className="h-10 w-10" />
        <span className="text-2xl font-bold tracking-tight">DzB Cake</span>
      </Link>
      <Card className="w-full max-w-md border-border shadow-lg">
        <CardHeader>
          <CardTitle>{t('login.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="space-y-2">
              <Label htmlFor="staff-email">{t('login.email')}</Label>
              <Input
                id="staff-email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="staff-password">{t('login.password')}</Label>
              <Input
                id="staff-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? t('login.pending') : t('login.submit')}
            </Button>
            <Button type="button" variant="ghost" className="w-full" asChild>
              <Link to="/">{t('order.backHome')}</Link>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
