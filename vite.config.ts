import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/REPO_NAME/',  // Replace REPO_NAME with your repository name
  plugins: [
    react(),
    {
      name: 'debug-resolve',
      resolveId(source, importer) {
        console.log('Resolving:', source, 'from', importer);
        return null;
      }
    }
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        console.log('Rollup warning:', warning);
      }
    }
  }
});
