<template>
  <!-- 左侧侧边栏，使用Element Plus的Menu组件 -->
  <el-menu
    default-active="device-manager"
    class="sidebar-menu"
    background-color="#0f172a"
    text-color="#fff"
    active-text-color="#409eff"
    router
  >
    <!-- 设备管理菜单（仅保留这一项） -->
    <el-menu-item index="device-manager">
      <el-icon><location /></el-icon>
      <span>设备管理</span>
    </el-menu-item>
  </el-menu>
</template>

<script setup>
// 导入Element Plus图标
import { Location } from '@element-plus/icons-vue'
</script>

<style scoped>
.sidebar-menu {
  height: 100vh; /* 侧边栏占满视口高度 */
  width: 200px; /* 侧边栏宽度 */
  border-right: none; /* 去掉默认边框 */
}
</style>