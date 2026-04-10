import { INVENTORY_ITEMS } from './lib/static-catalog.js'
import { applyCors, handleOptions } from './lib/cors.js'
import { isStaff } from './lib/auth-cookie.js'

export default function handler(req, res) {
  if (handleOptions(req, res)) return
  applyCors(req, res)
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET, OPTIONS')
    return res.status(405).json({ error: 'Method not allowed' })
  }
  if (!isStaff(req)) return res.status(401).json({ error: 'Unauthorized' })
  res.json(INVENTORY_ITEMS)
}
