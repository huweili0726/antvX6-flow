import { defineConfig, loadEnv } from 'vite'
import type { ConfigEnv } from "vite"
import vue from '@vitejs/plugin-vue'
import path from 'path';

export default ({ mode }: ConfigEnv) => {
  const root = process.cwd()
  // 获取 .env 文件里定义的环境变量
  const ENV = loadEnv(mode, root)

  return defineConfig({
    base: ENV.VITE_BASE_URL,
    plugins: [
      vue()
    ],
    optimizeDeps: {
      include: ['@antv/x6', '@antv/x6-plugin-snapline'],
      esbuildOptions: { target: 'es2020' }
    },
    ssr: {
      noExternal: ['@antv/x6', '@antv/x6-plugin-snapline']
    },
    server: {
      host: '0.0.0.0', // 监听所有网络接口
      port: 3001, // 监听端口
      open: true, //项目启东时是否打开页面
    },
    define: {
      "process.env": {
        mode,
        BASE_URL: ENV.VITE_BASE_URL,
      },
      buildTime: new Date()
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    },
    build: {
      commonjsOptions: {
        include: [/node_modules/],
        transformMixedEsModules: true
      },
      target: 'es2020'
    }
  })
}