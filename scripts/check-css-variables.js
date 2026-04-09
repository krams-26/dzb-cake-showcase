/**
 * Ensures every var(--name) referenced in tailwind.config.cjs is defined in app CSS
 * or in @blinkdotnew/ui theme files (pulled in via @import in src/index.css).
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { globSync } from 'glob'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

function varsUsedInTailwindConfig(content) {
  const set = new Set()
  const re = /var\(\s*--([a-zA-Z0-9_-]+)\s*\)/g
  let m
  while ((m = re.exec(content)) !== null) set.add(m[1])
  return set
}

function varsDefinedInCss(content) {
  const set = new Set()
  const re = /--([a-zA-Z0-9_-]+)\s*:/g
  let m
  while ((m = re.exec(content)) !== null) set.add(m[1])
  return set
}

const twPath = path.join(root, 'tailwind.config.cjs')
const cssPath = path.join(root, 'src', 'index.css')
const tw = fs.readFileSync(twPath, 'utf8')
let combinedCss = fs.readFileSync(cssPath, 'utf8')

const blinkUiCss = globSync('node_modules/@blinkdotnew/ui/src/**/*.css', {
  cwd: root,
  nodir: true,
})
for (const rel of blinkUiCss) {
  combinedCss += fs.readFileSync(path.join(root, rel), 'utf8')
}

/** Vars referenced in Tailwind keyframes but set at runtime (e.g. Radix). */
const RUNTIME_CSS_VARS = new Set(['radix-accordion-content-height'])

const needed = varsUsedInTailwindConfig(tw)
const defined = varsDefinedInCss(combinedCss)
const missing = [...needed].filter((v) => !defined.has(v) && !RUNTIME_CSS_VARS.has(v))

if (missing.length) {
  console.error(
    'Undefined CSS variables (in tailwind.config.cjs but not in src/index.css nor @blinkdotnew/ui):',
  )
  missing.sort().forEach((v) => console.error(`  --${v}`))
  process.exit(1)
}
console.log('All Tailwind var(--*) references are covered by app + Blink UI CSS')
