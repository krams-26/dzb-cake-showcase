/**
 * Verifies app-specific Tailwind class tokens used in src are declared in tailwind.config.cjs
 * (avoids silent purge of unknown utilities in production).
 */
import fs from 'fs'
import path from 'path'
import { globSync } from 'glob'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

const patterns = [
  { className: 'shadow-elegant', mustInclude: 'elegant' },
]

const twPath = path.join(root, 'tailwind.config.cjs')
const tw = fs.readFileSync(twPath, 'utf8')

const srcFiles = globSync('src/**/*.{tsx,ts,jsx,js}', { cwd: root, nodir: true })
let combined = ''
for (const f of srcFiles) {
  combined += fs.readFileSync(path.join(root, f), 'utf8')
}

const errors = []
for (const { className, mustInclude } of patterns) {
  if (combined.includes(className) && !tw.includes(mustInclude)) {
    errors.push(`Class "${className}" is used in src but tailwind.config.cjs must define ${mustInclude} (e.g. theme.extend.boxShadow)`)
  }
}

if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}
console.log('App-specific Tailwind class check passed')
