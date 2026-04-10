import { CAKES } from '../lib/static-catalog.js'
import { applyCors, handleOptions } from '../lib/cors.js'
import { isStaff } from '../lib/auth-cookie.js'
import { readJsonBody } from '../lib/read-json-body.js'
import { randomUUID } from 'node:crypto'

export default async function handler(req, res) {
  if (handleOptions(req, res)) return
  applyCors(req, res)

  if (req.method === 'GET') {
    const sorted = [...CAKES].sort((a, b) => a.nameFr.localeCompare(b.nameFr, 'fr'))
    return res.json(sorted)
  }

  if (req.method === 'POST') {
    if (!isStaff(req)) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    let body = {}
    try {
      body = await readJsonBody(req)
    } catch {
      return res.status(400).json({ error: 'JSON invalide' })
    }
    const id = body.id || randomUUID()
    const row = {
      id,
      categoryId: body.categoryId,
      nameFr: body.nameFr,
      nameEn: body.nameEn,
      nameKr: body.nameKr,
      descriptionFr: body.descriptionFr,
      descriptionEn: body.descriptionEn,
      descriptionKr: body.descriptionKr,
      price: Number(body.price),
      imageUrl: body.imageUrl || '',
    }
    return res.status(201).json(row)
  }

  res.setHeader('Allow', 'GET, POST, OPTIONS')
  return res.status(405).json({ error: 'Method not allowed' })
}
