import session from 'express-session'
import bcrypt from 'bcryptjs'
import { query } from './db.js'

/**
 * @param {import('express').Application} app
 */
export function attachSession(app) {
  const isProd = process.env.NODE_ENV === 'production'
  if (isProd && !process.env.SESSION_SECRET) {
    console.error('SESSION_SECRET est requis en production.')
    process.exit(1)
  }

  app.set('trust proxy', 1)
  app.use(
    session({
      name: process.env.SESSION_COOKIE_NAME || 'dzb.sid',
      secret: process.env.SESSION_SECRET || 'dev-insecure-change-me',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: 'lax',
        secure: isProd,
        path: '/',
      },
    }),
  )
}

export function requireStaff(req, res, next) {
  if (!req.session?.staff?.id) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  next()
}

/**
 * @param {import('express').Application} app
 */
export function registerAuthRoutes(app) {
  app.post('/api/auth/login', async (req, res) => {
    try {
      const email = String(req.body?.email || '').trim().toLowerCase()
      const password = String(req.body?.password || '')
      if (!email || !password) {
        return res.status(400).json({ error: 'Email et mot de passe requis' })
      }
      const rows = await query('SELECT id, email, password_hash FROM staff_users WHERE email = ?', [email])
      if (!rows.length) {
        return res.status(401).json({ error: 'Identifiants invalides' })
      }
      const row = rows[0]
      const ok = await bcrypt.compare(password, row.password_hash)
      if (!ok) return res.status(401).json({ error: 'Identifiants invalides' })
      req.session.staff = { id: row.id, email: row.email }
      res.json({ user: { id: row.id, email: row.email } })
    } catch (e) {
      console.error(e)
      res.status(500).json({ error: 'Erreur serveur' })
    }
  })

  app.post('/api/auth/logout', (req, res) => {
    const name = process.env.SESSION_COOKIE_NAME || 'dzb.sid'
    req.session.destroy((err) => {
      if (err) {
        console.error(err)
        return res.status(500).json({ error: 'Déconnexion impossible' })
      }
      res.clearCookie(name, { path: '/' })
      res.status(204).end()
    })
  })

  app.get('/api/auth/me', (req, res) => {
    if (!req.session?.staff?.id) {
      return res.status(401).json({ error: 'Non connecté' })
    }
    res.json({ user: req.session.staff })
  })
}
