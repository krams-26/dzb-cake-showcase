/**
 * Crée 5 comptes de démonstration (1 admin + 4 staff), même mot de passe.
 *
 * Prérequis : npm run db:migrate (colonne `role` sur staff_users)
 *
 * Usage :
 *   npm run db:seed-staff-demo
 *   DEMO_STAFF_PASSWORD=MonSecret npm run db:seed-staff-demo
 */
import '../server/load-env.js'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import bcrypt from 'bcryptjs'
import mysql from 'mysql2/promise'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const DEMO_USERS = [
  { id: 'a0000001-0001-4001-8001-000000000001', email: 'admin@dzbcake.local', role: 'admin' },
  { id: 'a0000001-0001-4001-8001-000000000002', email: 'equipe1@dzbcake.local', role: 'staff' },
  { id: 'a0000001-0001-4001-8001-000000000003', email: 'equipe2@dzbcake.local', role: 'staff' },
  { id: 'a0000001-0001-4001-8001-000000000004', email: 'equipe3@dzbcake.local', role: 'staff' },
  { id: 'a0000001-0001-4001-8001-000000000005', email: 'equipe4@dzbcake.local', role: 'staff' },
]

function getDbName() {
  const n = process.env.DATABASE_NAME || 'dzb_cake'
  if (!/^[a-zA-Z0-9_]+$/.test(n)) {
    throw new Error('DATABASE_NAME invalide')
  }
  return n
}

async function main() {
  const password = String(process.env.DEMO_STAFF_PASSWORD || 'DzbCake2026!')
  if (password.length < 8) {
    console.error('DEMO_STAFF_PASSWORD doit faire au moins 8 caractères.')
    process.exit(1)
  }

  const hash = await bcrypt.hash(password, 10)
  const dbName = getDbName()

  const conn = await mysql.createConnection({
    host: process.env.DATABASE_HOST || '127.0.0.1',
    port: Number(process.env.DATABASE_PORT || 3306),
    user: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD ?? '',
    database: dbName,
  })

  for (const u of DEMO_USERS) {
    await conn.query(
      `INSERT INTO staff_users (id, email, password_hash, role) VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), role = VALUES(role), id = VALUES(id)`,
      [u.id, u.email, hash, u.role],
    )
  }

  await conn.end()

  console.log('')
  console.log('Comptes de démonstration créés ou mis à jour (5).')
  console.log('Mot de passe commun :', password)
  console.log('')
  console.log('Rôle        | E-mail')
  console.log('------------|---------------------------')
  for (const u of DEMO_USERS) {
    const r = u.role === 'admin' ? 'admin      ' : 'staff      '
    console.log(r + '| ' + u.email)
  }
  console.log('')
  console.log('ATTENTION : réservé au développement — changez ces mots de passe en production.')
}

main().catch((e) => {
  console.error(e)
  if (String(e?.message || e).includes('Unknown column')) {
    console.error('\nExécutez d’abord : npm run db:migrate')
  }
  process.exit(1)
})
