<template>
  <div class="ai-chat">
    <div class="chat-container" :class="{ empty: messages.length === 0 }">
      <div class="messages-area">
        <div class="welcome-screen" v-if="messages.length === 0">
          <div class="ai-avatar">
            <img src="/ai-avatar.svg" alt="AI Avatar" />
          </div>
          <h1>AI 助手</h1>
          <p>您好！我是乐直才-AI机器人，请问有什么我可以帮您的吗？</p>
          <div class="suggestion-chips">
            <button @click="useExample('帮我写一个Vue3组件')">帮我写一个Vue3组件</button>
            <button @click="useExample('如何使用TypeScript')">如何使用TypeScript</button>
            <button @click="useExample('解释一下Vue3的响应式原理')">
              思考时间 解释一下Vue3的响应式原理
            </button>
          </div>
        </div>
        <div class="message-wrapper" v-else-if="!isHidden">
          <template v-for="(message, index) in messages" :key="index">
            <div class="user-message" v-if="message.type === 'user'">
              <div class="message-bubble">
                <div class="message-content">{{ message.content }}</div>
                <div class="message-info">
                  <span class="message-time">{{ message.time }}</span>
                </div>
              </div>
            </div>

            <div class="ai-message" v-else>
              <div class="message-bubble" :class="{ error: message.isError }">
                <div class="message-content">
                  <pre>{{ message.content }}</pre>
                </div>
                <div class="message-info">
                  <span class="message-time">{{ message.time }}</span>
                  <span class="thinking-time" v-if="message.thinkingTime"
                    >思考用时: {{ message.thinkingTime }}秒</span
                  >
                </div>
              </div>
            </div>
          </template>

          <div class="ai-message thinking" v-if="isLoading">
            <div class="message-bubble thinking">
              <div class="thinking-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div class="thinking-process">
                <p>正在思考您的问题...</p>
                <p>• {{ reasoningContent[currentReasoningStep] }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div :class="['input-area', { 'with-messages': messages.length > 0 }]">
        <input v-model="userInput" @keyup.enter="sendMessage" placeholder="请输入您的问题..." />
        <button @click="sendMessage" :disabled="isLoading">发送</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'
import OpenAI from 'openai'

interface ChatDelta {
  content?: string
}

interface ChatChoice {
  delta: ChatDelta
}

interface ChatResponse {
  choices?: ChatChoice[]
}

interface ChatError {
  message: string
  status?: number
  code?: string
}

interface ChatMessage {
  type: 'user' | 'ai'
  content: string
  isError?: boolean
  time?: string
  thinkingTime?: string
}

const STORAGE_KEY = 'chat_history'

const userInput = ref('')
const messages = ref<ChatMessage[]>([])
const isLoading = ref(false)
const isHidden = ref(false)
const reasoningContent = ref([
  '正在分析您的问题...',
  '思考可能的解决方案...',
  '整理相关知识和信息...',
  '生成详细的回答...',
  '优化和完善答案内容...',
])
const currentReasoningStep = ref(0)

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_DASHSCOPE_API_KEY,
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  dangerouslyAllowBrowser: true,
})

// 加载历史记录
const loadChatHistory = () => {
  const savedHistory = localStorage.getItem(STORAGE_KEY)
  if (savedHistory) {
    messages.value = JSON.parse(savedHistory)
  }
}

// 保存历史记录
const saveChatHistory = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.value))
}

async function sendMessage() {
  if (!userInput.value || isLoading.value) return

  const currentInput = userInput.value
  userInput.value = ''
  const startTime = Date.now()
  const userMessage: ChatMessage = {
    type: 'user',
    content: currentInput,
    time: new Date().toLocaleTimeString(),
  }
  messages.value.push(userMessage)
  saveChatHistory()

  // 添加自动滚动到底部
  await nextTick()
  const chatContainer = document.querySelector('.chat-container')
  if (chatContainer) {
    chatContainer.scrollTop = chatContainer.scrollHeight
  }

  try {
    isLoading.value = true
    currentReasoningStep.value = 0
    let aiResponse = ''

    const reasoningInterval = setInterval(() => {
      if (currentReasoningStep.value < reasoningContent.value.length - 1) {
        currentReasoningStep.value++
      }
    }, 2000)

    const stream = await openai.chat.completions.create({
      model: 'deepseek-r1-distill-qwen-1.5b',
      messages: [
        {
          role: 'system',
          content:
            '你是一个友好的中文AI助手。请始终使用中文回答，可以在合适的时候使用表情符号来增加交互的趣味性。例如：😊 🤔 👍 等。',
        },
        { role: 'user', content: currentInput },
      ],
      stream: true,
    })

    for await (const chunk of stream) {
      const response = chunk as ChatResponse
      if (!response.choices?.length) continue

      const delta = response.choices[0].delta

      if (delta.content) {
        aiResponse += delta.content
      }
    }

    clearInterval(reasoningInterval)
    const endTime = Date.now()
    const thinkingTimeInSeconds = ((endTime - startTime) / 1000).toFixed(1)
    const aiMessage: ChatMessage = {
      type: 'ai',
      content: aiResponse,
      time: new Date().toLocaleTimeString(),
      thinkingTime: thinkingTimeInSeconds,
    }
    messages.value.push(aiMessage)
    saveChatHistory()

    // 添加AI回复后的自动滚动
    await nextTick()
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight
    }
  } catch (error) {
    const chatError = error as ChatError
    console.error('错误信息:', chatError.message)
    if (chatError.code) console.error('错误代码:', chatError.code)
    if (chatError.status) console.error('状态码:', chatError.status)
    const errorMessage: ChatMessage = {
      type: 'ai',
      content: '抱歉，发生了一些错误，请查看控制台了解详细信息。',
      isError: true,
      time: new Date().toLocaleTimeString(),
    }
    messages.value.push(errorMessage)
    saveChatHistory()
  } finally {
    isLoading.value = false
  }
}

const useExample = (text: string) => {
  userInput.value = text
  sendMessage()
}

onMounted(() => {
  loadChatHistory()
})
</script>

<style scoped></style>
