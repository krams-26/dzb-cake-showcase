import { applyCors, handleOptions } from '../lib/cors.js'
import { clearSessionCookie } from '../lib/auth-cookie.js'

export default function handler(req, res) {
  if (handleOptions(req, res)) return
  applyCors(req, res)

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  clearSessionCookie(res)
  res.status(204).end()
}
