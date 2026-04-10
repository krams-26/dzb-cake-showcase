/**
 * CORS pour le front Vercel (même domaine ou preview *.vercel.app).
 */
export function applyCors(req, res) {
  const origin = req.headers.origin
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Credentials', 'true')
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*')
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, Cookie',
  )
}

export function handleOptions(req, res) {
  if (req.method === 'OPTIONS') {
    applyCors(req, res)
    res.status(204).end()
    return true
  }
  return false
}
