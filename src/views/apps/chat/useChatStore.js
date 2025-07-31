import {
  fetchSingleArticle,
  getProperty,
  sendMessage,
  storeEvent,
} from "@/services/chat";
import { defineStore } from "pinia";
import { inject } from "vue";

export const useChatStore = defineStore("chat", {
  // ℹ️ arrow function recommended for full type inference
  state: () => {
    // Get widget configuration from injection
    const widgetConfig = inject("widgetConfig", {});

    return {
      contacts: [],
      chatsContacts: [],
      profileUser: undefined,
      loading: false,
      property: null,
      activeChat: null,
      sessionId: null,
      conversationId: null,

      // Store the widget configuration values
      propertyId: widgetConfig.propertyId || null,
      conversationType: widgetConfig.conversationType || "info",
    };
  },
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
          this.conversationId,
          this.conversationType, // Pass the conversation type
          this.propertyId // Pass the property ID
        );

        this.sessionId = response.data.data.sessionId;

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
        return await storeEvent({
          messageId,
          articleId,
          type,
          name,
          usage,
          sessionId: this.sessionId,
        });
      } catch (error) {
        return error.response;
      }
    },
    async fetchProperty(id) {
      // Update the property ID in the store
      this.propertyId = id;

      try {
        const response = await getProperty(id);

        if (response.status === 200) {
          this.property = response.data.data;

          // Parse customCss and set theme main color if overlay gradient 1 exists
          if (response.data.data.customCss) {
            const cssVars = response.data.data.customCss
              .split(";")
              .map((line) => line.trim())
              .filter((line) => line.length > 0)
              .reduce((acc, line) => {
                const [key, value] = line.split(":").map((part) => part.trim());
                acc[key] = value;
                return acc;
              }, {});

            if (cssVars["--v-theme-main"]) {
              document.documentElement.style.setProperty(
                "--v-theme-main",
                cssVars["--v-theme-main"]
              );
            } else {
              document.documentElement.style.setProperty(
                "--v-theme-main",
                "rgba(93, 95, 239, 1)"
              );
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    setInitialChat() {
      // Get current locale from localStorage or default to 'en'
      const currentLocale = localStorage.getItem("locale") || "en";
      
      // Get translations for website addon
      let welcomeText = "";
      let choices = [];
      
      if (this.property?.translations?.websiteAddon?.[currentLocale]) {
        // Use new translations system
        const translation = this.property.translations.websiteAddon[currentLocale];
        welcomeText = translation.welcomeText || "";
        choices = translation.labels?.map(label => label.labelText) || [];
      } else if (this.property?.translations?.websiteAddon?.en) {
        // Fallback to English if current locale not available
        const translation = this.property.translations.websiteAddon.en;
        welcomeText = translation.welcomeText || "";
        choices = translation.labels?.map(label => label.labelText) || [];
      } else {
        // Fallback to old system
        welcomeText = this.property?.welcomeMessage || 
          `Zdravo ja sam ${this.property?.botName || "AI Assistant"}. Kako mogu danas da vam pomognem?`;
        choices = this.property?.welcomeSelectMessages !== "" 
          ? this.property.welcomeSelectMessages.split(",")
          : ["Sobe", "Sadržaji hotela", "Restoran"];
      }

      this.activeChat = {
        messages: [
          {
            text: welcomeText,
            type: "multi-choice",
            senderId: 1,
            createdAt: new Date(),
            messageId: 1,
            choices: choices,
            initialOptions: true,
          },
        ],
      };
    },
    
    updateInitialChatForLanguage() {
      // Only update if we have an active chat and it's the initial message
      if (this.activeChat?.messages?.length === 1 && this.activeChat.messages[0].initialOptions) {
        const currentLocale = localStorage.getItem("locale") || "en";
        
        let welcomeText = "";
        let choices = [];
        
        if (this.property?.translations?.websiteAddon?.[currentLocale]) {
          const translation = this.property.translations.websiteAddon[currentLocale];
          welcomeText = translation.welcomeText || "";
          choices = translation.labels?.map(label => label.labelText) || [];
        } else if (this.property?.translations?.websiteAddon?.en) {
          const translation = this.property.translations.websiteAddon.en;
          welcomeText = translation.welcomeText || "";
          choices = translation.labels?.map(label => label.labelText) || [];
        } else {
          welcomeText = this.property?.welcomeMessage || 
            `Zdravo ja sam ${this.property?.botName || "AI Assistant"}. Kako mogu danas da vam pomognem?`;
          choices = this.property?.welcomeSelectMessages !== "" 
            ? this.property.welcomeSelectMessages.split(",")
            : ["Sobe", "Sadržaji hotela", "Restoran"];
        }
        
        // Update the first message
        this.activeChat.messages[0].text = welcomeText;
        this.activeChat.messages[0].choices = choices;
      }
    }
  },
});
