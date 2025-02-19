import {
  fetchSingleArticle,
  getProperty,
  sendMessage,
  storeEvent,
} from "@/services/chat";

export const useChatStore = defineStore("chat", {
  // ℹ️ arrow function recommended for full type inference
  state: () => ({
    contacts: [],
    chatsContacts: [],
    profileUser: undefined,
    loading: false,
    property: {},
    activeChat: {},
    sessionId: null,
    conversationId: null,
  }),
  actions: {
    async getChat() {
      return this.activeChat;
    },
    async sendMsg(message) {
      this.loading = true;

      // Add message
      this.activeChat.messages.push({
        text: message,
        type: "basic",
        senderId: 2,
        createdAt: new Date(),
      });

      try {
        const response = await sendMessage(
          message,
          this.sessionId,
          this.conversationId
        );

        // Function to parse the Markdown-like syntax into HTML
        function parseMarkdownToHTML(markdown) {
          return markdown
            .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") // Bold
            .replace(/\n- /g, "<br>&bull; ") // Bullet points
            .replace(/\n/g, "<br>"); // Line breaks
        }

        if (response.status === 200) {
          let cleanMessage = response.data.data.message;

          // Remove "Data: " prefix
          if (cleanMessage.startsWith("Data: ")) {
            cleanMessage = cleanMessage.substring(6); // Remove the first 6 characters
          }

          // Remove "Metadata: string" suffix
          const metadataIndex = cleanMessage.lastIndexOf("Metadata: string");
          if (metadataIndex !== -1) {
            cleanMessage = cleanMessage.substring(0, metadataIndex).trim(); // Trim to remove any trailing whitespace
          }

          if (response.data.data.operations.length === 0) {
            this.activeChat.messages.push({
              messageId: response.data.data.messageId,
              text: parseMarkdownToHTML(cleanMessage),
              type: "basic",
              senderId: 1,
              createdAt: new Date(),
            });
          }

          if (response.data.data.operations.length > 0) {
            if (
              response.data.data.operations[0].operationType ===
              "carousel_message"
            ) {
              // First lets add the basic message
              let cleanMessage = response.data.data.message;

              // Remove "Data: " prefix
              if (cleanMessage.startsWith("Data: ")) {
                cleanMessage = cleanMessage.substring(6); // Remove the first 6 characters
              }

              // Remove "Metadata: string" suffix
              const metadataIndex =
                cleanMessage.lastIndexOf("Metadata: string");
              if (metadataIndex !== -1) {
                cleanMessage = cleanMessage.substring(0, metadataIndex).trim(); // Trim to remove any trailing whitespace
              }

              this.activeChat.messages.push({
                messageId: response.data.data.messageId,
                text: parseMarkdownToHTML(cleanMessage),
                type: "basic",
                senderId: 1,
                createdAt: new Date(),
              });

              // Then fetch the articles, one by one
              let carouselArticles = [];

              for (const articleId of response.data.data.operations[0]
                .operationData) {
                const articleResponse = await fetchSingleArticle(articleId);

                if (articleResponse.status === 200) {
                  carouselArticles.push(articleResponse.data.data);
                }
              }

              this.activeChat.messages.push({
                messageId: response.data.data.messageId,
                articles: carouselArticles,
                type: "carousel",
                senderId: 1,
                createdAt: new Date(),
              });
            }

            if (
              response.data.data.operations[0].operationType ===
              "select_message"
            ) {
              // First lets add the basic message
              let cleanMessage = response.data.data.message;

              // Remove "Data: " prefix
              if (cleanMessage.startsWith("Data: ")) {
                cleanMessage = cleanMessage.substring(6); // Remove the first 6 characters
              }

              // Remove "Metadata: string" suffix

              const metadataIndex =
                cleanMessage.lastIndexOf("Metadata: string");
              if (metadataIndex !== -1) {
                cleanMessage = cleanMessage.substring(0, metadataIndex).trim(); // Trim to remove any trailing whitespace
              }

              // Then, display the options
              this.activeChat.messages.push({
                messageId: response.data.data.messageId,
                type: "multi-choice",
                text: parseMarkdownToHTML(cleanMessage),
                choices: response.data.data.operations[0].operationData,
                senderId: 1,
                createdAt: new Date(),
              });
            }
          }

          this.conversationId = response.data.data.conversationId;
          this.sessionId = response.data.data.sessionId;
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    async setCounter(counter) {
      this.counter = counter;
    },
    async handleStoreEvent({ messageId, articleId, type, name, usage }) {
      try {
        const response = await storeEvent({
          messageId,
          articleId,
          type,
          name,
          usage,
          sessionId: this.sessionId,
        });

        return response;
      } catch (error) {
        return error.response;
      }
    },
    async fetchProperty(id) {
      try {
        const response = await getProperty(id);

        if (response.status === 200) {
          this.property = response.data.data;
        }
      } catch (error) {
        console.error(error);
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
      };
    },
  },
});
