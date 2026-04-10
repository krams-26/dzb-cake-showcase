import { randomUUID } from 'node:crypto'
import { applyCors, handleOptions } from '../lib/cors.js'
import { isStaff } from '../lib/auth-cookie.js'
import { readJsonBody } from '../lib/read-json-body.js'

export default async function handler(req, res) {
  if (handleOptions(req, res)) return
  applyCors(req, res)

  if (req.method === 'GET') {
    if (!isStaff(req)) return res.status(401).json({ error: 'Unauthorized' })
    return res.json([])
  }

  if (req.method === 'POST') {
    let body = {}
    try {
      body = await readJsonBody(req)
    } catch {
      return res.status(400).json({ error: 'JSON invalide' })
    }
    const id = randomUUID()
    const row = {
      id,
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      total: Number(body.total),
      status: body.status || 'pending',
      createdAt: new Date().toISOString(),
      deliveryDate: body.deliveryDate ? String(body.deliveryDate).slice(0, 10) : undefined,
      items: typeof body.items === 'string' ? body.items : JSON.stringify(body.items || {}),
    }
    return res.status(201).json(row)
  }

  res.setHeader('Allow', 'GET, POST, OPTIONS')
  return res.status(405).json({ error: 'Method not allowed' })
}
