import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react-resizable-panels'],
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
      // Force @blinkdotnew/ui to use API PanelGroup / PanelResizeHandle (v2.x), not nested v4+
      'react-resizable-panels': path.resolve(
        import.meta.dirname,
        'node_modules/react-resizable-panels',
      ),
    },
  },
  server: {
    port: 3000,
    strictPort: true,
    host: true,
    allowedHosts: true,
    proxy: {
      '/api': {
        target: `http://127.0.0.1:${process.env.API_PORT || 8787}`,
        changeOrigin: true,
      },
    },
  },
});