import { defineConfig } from '@vben/vite-config';

import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';


export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      plugins: [
        // ElementPlus({
        //   format: 'esm',
        //   useSource: true,
        // }),
        Components({
          dirs: ['src/components'],
          resolvers: [ElementPlusResolver({
            importStyle: 'sass',
          })],
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
            target: 'http://localhost:9090',
            changeOrigin: true,
            rewrite: (path: string) => path.replace(/^\/local/, ''),
          },
        },
      },
    },
  };
});
