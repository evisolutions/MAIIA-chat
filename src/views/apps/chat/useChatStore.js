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
      this.activeChat = {
        messages: [
          {
            text:
              this.property.welcomeMessage ||
              `Zdravo ja sam ${this.property.botName}. Kako mogu danas da vam pomognem?`,
            type: "multi-choice",
            senderId: 1,
            createdAt: new Date(),
            messageId: 1,
            choices:
              this.property.welcomeSelectMessages !== ""
                ? this.property.welcomeSelectMessages.split(",")
                : ["Sobe", "Sadržaji hotela", "Restoran"],
            initialOptions: true,
          },
        ],
        // messages: [
        //   {
        //     text: "Zdravo ja sam Sunčica. Kako mogu danas da vam pomognem?",
        //     type: "multi-choice",
        //     senderId: 1,
        //     createdAt: "2025-05-06T13:10:40.689Z",
        //     messageId: 1,
        //     choices: ["Sobe", "Sadržaji hotela", "Restoran"],
        //     initialOptions: true,
        //   },
        //   {
        //     text: "Reci mi nešto više o sadržajima hotela",
        //     type: "basic",
        //     senderId: 2,
        //     createdAt: "2025-05-06T13:10:44.025Z",
        //   },
        //   {
        //     messageId: 12612,
        //     text: 'U hotelu Sunce, imamo savršen paket za sve vas koji želite da se opustite i uživate u trenutku - predstavljamo vam "Spa moments"! 🌟 Ovaj paket je idealan za one koji žele da provedu savršeno spa vreme. Uživajte u svim sadržajima našeg Wellness&Spa centra, gde možete potpuno da se opustite uz parcijalnu relax masažu. Da bi vaša relaksacija bila još potpunija, uživaćete i u osvežavajućem detox juice napitku.<br><br>Cena paketa za jednu osobu iznosi 6.900 RSD, dok je za dve osobe 11.000 RSD. Takođe, imamo i Family SPA moments paket, savršeno kreiran za nezaboravne porodične trenutke! Ovaj paket uključuje dve odrasle osobe i do tri deteta uzrasta do 12 godina, a nudi 2 parcijalne masaže, po jedan detox napitak za odrasle i voćni sok za decu, kao i ukusnu pizzu capricciosa. Cena ovog paketa je 15.000 RSD.<br><br>Dođite i priuštite sebi i svojoj porodici trenutke opuštanja i uživanja! 🧖‍♀️✨',
        //     type: "basic",
        //     senderId: 1,
        //     createdAt: "2025-05-06T13:10:59.755Z",
        //   },
        //   {
        //     messageId: 12612,
        //     articles: [
        //       {
        //         id: 661,
        //         name: "Spa moments",
        //         description:
        //           "Spa moments je specijalno kreiran paket za sve one koji žele da provedu savršeno spa vreme u hotelu Sunce.\r\n\r\nPaket nudi trenutke relaksacije uz korišćenje svih sadržaja Wellness&Spa centra, potpuno opuštanje uz parcijalnu relax masažu, i osveženje uz detox juice napitak.\r\n\r\nCena paketa za jednu osobu: 6.900 RSD\r\n\r\nCena paketa za dve osobe: 11.000 RSD\r\n\r\nFamily SPA moments specijalno kreiran za nezaboravne porodične trenutke.\r\n\r\nPaket se odnosi na dve odrasle osobe i do tri deteta uzrasta do 12 godina, i uključuje:\r\n\r\n2x parcijalna masaža\r\n\r\nPo jedan napitak za odrasle (elixir detox) i po jedan voćni sok za decu\r\n\r\n1x pizza capricciosa\r\n\r\nCena paketa: 15.000 RSD",
        //         price: 0,
        //         typeName: "Spa center service",
        //         category: "Facility",
        //         redirectUrl:
        //           "https://suncehotel.rs/rs/naslovna/wellness-spa/spa-moments.html",
        //         tags: [],
        //         llmAdditionalData: null,
        //         showInUserApp: true,
        //         showInWebsiteAddon: true,
        //         metaData: [],
        //         createdAt: "2025-01-29 19:36:25",
        //         propertyId: 15,
        //         coverImageUrl:
        //           "https://app.maiiaconcierge.ai/uploads/media/6649ee602e8826c3a131f053a0e7e85e.jpg",
        //         galleryImageUrls: [
        //           "https://app.maiiaconcierge.ai/uploads/media/9d749df42818e9d05614daa82852732a.jpg",
        //         ],
        //       },
        //       {
        //         id: 662,
        //         name: "Otvoreni bazen",
        //         description:
        //           "Osim velikog broja sadržaja u  Spa centru i dva zatvorena  bazena, tokom letnjih meseci hotel Sunce nudi uživanje na otvorenom bazenu i pool bar-u koji nudi veliki izbor osvežavajućih napitaka i laganih obroka.\r\n\r\nOkružen ležaljkama i suncobranima predstavlja idealno mesto za provesti dan na otvorenom, bilo da se sunčate, čitate knjigu ili uživate u osvežavajućem napitku.\r\n\r\nPogled na park i reku stvara mirnu i idiličnu atmosferu, idealnu za beg od svakodnevnog stresa  i uživanje u trenucima relaksacije u prirodi.\r\n\r\nDimenzije bazena su 19m x 12m, dubina od 80 do 140cm i temperatura vode je do 25 stepeni.",
        //         price: 0,
        //         typeName: "Outdoor pool",
        //         category: "Facility",
        //         redirectUrl: "https://suncehotel.rs/otvoreni-bazen",
        //         tags: [],
        //         llmAdditionalData: null,
        //         showInUserApp: true,
        //         showInWebsiteAddon: true,
        //         metaData: [],
        //         createdAt: "2025-01-29 19:39:09",
        //         propertyId: 15,
        //         coverImageUrl:
        //           "https://app.maiiaconcierge.ai/uploads/media/b54ae92cd8e643d562b90849df5957d4.jpg",
        //         galleryImageUrls: [
        //           "https://app.maiiaconcierge.ai/uploads/media/9e8a1d52f93ed65830254b5b4e5cc5cd.jpg",
        //           "https://app.maiiaconcierge.ai/uploads/media/85a36fc2311489afe80323e0b7c6a070.jpg",
        //         ],
        //       },
        //       {
        //         id: 663,
        //         name: "Zatvoreni bazen",
        //         description:
        //           "Zatvoreni bazen je nezaobilazna tačka našeg Spa centra. Dimenzije bazena su 12m x 8m, dubina od 80 do 140cm i temperatura vode je 30 stepeni. Bazen poseduje i vodene atrakcije dva lastina repa.\r\n\r\nPored plivačkog bazena u ponudi je i manji hidrimasažni bazen dimenzije 4m x 9m,dubina 90cm i temperatura vode u ovom bazenu je 32 stepena. Hidromasažni bazen ima hidromasažne trake za celo telo i hidromasažere sa bočne strane.",
        //         price: 0,
        //         typeName: "Indoor pool",
        //         category: "Facility",
        //         redirectUrl: "https://suncehotel.rs/zatvoreni-bazen",
        //         tags: [],
        //         llmAdditionalData: null,
        //         showInUserApp: true,
        //         showInWebsiteAddon: true,
        //         metaData: [],
        //         createdAt: "2025-01-29 19:53:37",
        //         propertyId: 15,
        //         coverImageUrl:
        //           "https://app.maiiaconcierge.ai/uploads/media/704bea6ac3bd9903e10c88549dd90e74.png",
        //         galleryImageUrls: [
        //           "https://app.maiiaconcierge.ai/uploads/media/c3ccced1dd585bfea9ea6960e5647aed.png",
        //         ],
        //       },
        //       {
        //         id: 664,
        //         name: "Sauna",
        //         description:
        //           "Sauna blagotvorno utiče na termoregulaciju organizma. Saune se razlikuju po temperaturi i vlažnosti vazduha zato se u našem hotelu nalaze tri saune.\r\n\r\nFINSKA SAUNA temperature 90 stepeni, a vlažnost vazduha je 10% i time je čini najtoplijom procedurom u našem hotelu.\r\n\r\nBIO SAUNA kombinacija finske saune i parnog kupatila, temperatura dostiže do 65 stepeni, a vlažnost vazduha iznosi 60%.\r\n\r\nSOFT SAUNA za one koji ne podnose visoke temperature. Temperatura iznosi 55 stepeni, a vlažnost 40%.\r\n\r\nKorišćenje sauna je dozvoljeno isključivo odraslim osobama.",
        //         price: 0,
        //         typeName: "Sauna",
        //         category: "Facility",
        //         redirectUrl: "https://suncehotel.rs/sauna",
        //         tags: [],
        //         llmAdditionalData: null,
        //         showInUserApp: true,
        //         showInWebsiteAddon: true,
        //         metaData: [],
        //         createdAt: "2025-01-29 19:54:56",
        //         propertyId: 15,
        //         coverImageUrl:
        //           "https://app.maiiaconcierge.ai/uploads/media/cd9bc42b18fe6b66b1deef1fda217a97.png",
        //         galleryImageUrls: [
        //           "https://app.maiiaconcierge.ai/uploads/media/19814739b34e0e66c25ecb42a4f38061.png",
        //         ],
        //       },
        //     ],
        //     type: "carousel",
        //     senderId: 1,
        //     createdAt: "2025-05-06T13:11:00.108Z",
        //   },
        // ],
      };
    },
  },
});
