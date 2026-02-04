import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'

// https://vite.dev/config/
export default defineConfig({
  // 部署在子路径时必填，否则 /assets/ 会请求到站点根导致 404
  base: '/git-king/',
  plugins: [
    react(),
    // 构建时生成 .gz 压缩文件，服务器可优先返回以减小体积
    viteCompression({ algorithm: 'gzip', ext: '.gz' }),
    // Brotli 压缩率更高，现代浏览器均支持
    viteCompression({ algorithm: 'brotliCompress', ext: '.br' }),
  ],
  build: {
    outDir: 'docs',
  },
})
