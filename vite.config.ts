import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/ezresume/',  // Updated to match your GitHub repository name
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[ext]',
        chunkFileNames: 'assets/[name].js',
        entryFileNames: 'assets/[name].js',
      },
      onwarn(warning, warn) {
        console.log('Rollup warning:', warning);
      }
    }
  }
});
