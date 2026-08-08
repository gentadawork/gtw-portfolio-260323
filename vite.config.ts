import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // サイトはドメインのルートに配置される（/images/... の絶対パス参照が前提）
  base: '/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        // トップページ（React）
        main: resolve(import.meta.dirname, 'index.html'),
        // デザインテンプレート（素のHTMLのまま。CSS/JSのバンドルだけVIteに任せる）
        template: resolve(import.meta.dirname, '_design_template.html')
      }
    }
  }
});
