import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: '/yijing/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: (content, filePath) => {
          if (filePath.endsWith('variables.scss')) return content;
          return `@use "@/styles/variables.scss" as *; @use "sass:color"; ${content}`;
        },
      },
    },
  },
  server: {
    host: true,
    open: true,
  },
})
