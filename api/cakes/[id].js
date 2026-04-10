import { CAKES } from '../lib/static-catalog.js'
import { applyCors, handleOptions } from '../lib/cors.js'
import { isStaff } from '../lib/auth-cookie.js'
import { readJsonBody } from '../lib/read-json-body.js'

export default async function handler(req, res) {
  if (handleOptions(req, res)) return
  applyCors(req, res)

  const id = req.query.id
  const cake = CAKES.find((c) => c.id === id)

  if (req.method === 'GET') {
    if (!cake) return res.status(404).json({ error: 'Not found' })
    return res.json(cake)
  }

  if (req.method === 'PATCH') {
    if (!isStaff(req)) return res.status(401).json({ error: 'Unauthorized' })
    if (!cake) return res.status(404).json({ error: 'Not found' })
    let body = {}
    try {
      body = await readJsonBody(req)
    } catch {
      return res.status(400).json({ error: 'JSON invalide' })
    }
    return res.json({ ...cake, ...body, id: cake.id })
  }

  if (req.method === 'DELETE') {
    if (!isStaff(req)) return res.status(401).json({ error: 'Unauthorized' })
    if (!cake) return res.status(404).json({ error: 'Not found' })
    return res.status(204).end()
  }

  res.setHeader('Allow', 'GET, PATCH, DELETE, OPTIONS')
  return res.status(405).json({ error: 'Method not allowed' })
}
