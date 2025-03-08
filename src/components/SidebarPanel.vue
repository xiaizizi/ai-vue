<template>
  <div class="sidebar" :class="{ 'sidebar-open': isOpen }">
    <div class="sidebar-content">
      <!-- 模型选择 -->
      <div class="section">
        <h3>AI 模型</h3>
        <select v-model="selectedModel" class="model-select">
          <option value="deepseek-r1-distill-qwen-1.5b">Deepseek Qwen 1.5B</option>
          <option value="qwen-max">Qwen Max</option>
          <option value="qwen-plus">Qwen Plus</option>
        </select>
      </div>

      <!-- 历史记录 -->
      <div class="section">
        <h3>历史记录</h3>
        <div class="history-list">
          <div v-for="(history, index) in chatHistory" :key="index" class="history-item">
            <span class="history-time">{{ formatTime(history.time) }}</span>
            <p class="history-preview">{{ history.content }}</p>
          </div>
        </div>
      </div>

      <!-- 用户设置 -->
      <div class="section">
        <h3>用户设置</h3>
        <div v-if="!isLoggedIn" class="login-section">
          <button class="login-btn" @click="showLoginModal = true">登录</button>
          <button class="register-btn" @click="showRegisterModal = true">注册</button>
        </div>
        <div v-else class="user-section">
          <div class="user-info">
            <span class="username">{{ user?.name }}</span>
            <button class="logout-btn" @click="logout">退出登录</button>
          </div>
          <div class="settings">
            <label class="setting-item">
              <span>深色模式</span>
              <input type="checkbox" v-model="darkMode" />
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- 移动端切换按钮 -->
    <button class="toggle-btn" @click="toggleSidebar">
      <span class="toggle-icon"></span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineOptions({
  name: 'SidebarPanel',
})

interface ChatHistoryItem {
  time: Date
  content: string
}

interface User {
  name: string
  // 其他用户信息字段
}

// 状态管理
const isOpen = ref(false)
const selectedModel = ref('deepseek-r1-distill-qwen-1.5b')
const chatHistory = ref<ChatHistoryItem[]>([])
const isLoggedIn = ref(false)
const user = ref<User | null>(null)
const darkMode = ref(false)
const showLoginModal = ref(false)
const showRegisterModal = ref(false)

// 方法
const toggleSidebar = () => {
  isOpen.value = !isOpen.value
}

const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(date)
}

const logout = () => {
  isLoggedIn.value = false
  user.value = null
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 300px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(15px);
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
}

.sidebar-content {
  padding: 20px;
  height: 100%;
  overflow-y: auto;
}

.section {
  margin-bottom: 30px;
}

.section h3 {
  font-size: 16px;
  color: #333;
  margin-bottom: 15px;
}

.model-select {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  background: white;
  font-size: 14px;
  transition: all 0.3s ease;
  cursor: pointer;
  outline: none;
}

.model-select:hover {
  border-color: #2196f3;
}

.model-select:focus {
  border-color: #2196f3;
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  padding: 14px;
  background: rgba(245, 245, 245, 0.8);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.history-item:hover {
  background: rgba(33, 150, 243, 0.1);
  border-color: rgba(33, 150, 243, 0.2);
  transform: translateY(-1px);
}

.history-item:hover {
  background: #eee;
}

.history-time {
  font-size: 12px;
  color: #666;
}

.history-preview {
  margin-top: 4px;
  font-size: 14px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.login-section,
.user-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.login-btn,
.register-btn,
.logout-btn {
  padding: 10px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.login-btn {
  background: #2196f3;
  color: white;
}

.register-btn {
  background: #e0e0e0;
  color: #333;
}

.logout-btn {
  background: #f44336;
  color: white;
}

.user-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}

.username {
  font-size: 16px;
  font-weight: 500;
}

.settings {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.toggle-btn {
  display: none;
  position: absolute;
  right: -40px;
  top: 20px;
  width: 40px;
  height: 40px;
  background: #2196f3;
  border: none;
  border-radius: 0 8px 8px 0;
  cursor: pointer;
}

.toggle-icon {
  display: block;
  width: 20px;
  height: 2px;
  background: white;
  margin: 4px auto;
  position: relative;
}

.toggle-icon::before,
.toggle-icon::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 2px;
  background: white;
  left: 0;
}

.toggle-icon::before {
  top: -6px;
}

.toggle-icon::after {
  bottom: -6px;
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }

  .sidebar-open {
    transform: translateX(0);
  }

  .toggle-btn {
    display: block;
  }
}
</style>
