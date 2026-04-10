import { applyCors, handleOptions } from '../lib/cors.js'
import { getSessionEmail } from '../lib/auth-cookie.js'

export default function handler(req, res) {
  if (handleOptions(req, res)) return
  applyCors(req, res)

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET, OPTIONS')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const email = getSessionEmail(req)
  if (!email) {
    return res.status(401).json({ error: 'Non connecté' })
  }

  const role = email.includes('admin') ? 'admin' : 'staff'
  res.json({ user: { id: 'vercel-demo-staff', email, role } })
}
