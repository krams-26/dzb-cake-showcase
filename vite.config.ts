import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** Même port que `npm run server` (variable API_PORT dans .env / .env.local). */
function apiProxyTarget(mode: string) {
  const env = loadEnv(mode, process.cwd(), '')
  const port = env.API_PORT || process.env.API_PORT || '8787'
  return `http://127.0.0.1:${port}`
}

export default defineConfig(({ mode }) => {
  const proxy = {
    '/api': {
      target: apiProxyTarget(mode),
      changeOrigin: true,
    },
  }

  return {
    plugins: [react()],
    resolve: {
      dedupe: ['react-resizable-panels'],
      alias: {
        '@': path.resolve(__dirname, './src'),
        'react-resizable-panels': path.resolve(
          __dirname,
          'node_modules/react-resizable-panels',
        ),
      },
    },
    server: {
      port: 3000,
      strictPort: true,
      host: true,
      allowedHosts: true,
      proxy,
    },
    preview: {
      port: 4173,
      host: true,
      proxy,
    },
  }
})
