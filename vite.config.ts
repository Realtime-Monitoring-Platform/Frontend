import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

const root = resolve(__dirname, 'src');

export default defineConfig(({ mode }) => {
  // Load env file from the current directory. 
  // The third parameter '' loads all variables regardless of prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  // Fallback to the hardcoded local URL if the env variable is missing
  const BASE_API_URL = env.VITE_BASE_API_URL || 'http://localhost:8222';

  
  return {
    plugins: [react()],
    test: {
      include: ['src/**/*.{test,spec}.{ts,tsx}'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'lcov'],
        reportsDirectory: './coverage',
      },
    },
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
          target: BASE_API_URL,
          changeOrigin: true,
        },
      },
    },
    preview: {
      port: 4173,
      proxy: {
        '/api': {
          target: BASE_API_URL,
          changeOrigin: true,
        },
      },
    },
  };
});
