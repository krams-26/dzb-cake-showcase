/**
 * API REST → MySQL `dzb_cake`
 * Démarrage : npm run server (port API_PORT, défaut 8787)
 */
import './load-env.js'
import express from 'express'
import cors from 'cors'
import { randomUUID } from 'node:crypto'
import { query } from './db.js'
import { rowCategory, rowCake, rowOrder, rowInventory } from './map.js'
import { attachSession, registerAuthRoutes, requireStaff } from './auth.js'

const app = express()
const PORT = Number(process.env.API_PORT || 8787)

app.use(
  cors({
    origin(origin, cb) {
      const fixed = process.env.FRONTEND_ORIGIN
      if (!origin) return cb(null, true)
      if (fixed && origin === fixed) return cb(null, true)
      if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin)) return cb(null, true)
      cb(null, false)
    },
    credentials: true,
  }),
)

attachSession(app)
app.use(express.json({ limit: '1mb' }))

registerAuthRoutes(app)
console.log('[dzb] Routes auth : POST /api/auth/login, POST /api/auth/logout, GET /api/auth/me')

app.get('/api/health', async (_req, res) => {
  try {
    await query('SELECT 1')
    res.json({ ok: true, database: process.env.DATABASE_NAME || 'dzb_cake' })
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e.message) })
  }
})

app.get('/api/categories', async (_req, res) => {
  const rows = await query('SELECT id, name_fr, name_en, name_kr FROM categories ORDER BY id')
  res.json(rows.map(rowCategory))
})

app.get('/api/cakes', async (_req, res) => {
  const rows = await query(
    'SELECT id, category_id, name_fr, name_en, name_kr, description_fr, description_en, description_kr, price, image_url FROM cakes ORDER BY name_fr',
  )
  res.json(rows.map(rowCake))
})

app.get('/api/cakes/:id', async (req, res) => {
  const rows = await query(
    'SELECT id, category_id, name_fr, name_en, name_kr, description_fr, description_en, description_kr, price, image_url FROM cakes WHERE id = ?',
    [req.params.id],
  )
  if (!rows.length) return res.status(404).json({ error: 'Not found' })
  res.json(rowCake(rows[0]))
})

app.post('/api/cakes', requireStaff, async (req, res) => {
  const b = req.body
  const id = b.id || randomUUID()
  await query(
    `INSERT INTO cakes (id, category_id, name_fr, name_en, name_kr, description_fr, description_en, description_kr, price, image_url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      b.categoryId,
      b.nameFr,
      b.nameEn,
      b.nameKr,
      b.descriptionFr,
      b.descriptionEn,
      b.descriptionKr,
      b.price,
      b.imageUrl,
    ],
  )
  const rows = await query('SELECT * FROM cakes WHERE id = ?', [id])
  res.status(201).json(rowCake(rows[0]))
})

app.patch('/api/cakes/:id', requireStaff, async (req, res) => {
  const b = req.body
  await query(
    `UPDATE cakes SET category_id = ?, name_fr = ?, name_en = ?, name_kr = ?, description_fr = ?, description_en = ?, description_kr = ?, price = ?, image_url = ? WHERE id = ?`,
    [
      b.categoryId,
      b.nameFr,
      b.nameEn,
      b.nameKr,
      b.descriptionFr,
      b.descriptionEn,
      b.descriptionKr,
      b.price,
      b.imageUrl,
      req.params.id,
    ],
  )
  const rows = await query('SELECT * FROM cakes WHERE id = ?', [req.params.id])
  if (!rows.length) return res.status(404).json({ error: 'Not found' })
  res.json(rowCake(rows[0]))
})

app.delete('/api/cakes/:id', requireStaff, async (req, res) => {
  await query('DELETE FROM cakes WHERE id = ?', [req.params.id])
  res.status(204).end()
})

app.get('/api/orders', requireStaff, async (req, res) => {
  let sql =
    'SELECT id, customer_name, customer_phone, total, status, created_at, delivery_date, items FROM orders'
  const orderBy = req.query.orderBy
  if (orderBy === 'createdAt:desc' || orderBy === 'created_at:desc') {
    sql += ' ORDER BY created_at DESC'
  } else {
    sql += ' ORDER BY created_at DESC'
  }
  const rows = await query(sql)
  res.json(rows.map(rowOrder))
})

app.post('/api/orders', async (req, res) => {
  const b = req.body
  const id = randomUUID()
  const createdAt = b.createdAt ? new Date(b.createdAt) : new Date()
  const deliveryDate = b.deliveryDate ? String(b.deliveryDate).slice(0, 10) : null
  await query(
    `INSERT INTO orders (id, customer_name, customer_phone, total, status, created_at, delivery_date, items)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      b.customerName,
      b.customerPhone,
      b.total,
      b.status || 'pending',
      createdAt,
      deliveryDate,
      typeof b.items === 'string' ? b.items : JSON.stringify(b.items),
    ],
  )
  const rows = await query('SELECT * FROM orders WHERE id = ?', [id])
  res.status(201).json(rowOrder(rows[0]))
})

app.patch('/api/orders/:id', requireStaff, async (req, res) => {
  const { status } = req.body
  await query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id])
  const rows = await query('SELECT * FROM orders WHERE id = ?', [req.params.id])
  if (!rows.length) return res.status(404).json({ error: 'Not found' })
  res.json(rowOrder(rows[0]))
})

app.get('/api/inventory_items', requireStaff, async (_req, res) => {
  const rows = await query(
    'SELECT id, name_fr, name_en, name_kr, quantity_label, status FROM inventory_items ORDER BY name_fr',
  )
  res.json(rows.map(rowInventory))
})

/** 404 JSON pour /api (plus lisible qu’une page HTML « Cannot POST… »). */
app.use((req, res) => {
  if (String(req.originalUrl || req.url || '').startsWith('/api')) {
    return res.status(404).json({
      error: 'Route API introuvable',
      method: req.method,
      path: req.originalUrl || req.url,
      hint:
        req.method === 'POST' && String(req.originalUrl || '').includes('/auth/')
          ? 'Démarrez l’API Node sur le même port que API_PORT dans .env (npm run server ou npm run dev:full).'
          : undefined,
    })
  }
  res.status(404).type('txt').send('Not found')
})

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: err.message || 'Server error' })
})

app.listen(PORT, () => {
  console.log(`API MySQL dzb_cake → http://127.0.0.1:${PORT}`)
})
