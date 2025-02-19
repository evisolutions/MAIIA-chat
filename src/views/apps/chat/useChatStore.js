import {
  storeEvent,
} from "@/services/chat"
import axios from 'axios'
import { defineStore } from 'pinia'

// Create API client outside the store
const BASE_URL = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_API_VERSION
const API_KEY = import.meta.env.VITE_APP_API_KEY

const apiClient = axios.create({
  baseURL: BASE_URL,
})

// Add interceptors
apiClient.interceptors.request.use(config => {
  config.headers.Accept = "application/json"
  config.headers["Content-Type"] = "application/json"
  config.headers["X-API-KEY"] = API_KEY
  
  return config
})

export const useChatStore = defineStore("chat", {
  // ℹ️ arrow function recommended for full type inference
  state: () => ({
    contacts: [],
    chatsContacts: [],
    profileUser: undefined,
    loading: false,
    property: {},
    activeChat: {
      messages: [],
    },
    sessionId: null,
    conversationId: null,
    propertyId: null,
  }),
  actions: {
    setPropertyId(id) {
      console.log('Setting propertyId in store:', id)
      this.propertyId = id

      // Fetch property data when ID is set
      this.fetchProperty(id)
    },
    async getChat() {
      try {
        if (!this.activeChat) {
          this.activeChat = {
            messages: [],
          }
        }

        // Initialize chat session if needed
      } catch (error) {
        console.error('Error getting chat:', error)
      }
    },
    async sendMsg(message) {
      console.log('Sending message with propertyId:', this.propertyId)
      try {
        this.loading = true
        
        // Add user message to UI immediately
        if (!this.activeChat.messages) {
          this.activeChat.messages = []
        }
        
        this.activeChat.messages.push({
          message,
          senderId: 2, // User message
          time: new Date().toISOString(),
        })

        // Send to API
        const response = await apiClient.post('/message/send', {
          message,
          source: "website_add_on",
          conversationType: "info",
          sessionId: this.sessionId,
          propertyId: this.propertyId,
        })

        console.log('API response with propertyId:', this.propertyId, response)

        // Add AI response to messages
        if (response.data) {
          this.activeChat.messages.push({
            message: response.data.message,
            senderId: 1, // AI message
            time: new Date().toISOString(),
          })
        }

      } catch (error) {
        console.error('Error sending message with propertyId:', this.propertyId, error)
      } finally {
        this.loading = false
      }
    },
    async setCounter(counter) {
      this.counter = counter
    },
    async handleStoreEvent({ messageId, articleId, type, name, usage }) {
      try {
        return await storeEvent({
          messageId,
          articleId,
          type,
          name,
          usage,
          sessionId: this.sessionId,
        })
      } catch (error) {
        return error.response
      }
    },
    async fetchProperty(id) {
      console.log('Fetching property data for ID:', id)
      try {
        const response = await apiClient.get(`/property/fetch-single?propertyId=${id}`)

        console.log('Property data received:', response.data)
        
        if (response.data) {
          this.property = response.data

          // Initialize chat after property is fetched
          this.setInitialChat()
        }
      } catch (error) {
        console.error('Error fetching property:', error)
      }
    },
    async setInitialChat() {
      console.log('Setting initial chat with property:', this.property)
      this.activeChat = {
        messages: [
          {
            message: `Zdravo ja sam ${this.property?.botName}, AI Concierge hotela ${this.property?.name}. Kako mogu danas da vam pomognem?`,
            type: "basic",
            senderId: 1,
            time: new Date().toISOString(),
            messageId: 1,
            type: "multi-choice",
            choices: ["Sobe", "Sadržaji hotela", "Restoran"],
            initialOptions: true,
          },
        ],
      }
    },
  },
})
