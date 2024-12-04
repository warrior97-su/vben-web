import { defineConfig } from '@vben/vite-config';

import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      plugins: [
        Components({
          dirs: ['src/components'],
          resolvers: [
            ElementPlusResolver({
              importStyle: 'sass',
            }),
          ],
        }),
      ],
      server: {
        proxy: {
          '/api': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
            // mock代理目标地址
            target: 'http://localhost:5320/api',
            ws: true,
          },
          '/local': {
            changeOrigin: true,
            rewrite: (path: string) => path.replace(/^\/local/, ''),
            target: 'http://localhost:9090',
          },
        },
      },
    },
  };
});
