
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Safely inject process.env.API_KEY for the browser
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || ''),
    // Provide a fallback for process.env as an object
    'process.env': JSON.stringify({
      API_KEY: process.env.API_KEY || ''
    })
  },
  server: {
    host: true,
    port: 3000
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    emptyOutDir: true
  }
});
