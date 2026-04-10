import { applyCors, handleOptions } from '../lib/cors.js'
import { setSessionCookie } from '../lib/auth-cookie.js'
import { readJsonBody } from '../lib/read-json-body.js'

export default async function handler(req, res) {
  if (handleOptions(req, res)) return
  applyCors(req, res)

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  let body = {}
  try {
    body = await readJsonBody(req)
  } catch {
    return res.status(400).json({ error: 'JSON invalide' })
  }

  const email = String(body.email || '').trim().toLowerCase()
  const password = String(body.password || '')
  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis' })
  }

  const role = email.includes('admin') ? 'admin' : 'staff'
  const user = { id: 'vercel-demo-staff', email, role }

  setSessionCookie(res, email)
  res.json({ user })
}
