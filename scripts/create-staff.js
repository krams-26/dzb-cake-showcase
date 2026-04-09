/**
 * Crée ou met à jour un compte staff (mot de passe) à partir de l’environnement.
 * Usage : STAFF_EMAIL=a@b.com STAFF_PASSWORD=secret npm run db:create-staff
 */
import '../server/load-env.js'
import { randomUUID } from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import bcrypt from 'bcryptjs'
import mysql from 'mysql2/promise'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function getDbName() {
  const n = process.env.DATABASE_NAME || 'dzb_cake'
  if (!/^[a-zA-Z0-9_]+$/.test(n)) {
    throw new Error('DATABASE_NAME invalide')
  }
  return n
}

async function main() {
  const email = String(process.env.STAFF_EMAIL || '').trim().toLowerCase()
  const password = String(process.env.STAFF_PASSWORD || '')
  if (!email || !password) {
    console.error('Définissez STAFF_EMAIL et STAFF_PASSWORD (ex. dans .env.local).')
    process.exit(1)
  }

  const hash = await bcrypt.hash(password, 10)
  const id = randomUUID()
  const dbName = getDbName()

  const conn = await mysql.createConnection({
    host: process.env.DATABASE_HOST || '127.0.0.1',
    port: Number(process.env.DATABASE_PORT || 3306),
    user: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD ?? '',
    database: dbName,
  })

  await conn.query(
    `INSERT INTO staff_users (id, email, password_hash) VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
    [id, email, hash],
  )
  await conn.end()
  console.log('Compte staff OK :', email)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
