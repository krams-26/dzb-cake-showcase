import { applyCors, handleOptions } from '../lib/cors.js'
import { isStaff } from '../lib/auth-cookie.js'
import { readJsonBody } from '../lib/read-json-body.js'

export default async function handler(req, res) {
  if (handleOptions(req, res)) return
  applyCors(req, res)

  if (req.method !== 'PATCH') {
    res.setHeader('Allow', 'PATCH, OPTIONS')
    return res.status(405).json({ error: 'Method not allowed' })
  }
  if (!isStaff(req)) return res.status(401).json({ error: 'Unauthorized' })

  let body = {}
  try {
    body = await readJsonBody(req)
  } catch {
    return res.status(400).json({ error: 'JSON invalide' })
  }

  return res.json({
    id: req.query.id,
    customerName: 'Demo',
    customerPhone: '+257',
    total: 0,
    status: body.status || 'pending',
    createdAt: new Date().toISOString(),
    items: '[]',
  })
}
