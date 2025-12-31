// 导入Vue Router核心方法
import { createRouter, createWebHistory } from 'vue-router'
// 导入设备管理页面组件（路径必须正确：@/views/SipDevice.vue）
import SipDevice from '@/views/SipDevice.vue'

// 路由规则：匹配侧边栏的设备管理
const routes = [
  // 根路径重定向：访问http://localhost:5173/ 自动跳转到设备管理页
  {
    path: '/',
    redirect: '/device-manager' 
  },
  // 设备管理路由：path对应侧边栏el-menu-item的index="device-manager"
  {
    path: '/device-manager', // 侧边栏点击时跳转的路径
    name: 'DeviceManager',   // 路由名称（可选，用于编程式导航）
    component: SipDevice,    // 绑定到设备管理页面组件
    meta: { title: '设备管理' } // 页面标题（路由守卫会读取这个值修改浏览器标题）
  }
]

// 创建路由实例：使用HTML5历史模式（去掉URL中的#）
const router = createRouter({
  history: createWebHistory(), 
  routes // 挂载上面定义的路由规则
})

// 路由守卫：切换路由时自动修改浏览器标签页标题
router.beforeEach((to, from, next) => {
  // 如果路由配置了meta.title，就把标题设置为该值
  if (to.meta.title) {
    document.title = to.meta.title
  }
  // 放行，允许路由跳转
  next()
})

// 导出路由实例，供main.js挂载
export default router
