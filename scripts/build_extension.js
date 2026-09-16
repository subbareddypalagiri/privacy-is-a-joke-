import { build } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

async function runBuild() {
  console.log('🚀 Step 1: Building UI (Popup & Dashboard)...');
  await build({
    configFile: false,
    plugins: [react()],
    build: {
      outDir: resolve(__dirname, '../dist'),
      emptyOutDir: true,
      rollupOptions: {
        input: {
          popup: resolve(__dirname, '../popup.html'),
          dashboard: resolve(__dirname, '../dashboard.html'),
        },
        output: {
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
      },
    },
  });

  console.log('🛡️ Step 2: Building Standalone Injection Kernel (IIFE, No Imports)...');
  await build({
    configFile: false,
    build: {
      outDir: resolve(__dirname, '../dist/content_scripts'),
      emptyOutDir: false,
      lib: {
        entry: resolve(__dirname, '../src/content_scripts/injection_kernel.ts'),
        name: 'GhostShieldKernel',
        formats: ['iife'],
        fileName: () => 'injection_kernel.js',
      },
      rollupOptions: {
        output: {
          inlineDynamicImports: true,
        },
      },
    },
  });

  console.log('🌉 Step 3: Building Content Bridge (IIFE, No Imports)...');
  await build({
    configFile: false,
    build: {
      outDir: resolve(__dirname, '../dist/content_scripts'),
      emptyOutDir: false,
      lib: {
        entry: resolve(__dirname, '../src/content/content_bridge.ts'),
        name: 'GhostShieldBridge',
        formats: ['iife'],
        fileName: () => 'content_bridge.js',
      },
      rollupOptions: {
        output: {
          inlineDynamicImports: true,
        },
      },
    },
  });

  console.log('⚙️ Step 4: Building Background Service Worker...');
  await build({
    configFile: false,
    build: {
      outDir: resolve(__dirname, '../dist'),
      emptyOutDir: false,
      lib: {
        entry: resolve(__dirname, '../src/background/service_worker.ts'),
        name: 'GhostShieldWorker',
        formats: ['es'],
        fileName: () => 'background.js',
      },
      rollupOptions: {
        output: {
          inlineDynamicImports: true,
        },
      },
    },
  });

  console.log('⚡ Step 5: Building Standalone Node Daemon Server...');
  await build({
    configFile: false,
    build: {
      outDir: resolve(__dirname, '../dist'),
      emptyOutDir: false,
      ssr: resolve(__dirname, '../src/daemon/daemon_cli.ts'),
      rollupOptions: {
        output: {
          entryFileNames: 'daemon.js',
          format: 'es',
        },
      },
    },
  });

  console.log('📦 Step 6: Copying Static Assets & Icons...');
  const publicDir = resolve(__dirname, '../public');
  const distDir = resolve(__dirname, '../dist');

  // Copy manifest.json and rules.json
  fs.copyFileSync(resolve(publicDir, 'manifest.json'), resolve(distDir, 'manifest.json'));
  fs.copyFileSync(resolve(publicDir, 'rules.json'), resolve(distDir, 'rules.json'));

  // Copy icons
  const distIcons = resolve(distDir, 'icons');
  if (!fs.existsSync(distIcons)) fs.mkdirSync(distIcons, { recursive: true });
  [16, 48, 128].forEach((size) => {
    const iconFile = `icon${size}.png`;
    const srcIcon = resolve(publicDir, 'icons', iconFile);
    if (fs.existsSync(srcIcon)) {
      fs.copyFileSync(srcIcon, resolve(distIcons, iconFile));
    }
  });

  console.log('✅ GhostShield Clean Build Completed Successfully!');
}

runBuild().catch((err) => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});
