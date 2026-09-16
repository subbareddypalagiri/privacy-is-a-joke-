import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        landing: resolve(__dirname, 'landing.html'),
        popup: resolve(__dirname, 'popup.html'),
        dashboard: resolve(__dirname, 'dashboard.html'),
        service_worker: resolve(__dirname, 'src/background/service_worker.ts'),
        injection_kernel: resolve(__dirname, 'src/kernel/injection_kernel.ts'),
        content_bridge: resolve(__dirname, 'src/content/content_bridge.ts')
      },
      output: {
        // Prevent code-splitting into shared chunks for content scripts & background worker
        manualChunks: undefined,
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'service_worker') return 'background.js';
          if (chunkInfo.name === 'injection_kernel') return 'content_scripts/injection_kernel.js';
          if (chunkInfo.name === 'content_bridge') return 'content_scripts/content_bridge.js';
          return 'assets/[name]-[hash].js';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  }
});
