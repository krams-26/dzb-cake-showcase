const COOKIE = 'dzb_staff_demo'

export function getSessionEmail(req) {
  const raw = req.headers.cookie || ''
  const m = raw.split(';').map((s) => s.trim()).find((p) => p.startsWith(`${COOKIE}=`))
  if (!m) return null
  try {
    return decodeURIComponent(m.slice(COOKIE.length + 1))
  } catch {
    return null
  }
}

export function setSessionCookie(res, email) {
  const val = encodeURIComponent(email)
  const secure = process.env.VERCEL === '1' ? '; Secure' : ''
  res.setHeader(
    'Set-Cookie',
    `${COOKIE}=${val}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}${secure}`,
  )
}

export function clearSessionCookie(res) {
  const secure = process.env.VERCEL === '1' ? '; Secure' : ''
  res.setHeader('Set-Cookie', `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`)
}

export function isStaff(req) {
  return Boolean(getSessionEmail(req))
}
