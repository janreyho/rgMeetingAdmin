<template>
  <el-container style="height: 100vh;">
    <!-- 左侧侧边栏 -->
    <el-aside width="200px" style="background-color: #0f172a;">
      <Sidebar />
    </el-aside>

    <!-- 主内容区 -->
    <el-container>
      <!-- 主内容（路由出口） -->
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
// 导入侧边栏组件
import Sidebar from '@/components/Sidebar.vue'
</script>

<style scoped>
/* 重置默认边距 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>