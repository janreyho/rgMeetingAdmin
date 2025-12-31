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

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import path from 'path'
import https from 'https' // 引入Node的https模块
import fs from 'fs'       // 引入Node的文件模块

// 读取自签名证书
const httpsAgent = new https.Agent({
  ca: fs.readFileSync(path.resolve(__dirname, 'cert.pem')), // 证书文件路径
  rejectUnauthorized: true // 验证证书（仅信任导入的自签名证书）
})

export default defineConfig({
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
    proxy: {
      '/admin-api': {
        target: 'https://39.107.250.156',
        changeOrigin: true,
        agent: httpsAgent, // 导入证书验证
        ws: false
      }
    }
  }
})