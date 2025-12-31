import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 创建Vue实例并挂载
const app = createApp(App)
app.use(router)
app.use(ElementPlus)
app.mount('#app')
