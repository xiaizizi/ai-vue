<script setup lang="ts">
import AIChat from './components/AIChat.vue'
</script>

<template>
  <main>
    <div class="content-area">
      <AIChat />
      <div class="icp-info">
        <a href="https://beian.miit.gov.cn" target="_blank" rel="noopener noreferrer"
          >豫ICP备2021010038号</a
        >
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  display: flex;
  min-height: 100vh;
  position: relative;
}

.content-area {
  flex: 1;
  padding: 0 20px;
  position: relative;
}

.icp-info {
  position: fixed;
  bottom: 20px;
  left: 0;
  width: 100%;
  text-align: center;
  padding: 10px;
}

.icp-info a {
  color: #666;
  text-decoration: none;
  font-size: 12px;
}

.icp-info a:hover {
  color: #333;
}


</style>
