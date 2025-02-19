import Chat from '@/components/Chat.vue'
import vuetify from '@/plugins/vuetify'
import { useChatStore } from '@/views/apps/chat/useChatStore'
import axios from 'axios'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

console.log('=== Starting MojoChat Initialization ===')

// Configure axios for the embedded environment
const BASE_URL = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_API_VERSION
const API_KEY = import.meta.env.VITE_APP_API_KEY

console.log('API Configuration:', {
  BASE_URL,
  API_KEY: API_KEY ? 'Present' : 'Missing',
})

const apiClient = axios.create({
  baseURL: BASE_URL,
})

// Add interceptors for propertyId
apiClient.interceptors.request.use(config => {
  console.log('Making API request:', config.url)
  
  config.headers.Accept = "application/json"
  config.headers["Content-Type"] = "application/json"
  config.headers["X-API-KEY"] = API_KEY

  // Add propertyId to all GET requests in URL
  if (config.method === 'get') {
    const separator = config.url.includes('?') ? '&' : '?'

    config.url = `${config.url}${separator}propertyId=${config.propertyId}`
  }
  
  // Add propertyId to all POST requests in body
  if (config.method === 'post') {
    config.data = {
      ...config.data,
      propertyId: config.propertyId,
    }
  }

  return config
})

console.log('API Client configured')

window.MojoChat = {
  init: function(config) {
    console.log('=== MojoChat.init called ===')
    console.log('Config with propertyId:', config)
        
    // Create container for the chat widget
    const chatContainer = document.createElement('div')

    chatContainer.id = 'mojo-chat-widget'
    document.body.appendChild(chatContainer)
    console.log('Chat container created:', chatContainer)

    // Create Vue app
    const app = createApp(Chat, {
      propertyId: config.propertyId,
    })

    console.log('Vue app created with propertyId:', config.propertyId)

    // Use plugins
    const pinia = createPinia()

    app.use(pinia)
    app.use(vuetify)
    console.log('Plugins initialized')

    // Initialize store with propertyId
    const store = useChatStore()

    store.setPropertyId(config.propertyId)
    console.log('Store initialized with propertyId:', store.propertyId)

    console.log('Mounting chat widget...')

    // Mount app
    app.mount('#mojo-chat-widget')
    console.log('=== MojoChat mounted successfully with propertyId:', config.propertyId, ' ===')
  },
}

console.log('MojoChat object created:', window.MojoChat ? 'Present' : 'Missing') 
