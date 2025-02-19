import {
  getProperty,
  storeEvent
} from "@/services/chat"
import { defineStore } from 'pinia'

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
  }),
  actions: {
    async getChat() {
      try {
        // Initialize chat if needed
        if (!this.activeChat) {
          this.activeChat = {
            messages: [],
          }
        }
        
        return this.activeChat
      } catch (error) {
        console.error('Error getting chat:', error)
      }
    },
    async sendMsg(message) {
      try {
        this.loading = true

        // Your existing send message logic
        if (!this.activeChat.messages) {
          this.activeChat.messages = [] // Ensure messages array exists
        }
        this.activeChat.messages.push({
          message,
          senderId: 2, // User message
          time: new Date().toISOString(),
        })

        // Add your API call here if needed
      } catch (error) {
        console.error('Error sending message:', error)
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
      try {
        const response = await getProperty(id)

        if (response.status === 200) {
          this.property = response.data.data
        }
      } catch (error) {
        console.error(error)
      }
    },
    async setInitialChat() {
      this.activeChat = {
        messages: [
          {
            text: `Zdravo ja sam ${this.property?.botName}, AI Concierge hotela ${this.property?.name}. Kako mogu danas da vam pomognem?`,
            type: "basic",
            senderId: 1,
            createdAt: new Date(),
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
