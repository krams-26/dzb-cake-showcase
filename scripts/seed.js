/**
 * Charge database/seed_demo.sql (INSERT IGNORE, idempotent).
 */
import '../server/load-env.js'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import mysql from 'mysql2/promise'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const SEED_FILE = path.join(ROOT, 'database', 'seed_demo.sql')

function getDbName() {
  const n = process.env.DATABASE_NAME || 'dzb_cake'
  if (!/^[a-zA-Z0-9_]+$/.test(n)) {
    throw new Error('DATABASE_NAME invalide (autorisé : lettres, chiffres, underscore)')
  }
  return n
}

async function main() {
  const dbName = getDbName()
  const sql = fs.readFileSync(SEED_FILE, 'utf8')

  const conn = await mysql.createConnection({
    host: process.env.DATABASE_HOST || '127.0.0.1',
    port: Number(process.env.DATABASE_PORT || 3306),
    user: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD ?? '',
    database: dbName,
    multipleStatements: true,
  })

  console.log('Seed :', SEED_FILE)
  await conn.query(sql)
  await conn.end()
  console.log('Seed terminé.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
