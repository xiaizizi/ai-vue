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
        <div class="message-wrapper" v-else>
          <template v-for="(message, index) in messages" :key="index">
            <div class="user-message" v-if="message.type === 'user'">
              <div class="message-content">{{ message.content }}</div>
              <div class="message-actions">
                <button @click="copyMessage(message.content)" title="复制">
                  <span class="action-icon">📋</span>
                </button>
              </div>
            </div>

            <div class="ai-message" v-else>
              <div class="message-content">
                <pre>{{ message.content }}</pre>
              </div>
              <div class="message-actions">
                <button
                  @click="toggleLike(index)"
                  :class="{ 'liked': message.liked }"
                  title="点赞"
                >
                  <span class="action-icon">{{ message.liked ? '❤️' : '🤍' }}</span>
                </button>
                <button @click="regenerateMessage(index)" title="重新生成">
                  <span class="action-icon">🔄</span>
                </button>
                <button @click="copyMessage(message.content)" title="复制">
                  <span class="action-icon">📋</span>
                </button>
              </div>
            </div>
          </template>

          <div class="ai-message thinking" v-if="isLoading">
            <div class="thinking-process">
              <p>正在思考您的问题...</p>
              <p>• {{ reasoningContent[currentReasoningStep] }}</p>
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
  liked?: boolean
}

const STORAGE_KEY = 'chat_history'

const userInput = ref('')
const messages = ref<ChatMessage[]>([])
const isLoading = ref(false)
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
  baseURL: import.meta.env.VITE_API_URL,
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

// 复制消息内容
const copyMessage = async (content: string) => {
  try {
    await navigator.clipboard.writeText(content)
    alert('已复制到剪贴板')
  } catch (err) {
    console.error('复制失败:', err)
    alert('复制失败，请手动复制')
  }
}

// 切换点赞状态
const toggleLike = (index: number) => {
  if (messages.value[index]) {
    messages.value[index].liked = !messages.value[index].liked
    saveChatHistory()
  }
}

// 重新生成消息
const regenerateMessage = async (index: number) => {
  if (isLoading.value) return

  const targetMessage = messages.value[index]
  if (!targetMessage || targetMessage.type !== 'ai') return

  // 找到对应的用户输入
  let userMessageIndex = index - 1
  while (userMessageIndex >= 0 && messages.value[userMessageIndex].type !== 'user') {
    userMessageIndex--
  }
  if (userMessageIndex < 0) return

  const userMessage = messages.value[userMessageIndex]

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
        { role: 'user', content: userMessage.content },
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

    // 更新现有消息而不是添加新消息
    messages.value[index] = {
      type: 'ai',
      content: aiResponse,
      liked: false
    }
    saveChatHistory()

    await nextTick()
    const chatContainer = document.querySelector('.chat-container')
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight
    }
  } catch (error) {
    const chatError = error as ChatError
    console.error('错误信息:', chatError.message)
    if (chatError.code) console.error('错误代码:', chatError.code)
    if (chatError.status) console.error('状态码:', chatError.status)
    messages.value[index] = {
      type: 'ai',
      content: '抱歉，重新生成回答时发生错误，请查看控制台了解详细信息。',
      isError: true
    }
    saveChatHistory()
  } finally {
    isLoading.value = false
  }
}

async function sendMessage() {
  if (!userInput.value || isLoading.value) return

  const currentInput = userInput.value
  userInput.value = ''
  const userMessage: ChatMessage = {
    type: 'user',
    content: currentInput
  }
  messages.value.push(userMessage)
  saveChatHistory()

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
    const aiMessage: ChatMessage = {
      type: 'ai',
      content: aiResponse,
      liked: false
    }
    messages.value.push(aiMessage)
    saveChatHistory()

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
      isError: true
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

<style scoped>
.message-actions {
  display: flex;
  gap: 8px;
  margin-left: 12px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.user-message:hover .message-actions,
.ai-message:hover .message-actions {
  opacity: 1;
}

.message-actions button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.message-actions button:hover {
  background: rgba(0, 0, 0, 0.05);
}

.message-actions .action-icon {
  font-size: 16px;
}

.user-message,
.ai-message {
  display: flex;
  align-items: flex-start;
}

.liked {
  animation: likeAnimation 0.3s ease;
}

@keyframes likeAnimation {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style>
