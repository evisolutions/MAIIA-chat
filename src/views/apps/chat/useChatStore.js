import DeluksSoba from "@/assets/images/property/deluks-soba.png";
import DeluxSobaSaGalerijom from "@/assets/images/property/delux-soba-sa-galerijom.jpg";
import PremiumPorodicnaSoba from "@/assets/images/property/premium-porodicna-soba.png";
import Saune from "@/assets/images/property/saune.png";
import SuperiorDvokrevetnaSoba from "@/assets/images/property/superior-dvokrevetna-soba.png";
import SuperiorSoba from "@/assets/images/property/superior-soba.png";
import Teretana from "@/assets/images/property/teretana.jpg";
import ZatvoreniBazen from "@/assets/images/property/zatvoreni-bazen.png";

export const useChatStore = defineStore("chat", {
  // ℹ️ arrow function recommended for full type inference
  state: () => ({
    contacts: [],
    chatsContacts: [],
    profileUser: undefined,
    loading: false,
    activeChat: {
      messages: [
        {
          id: 1,
          type: "multi-choice",
          text: "Zdravo ja sam Sunčica, AI Concierge hotela Sunce. \nKako mogu danas da vam pomognem?",
          createdAt: new Date(),
          senderId: 1,
          receiverId: 2,
          choices: ["Sobe", "Sadržaji hotela", "Restoran"],
        },
      ],
    },
    counter: 0,
  }),
  actions: {
    async getChat() {
      return this.activeChat;
    },
    async sendMsg(message) {
      // First, add this message to the chat
      if (message !== "soba" && message !== "sauna") {
        this.activeChat.messages.push({
          id: Math.floor(Math.random() * 1000),
          type: "basic",
          text: message,
          createdAt: new Date(),
          senderId: 2,
          receiverId: 1,
        });
      }

      this.loading = true;

      // Then, generate a response
      let newMessages = [];
      const messages = [
        {
          id: Math.floor(Math.random() * 1000),
          type: "basic",
          text: "To je sjajno, koliko osoba očekujemo?",
          createdAt: new Date(),
          senderId: 1,
          receiverId: 2,
        },
        {
          id: Math.floor(Math.random() * 1000),
          type: "basic",
          text: "To zvuči kao biznis putovanje, jesam li u pravu?",
          createdAt: new Date(),
          senderId: 1,
          receiverId: 2,
        },
        {
          id: Math.floor(Math.random() * 1000),
          type: "basic",
          text: "Drago mi je 🙂. Nažalost naš hotel nema jednokrevetne sobe u ponudi, ali imamo nekoliko soba koje odgovaraju biznis korisnicima. \n\nPored toga, naš hotel poseduje nekoliko prostora za rad sa odličnom internet konekcijom koje možete besplatno koristiti. \n\nA posle napornog dana, možete se opustiti u našem čuvenom spa centru, besplatnom za goste hotela, što čini idealan spoj posla i opuštanja. \n\nNaše ljubazno osoblje ima dosta iskustva sa biznis putnicima, a ja ću se pobrinuti da vam celokupno iskustvo bude što ugodnije.",
          createdAt: new Date(),
          senderId: 1,
          receiverId: 2,
        },
        {
          id: Math.floor(Math.random() * 1000),
          type: "slider",
          createdAt: new Date(),
          senderId: 1,
          receiverId: 2,
          sliderArticles: [
            {
              id: 1,
              link: "deluxe-dvokrevetna-soba",
              title: "Deluks soba",
              subtitle: "Osunčana tokom celog dana",
              tag: "Najčešći izbor",
              image: DeluksSoba,
            },
            {
              id: 2,
              link: "superior-dvokrevetna-soba",
              title: "Superior dvokrevetna soba",
              subtitle: "Idealna za biznis korisnike",
              tag: "Biznis izbor",
              image: SuperiorSoba,
            },
            {
              id: 3,
              link: "delux-soba-sa-galerijom",
              title: "Delux soba sa galerijom",
              subtitle: "Jedinstvena, komforna, moderna",
              tag: "Pogled na bazen",
              image: DeluxSobaSaGalerijom,
            },
          ],
        },
        {
          id: Math.floor(Math.random() * 1000),
          type: "basic",
          text: "Hvala što birate naš hotel. Hotel Sunce i ja vas željno isčekujemo 😊  ",
          createdAt: new Date(),
          senderId: 1,
          receiverId: 2,
        },
        {
          id: Math.floor(Math.random() * 1000),
          type: "basic",
          text: "Nema na čemu, tu smo da vam pomognemo.",
          createdAt: new Date(),
          senderId: 1,
          receiverId: 2,
        },
        {
          id: Math.floor(Math.random() * 1000),
          type: "basic",
          text: "Naš hotel je poznat po svojoj udobnoj atmosferi, ali verovatno najpoznatiji po našem čuvenom spa centru, koji obiluje sadržajima.",
          createdAt: new Date(),
          senderId: 1,
          receiverId: 2,
        },
        {
          id: Math.floor(Math.random() * 1000),
          type: "multi-choice",
          text: "Molim vas odaberite o kom sadržaju želite da saznate više",
          createdAt: new Date(),
          senderId: 1,
          receiverId: 2,
          choices: [
            "Restoran",
            "Spa centar",
            "Teretana",
            "Sadržaji za decu",
            "Biznis sadržaji",
          ],
        },
        {
          id: Math.floor(Math.random() * 1000),
          type: "basic",
          text: "Naš spa centar obiluje sadržajima, koji su besplatni za goste hotela.\n\nNaš spa centar sadrži 3 tipa saune, tursko kupatilo, zatvoreni bazen, otvoreni bazen, tepidarijum, kao i sobu neverovatno dobrom atmosferom namenjenoj za masaže. Klinite na neki od sadržaja dole kako bi ste saznali više o tome.",
          createdAt: new Date(),
          senderId: 1,
          receiverId: 2,
        },
        {
          id: Math.floor(Math.random() * 1000),
          type: "slider",
          createdAt: new Date(),
          senderId: 1,
          receiverId: 2,
          sliderArticles: [
            {
              id: 1,
              link: "sauna",
              title: "Saune",
              subtitle: "3 tipa sauna za potpuno opuštanje",
              tag: "Besplatno za goste hotela",
              image: Saune,
            },
            {
              id: 2,
              link: "zatvoreni-bazen",
              title: "Zatvoreni bazen",
              subtitle: "Topla voda tokom cele godine",
              tag: "Besplatno za goste hotela",
              image: ZatvoreniBazen,
            },
            {
              id: 3,
              link: "teretana",
              title: "Teretana",
              subtitle: "Opremljena najnovijim spravama",
              tag: "Besplatno za goste hotela",
              image: Teretana,
            },
          ],
        },
        {
          id: Math.floor(Math.random() * 1000),
          type: "basic",
          text: "Naš hotel poseduje 3 tipa sauna, različite temperature i vlažnosti, čija kombinovana temperatura omogućava opuštanje i najzategnutijih mišića.\n\nU ponudi imamo Finsku saunu, temperature 90 stepeni, Bio saunu, koja je veoma popularna kombinacija Finske saune i turskog kupatila i Soft saunu za one koji preferiraju niže temperature.\n\nHotel nudi više paketa za goste hotela koji podrazumevaju noćenje i neograničeno korišćenje Spa centra, medju kojima je napopularniji paket Sunčana jesen koji se može kombinovati sa smeštajima dole.",
          createdAt: new Date(),
          senderId: 1,
          receiverId: 2,
        },
        {
          id: Math.floor(Math.random() * 1000),
          type: "slider",
          createdAt: new Date(),
          senderId: 1,
          receiverId: 2,
          sliderArticles: [
            {
              id: 3,
              link: "superior-dvokrevetna-soba",
              title: "Superior dvokrevetna soba",
              subtitle: "Paket smeštaj + neograničen Spa",
              tag: "Najčešći izbor",
              image: SuperiorDvokrevetnaSoba,
            },
            {
              id: 4,
              link: "premium-porodična-soba.html",
              title: "Premium porodična soba",
              subtitle: "Paket smeštaj + neograničen Spa",
              tag: "2 + 2 ležaja",
              image: PremiumPorodicnaSoba,
            },
          ],
        },
        {
          id: Math.floor(Math.random() * 1000),
          type: "basic",
          text: "Hvala što birate naš hotel. Hotel Sunce i ja vas željno isčekujemo 😊  ",
          createdAt: new Date(),
          senderId: 1,
          receiverId: 2,
        },
        {
          id: Math.floor(Math.random() * 1000),
          type: "basic",
          text: "Naš restoran je sjajan, ali mi nažalost trenutno fale informacije o samom restoranu, kao i o njegovoj ponudi.\n\nMolim vas da me ponovo pitate ovo isto pitanje za mesec i po dana. Nadam se da će me hotel naučiti da pričam o našem odličnom restoranu do tad 😊",
          createdAt: new Date(),
          senderId: 1,
          receiverId: 2,
        },
      ];

      // Prvi screen
      if (this.counter === 0) {
        newMessages.push(messages[0]);
      }

      if (this.counter === 1) {
        newMessages.push(messages[1]);
      }

      if (this.counter === 2) {
        newMessages.push(messages[2]);
        newMessages.push(messages[3]);
      }

      if (this.counter === 3) {
        newMessages.push(messages[4]);
      }

      if (this.counter === 4) {
        newMessages.push(messages[5]);
      }

      // Drugi screen
      if (this.counter === 5) {
        newMessages.push(messages[6]);
        newMessages.push(messages[7]);
      }

      if (this.counter === 6) {
        newMessages.push(messages[8]);
        newMessages.push(messages[9]);
      }

      if (this.counter === 7) {
        newMessages.push(messages[10]);
        newMessages.push(messages[11]);
      }

      if (this.counter === 8) {
        newMessages.push(messages[12]);
      }

      // Treci screen
      if (this.counter === 9) {
        newMessages.push(messages[13]);
      }

      this.setCounter(this.counter + 1);

      // switch (message) {
      //   // Sobe

      //   case "Interesuje me da saznam nešto više o sobama":
      //     newMessages.push({
      //       id: Math.floor(Math.random() * 1000),
      //       type: "basic",
      //       text: "To je sjajno, koliko osoba očekujemo?",
      //       createdAt: new Date(),
      //       senderId: 1,
      //       receiverId: 2,
      //     });
      //     break;

      //   case "1":
      //     newMessages.push({
      //       id: Math.floor(Math.random() * 1000),
      //       type: "basic",
      //       text: "To zvuči kao biznis putovanje, jesam li u pravu?",
      //       createdAt: new Date(),
      //       senderId: 1,
      //       receiverId: 2,
      //     });
      //     break;

      //   case "Da":
      //     newMessages.push({
      //       id: Math.floor(Math.random() * 1000),
      //       type: "basic",
      //       text: "Drago mi je 🙂. Nažalost naš hotel nema jednokrevetne sobe u ponudi, ali imamo nekoliko soba koje odgovaraju biznis korisnicima. \n\nPored toga, naš hotel poseduje nekoliko prostora za rad sa odličnom internet konekcijom koje možete besplatno koristiti. \n\nA posle napornog dana, možete se opustiti u našem čuvenom spa centru, besplatnom za goste hotela, što čini idealan spoj posla i opuštanja. \n\nNaše ljubazno osoblje ima dosta iskustva sa biznis putnicima, a ja ću se pobrinuti da vam celokupno iskustvo bude što ugodnije.",
      //       createdAt: new Date(),
      //       senderId: 1,
      //       receiverId: 2,
      //     });

      //     newMessages.push({
      //       id: Math.floor(Math.random() * 1000),
      //       type: "slider",
      //       createdAt: new Date(),
      //       senderId: 1,
      //       receiverId: 2,
      //       sliderArticles: [
      //         {
      //           id: 1,
      //           link: "deluxe-dvokrevetna-soba",
      //           title: "Deluks soba",
      //           subtitle: "Osunčana tokom celog dana",
      //           tag: "Najčešći izbor",
      //           image: DeluksSoba,
      //         },
      //         {
      //           id: 2,
      //           link: "superior-dvokrevetna-soba",
      //           title: "Superior dvokrevetna soba",
      //           subtitle: "Idealna za biznis korisnike",
      //           tag: "Biznis izbor",
      //           image: SuperiorSoba,
      //         },
      //         {
      //           id: 3,
      //           link: "komfort-dvokrevetna-soba",
      //           title: "Komfort dvokrevetna soba",
      //           subtitle: "Pogled na bazen",
      //           tag: "Pogled na bazen",
      //           image: KomfortDvokrevetnaSoba,
      //         },
      //       ],
      //     });

      //     break;

      //   case "Hvala tebi":
      //     newMessages.push({
      //       id: Math.floor(Math.random() * 1000),
      //       type: "basic",
      //       text: "Nema na čemu, tu smo da vam pomognemo.",
      //       createdAt: new Date(),
      //       senderId: 1,
      //       receiverId: 2,
      //     });

      //     break;

      //   // Sadrzaji hotela
      //   case "Interesuje me da saznam nešto više o sadržajima hotela":
      //     newMessages.push({
      //       id: Math.floor(Math.random() * 1000),
      //       type: "basic",
      //       text: "Naš hotel je poznat po svojoj udobnoj atmosferi, ali verovatno najpoznatiji po našem čuvenom spa centru, koji obiluje sadržajima.",
      //       createdAt: new Date(),
      //       senderId: 1,
      //       receiverId: 2,
      //     });

      //     newMessages.push({
      //       id: Math.floor(Math.random() * 1000),
      //       type: "multi-choice",
      //       text: "Molim vas odaberite o kom sadržaju želite da saznate više",
      //       createdAt: new Date(),
      //       senderId: 1,
      //       receiverId: 2,
      //       choices: [
      //         "Restoran",
      //         "Spa centar",
      //         "Teretana",
      //         "Sadržaji za decu",
      //         "Biznis sadržaji",
      //       ],
      //     });

      //     break;

      //   case "Spa centar":
      //     newMessages.push({
      //       id: Math.floor(Math.random() * 1000),
      //       type: "basic",
      //       text: "Naš spa centar obiluje sadržajima, koji su besplatni za goste hotela.\n\nNaš spa centar sadrži 3 tipa saune, tursko kupatilo, zatvoreni bazen, otvoreni bazen, tepidarijum, kao i sobu neverovatno dobrom atmosferom namenjenoj za masaže. Klinite na neki od sadržaja dole kako bi ste saznali više o tome.",
      //       createdAt: new Date(),
      //       senderId: 1,
      //       receiverId: 2,
      //     });

      //     newMessages.push({
      //       id: Math.floor(Math.random() * 1000),
      //       type: "slider",
      //       createdAt: new Date(),
      //       senderId: 1,
      //       receiverId: 2,
      //       sliderArticles: [
      //         {
      //           id: 1,
      //           link: "sauna",
      //           title: "Saune",
      //           subtitle: "3 tipa sauna za potpuno opuštanje",
      //           tag: "Besplatno za goste hotela",
      //           image: Saune,
      //         },
      //         {
      //           id: 2,
      //           link: "zatvoreni-bazen",
      //           title: "Zatvoreni bazen",
      //           subtitle: "Topla voda tokom cele godine",
      //           tag: "Besplatno za goste hotela",
      //           image: ZatvoreniBazen,
      //         },
      //         {
      //           id: 3,
      //           link: "teretana",
      //           title: "Teretana",
      //           subtitle: "Opremljena najnovijim spravama",
      //           tag: "Besplatno za goste hotela",
      //           image: Teretana,
      //         },
      //       ],
      //     });
      //     break;

      //   // Restoran
      //   case "Interesuje me da saznam nešto više o restoranu":
      //     newMessages.push({
      //       id: Math.floor(Math.random() * 1000),
      //       type: "basic",
      //       text: "Naš restoran je sjajan, ali mi nažalost trenutno fale informacije o samom restoranu, kao i o njegovoj ponudi.\n\nMolim vas da me ponovo pitate ovo isto pitanje za mesec i po dana. Nadam se da će me hotel naučiti do tad 😊",
      //       createdAt: new Date(),
      //       senderId: 1,
      //       receiverId: 2,
      //     });
      //     break;

      //   // Klik na kartice
      //   case "soba":
      //     newMessages.push({
      //       id: Math.floor(Math.random() * 1000),
      //       type: "basic",
      //       text: "Hvala što birate naš hotel. Hotel Sunce i ja vas željno isčekujemo 😊  ",
      //       createdAt: new Date(),
      //       senderId: 1,
      //       receiverId: 2,
      //     });
      //     break;

      //   case "sauna":
      //     newMessages.push({
      //       id: Math.floor(Math.random() * 1000),
      //       type: "basic",
      //       text: "Naš hotel poseduje 3 tipa sauna, različite temperature i vlažnosti, čija kombinovana temperatura omogućava opuštanje i najzategnutijih mišića.\n\nU ponudi imamo Finsku saunu, temperature 90 stepeni, Bio saunu, koja je veoma popularna kombinacija Finske saune i turskog kupatila i Soft saunu za one koji preferiraju niže temperature.\n\nHotel nudi više paketa za goste hotela koji podrazumevaju noćenje i neograničeno korišćenje Spa centra, medju kojima je napopularniji paket Sunčana jesen koji se može kombinovati sa smeštajima dole.",
      //       createdAt: new Date(),
      //       senderId: 1,
      //       receiverId: 2,
      //     });

      //     newMessages.push({
      //       id: Math.floor(Math.random() * 1000),
      //       type: "slider",
      //       createdAt: new Date(),
      //       senderId: 1,
      //       receiverId: 2,
      //       sliderArticles: [
      //         {
      //           id: 3,
      //           link: "superior-dvokrevetna-soba",
      //           title: "Superior dvokrevetna soba",
      //           subtitle: "Paket smeštaj + neograničen Spa",
      //           tag: "Najčešći izbor",
      //           image: SuperiorDvokrevetnaSoba,
      //         },
      //         {
      //           id: 4,
      //           link: "premium-porodična-soba.html",
      //           title: "Premium porodična soba",
      //           subtitle: "Paket smeštaj + neograničen Spa",
      //           tag: "2 + 2 ležaja",
      //           image: PremiumPorodicnaSoba,
      //         },
      //       ],
      //     });
      //     break;
      // }

      setTimeout(() => {
        this.activeChat.messages = this.activeChat.messages.concat(newMessages);
        this.loading = false;
      }, 2000);
    },
    async setCounter(counter) {
      this.counter = counter;
    },
  },
});
