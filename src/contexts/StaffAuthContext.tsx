import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { apiUrl } from '../data/api-database'

export type StaffRole = 'admin' | 'staff'

export interface StaffUser {
  id: string
  email: string
  role: StaffRole
}

interface StaffAuthState {
  authReady: boolean
  staff: StaffUser | null
  isStaff: boolean
  isAdmin: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const StaffAuthContext = createContext<StaffAuthState | null>(null)

export function StaffAuthProvider({ children }: { children: React.ReactNode }) {
  const [authReady, setAuthReady] = useState(false)
  const [staff, setStaff] = useState<StaffUser | null>(null)

  const refresh = useCallback(async () => {
    const res = await fetch(apiUrl('/auth/me'), { credentials: 'include' })
    if (res.status === 401) {
      setStaff(null)
      return
    }
    if (!res.ok) {
      setStaff(null)
      return
    }
    const data = (await res.json()) as { user: StaffUser & { role?: string } }
    const u = data.user
    setStaff({
      id: u.id,
      email: u.email,
      role: u.role === 'admin' ? 'admin' : 'staff',
    })
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        await refresh()
      } finally {
        if (!cancelled) setAuthReady(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [refresh])

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await fetch(apiUrl('/auth/login'), {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const text = await res.text()
      if (!res.ok) {
        let msg = text
        try {
          const j = JSON.parse(text) as { error?: string }
          msg = j.error || msg
        } catch {
          /* ignore */
        }
        throw new Error(msg || 'Échec de la connexion')
      }
      await refresh()
    },
    [refresh],
  )

  const logout = useCallback(async () => {
    await fetch(apiUrl('/auth/logout'), { method: 'POST', credentials: 'include' })
    setStaff(null)
  }, [])

  const value = useMemo(
    () => ({
      authReady,
      staff,
      isStaff: !!staff,
      isAdmin: staff?.role === 'admin',
      login,
      logout,
    }),
    [authReady, staff, login, logout],
  )

  return <StaffAuthContext.Provider value={value}>{children}</StaffAuthContext.Provider>
}

export function useStaffAuth(): StaffAuthState {
  const ctx = useContext(StaffAuthContext)
  if (!ctx) throw new Error('useStaffAuth doit être utilisé dans StaffAuthProvider')
  return ctx
}
