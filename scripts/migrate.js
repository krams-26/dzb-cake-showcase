/**
 * Applique les fichiers SQL dans database/migrations/ (tri par nom).
 * Crée la base DATABASE_NAME si besoin, puis la table schema_migrations.
 */
import '../server/load-env.js'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import mysql from 'mysql2/promise'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const MIGRATIONS_DIR = path.join(ROOT, 'database', 'migrations')

function getDbName() {
  const n = process.env.DATABASE_NAME || 'dzb_cake'
  if (!/^[a-zA-Z0-9_]+$/.test(n)) {
    throw new Error('DATABASE_NAME invalide (autorisé : lettres, chiffres, underscore)')
  }
  return n
}

function connectionConfig(overrides = {}) {
  return {
    host: process.env.DATABASE_HOST || '127.0.0.1',
    port: Number(process.env.DATABASE_PORT || 3306),
    user: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD ?? '',
    multipleStatements: true,
    ...overrides,
  }
}

async function ensureDatabase(dbName) {
  const conn = await mysql.createConnection(connectionConfig())
  await conn.query(
    `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  )
  await conn.end()
}

async function main() {
  const dbName = getDbName()
  console.log('Base cible :', dbName)
  await ensureDatabase(dbName)

  const conn = await mysql.createConnection(connectionConfig({ database: dbName }))

  await conn.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name VARCHAR(255) NOT NULL PRIMARY KEY,
      applied_at DATETIME(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3))
    ) ENGINE=InnoDB;
  `)

  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort()

  if (!files.length) {
    console.log('Aucun fichier .sql dans database/migrations/')
    await conn.end()
    return
  }

  for (const file of files) {
    const [applied] = await conn.query('SELECT name FROM schema_migrations WHERE name = ?', [file])
    if (applied.length) {
      console.log('Déjà appliqué :', file)
      continue
    }

    const full = path.join(MIGRATIONS_DIR, file)
    const sql = fs.readFileSync(full, 'utf8')
    console.log('Application :', file)
    await conn.query(sql)
    await conn.query('INSERT INTO schema_migrations (name) VALUES (?)', [file])
  }

  await conn.end()
  console.log('Migrations terminées.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
