import { defineConfig } from 'vite'

export default defineConfig({
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
  server: {
    proxy: {
      // 开发环境代理配置
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    }
  }
}) 