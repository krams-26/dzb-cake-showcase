import { CATEGORIES } from './lib/static-catalog.js'
import { applyCors, handleOptions } from './lib/cors.js'

export default function handler(req, res) {
  if (handleOptions(req, res)) return
  applyCors(req, res)
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET, OPTIONS')
    return res.status(405).json({ error: 'Method not allowed' })
  }
  res.json(CATEGORIES)
}
