import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

const root = resolve(__dirname, 'src');

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          'lucide-vendor': ['lucide-react'],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': root,
      '@/components': resolve(root, 'components'),
      '@/features': resolve(root, 'features'),
      '@/hooks': resolve(root, 'hooks'),
      '@/services': resolve(root, 'services'),
      '@/types': resolve(root, 'types'),
      '@/styles': resolve(root, 'styles'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8222', // Updated to match your backend port
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 4173,
    proxy: {
      '/api': {
        target: 'http://localhost:8222', // Proxy working for `vite preview`
        changeOrigin: true,
      },
    },
  },
});