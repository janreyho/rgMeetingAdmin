// import { defineConfig } from 'vite'
// import vue from '@vitejs/plugin-vue'
// import AutoImport from 'unplugin-auto-import/vite'
// import Components from 'unplugin-vue-components/vite'
// import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// import path from 'path'

// export default defineConfig({
//   // 配置别名：@指向src目录（保留不变）
//   resolve: {
//     alias: {
//       '@': path.resolve(__dirname, 'src')
//     }
//   },
//   plugins: [
//     vue(),
//     // Element Plus自动导入（保留不变）
//     AutoImport({
//       resolvers: [ElementPlusResolver()]
//     }),
//     Components({
//       resolvers: [ElementPlusResolver()]
//     })
//   ],
//   // 开发环境配置：新增host，保留proxy代理
//   server: {
//     host: '0.0.0.0', // 关键：允许局域网其他电脑访问（核心修改点）
//     port: 5173,      // 可选：自定义端口（如8080，默认5173可保留）
//     proxy: {         // 原有跨域代理配置（保留不变）
//       '/admin-api': {
//         target: 'https://192.168.1.170:8553',
//         changeOrigin: true
//       }
//     }
//   }
// })

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import path from 'path'
import fs from 'fs'       // 引入Node的文件模块

const httpsCertDir = path.resolve(__dirname, 'certs', 'rgsfu.hejiayi.tech')
const httpsKey = fs.readFileSync(path.join(httpsCertDir, 'rgsfu.hejiayi.tech.key'))
const httpsCert = fs.readFileSync(path.join(httpsCertDir, 'rgsfu.hejiayi.tech.pem'))

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxyTarget = env.VITE_API_BASE_URL || 'https://localhost'

  return {
    resolve: {
      alias: { '@': path.resolve(__dirname, 'src') }
    },
    plugins: [
      vue(),
      AutoImport({ resolvers: [ElementPlusResolver()] }),
      Components({ resolvers: [ElementPlusResolver()] })
    ],
    server: {
      host: '0.0.0.0',
      allowedHosts: ['rgsfu.hejiayi.tech'],
      https: {
        key: httpsKey,
        cert: httpsCert
      },
      proxy: {
        '/admin-api': {
          target: proxyTarget,
          changeOrigin: true
        }
      }
    }
  }
})
