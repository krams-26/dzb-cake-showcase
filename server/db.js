import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST || '127.0.0.1',
  port: Number(process.env.DATABASE_PORT || 3306),
  user: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_NAME || 'dzb_cake',
  waitForConnections: true,
  connectionLimit: 10,
})

export async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params)
  return rows
}

export { pool }
