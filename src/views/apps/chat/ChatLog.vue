<script setup>
import { useChatStore } from "@/views/apps/chat/useChatStore";
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import "vue3-carousel/dist/carousel.css";
import { VAvatar, VChip, VImg } from "vuetify/lib/components/index.mjs";
import Carousel from "./Carousel.vue";

const emit = defineEmits(["send-message"]);

const store = useChatStore();
const chatLogRef = ref(null);

const chatAssistantId = 1;
const selectedChoice = ref(null);
// Add a new ref to track if a drag occurred
const isDrag = ref(false);

// Animated loading strings and dots
const loadingStrings = ["thinking", "analyzing", "formulating response"];
const loadingIndex = ref(0);
const dotCount = ref(1);
let stringInterval = null;
let dotInterval = null;

const msgGroups = computed(() => {
  if (!store.activeChat || !store.activeChat.messages) return [];

  return store.activeChat.messages.reduce((groups, msg) => {
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.senderId === msg.senderId) {
      lastGroup.messages.push(msg);
    } else {
      groups.push({
        senderId: msg.senderId,
        messages: [msg],
      });
    }
    return groups;
  }, []);
});

const handleSendMessageFromChoice = (message) => {
  selectedChoice.value = message;

  let msg = "";

  switch (message) {
    case "Sadržaji hotela":
      msg = "Reci mi nešto više o sadržajima hotela";
      break;
    case "Sobe":
      msg = "Reci mi nešto više o sobama";
      break;
    case "Restoran":
      msg = "Reci mi nešto više o restoranu";
      break;
    default:
      msg = message;
  }

  emit("send-message", msg);
};

const scrollToBottom = () => {
  nextTick(() => {
    if (chatLogRef.value) {
      chatLogRef.value.scrollTop = chatLogRef.value.scrollHeight;
    }
  });
};

watch(
  () => store.activeChat.messages,
  () => {
    scrollToBottom();
  },
  { deep: true }
);

const handleArticleClick = (article, messageId) => {
  if (isDrag.value) {
    isDrag.value = false; // Reset drag flag
    return; // Ignore click if it was a drag
  }

  store.handleStoreEvent({
    messageId,
    articleId: article.id,
    type: "click",
    name: "carousel",
    usage: "analytics",
  });

  window.open(article.redirectUrl, "_blank");
};

onMounted(() => {
  if (store.loading) {
    startLoadingAnimation();
  }
});

watch(
  () => store.loading,
  (val) => {
    if (val) {
      startLoadingAnimation();
    } else {
      stopLoadingAnimation();
    }
  }
);

function startLoadingAnimation() {
  loadingIndex.value = 0;
  dotCount.value = 1;
  stopLoadingAnimation();
  stringInterval = setInterval(() => {
    loadingIndex.value = (loadingIndex.value + 1) % loadingStrings.length;
  }, 4000);
  dotInterval = setInterval(() => {
    dotCount.value = (dotCount.value % 3) + 1;
  }, 500);
}

function stopLoadingAnimation() {
  if (stringInterval) clearInterval(stringInterval);
  if (dotInterval) clearInterval(dotInterval);
  stringInterval = null;
  dotInterval = null;
}

onUnmounted(() => {
  stopLoadingAnimation();
});
</script>

<template>
  <div
    ref="chatLogRef"
    class="chat-log pa-5 pt-4 pb-0 thin-scrollbar"
    style="overflow-y: auto; flex: 1"
  >
    <div
      v-for="(msgGrp, index) in msgGroups"
      :key="msgGrp.senderId + String(index)"
      class="chat-group d-flex align-start mb-4"
      :class="{ 'flex-row-reverse': msgGrp.senderId !== chatAssistantId }"
    >
      <div
        v-if="msgGrp.senderId === chatAssistantId"
        class="chat-avatar"
        :class="msgGrp.senderId !== chatAssistantId ? 'ms-4' : 'me-4'"
      >
        <VAvatar size="32">
          <VImg :src="store.property?.botIconUrl" />
        </VAvatar>
      </div>
      <div
        class="chat-body d-inline-flex flex-column"
        :class="
          msgGrp.senderId !== chatAssistantId ? 'align-end' : 'align-start'
        "
        style="max-width: 90%"
      >
        <div
          v-if="msgGrp.senderId === chatAssistantId"
          :class="msgGrp.senderId !== chatAssistantId ? 'ms-4' : 'me-4'"
        >
          <h4 class="mb-1" style="color: rgba(27, 32, 45, 1)">
            {{ store.property.botName }}
          </h4>
        </div>
        <div
          v-for="(msgData, msgIndex) in msgGrp.messages"
          :key="msgIndex"
          class="chat-content-wrapper"
          :class="
            msgGrp.messages.find((msg) => msg.type === 'carousel') &&
            'bg-transparent w-90'
          "
          :style="{
            maxWidth:
              msgGrp.messages.find((msg) => msg.type === 'carousel') &&
              '90% !important',
            background:
              msgGrp.messages.find((msg) => msg.type === 'carousel') &&
              'transparent',
          }"
        >
          <div
            class="chat-content text-body-1 py-2 px-4 mb-2"
            :class="[
              msgData.senderId === chatAssistantId
                ? 'chat-left bg-secondary'
                : 'chat-right bg-primary',
              msgData.type === 'carousel'
                ? 'bg-transparent w-100 p-0-important'
                : '',
            ]"
            style="border-radius: 8px; box-shadow: none"
            :style="{
              backgroundColor:
                msgData.senderId === chatAssistantId
                  ? 'rgba(242, 244, 251, 1)'
                  : 'var(--v-theme-main)',
              color:
                msgData.senderId === chatAssistantId
                  ? 'rgba(27, 32, 45, 1)'
                  : 'rgba(255, 255, 255, 1)',
              background: msgData.type === 'carousel' && 'transparent',
              width: msgData.type === 'carousel' && '100%',
              padding: msgData.type === 'carousel' && '0 !important',
            }"
          >
            <p
              v-if="msgData.type === 'basic'"
              v-html="msgData.text"
              class="mb-0 pre-line"
              style="line-height: 21px; font-size: 14px"
            ></p>

            <p
              v-if="msgData.type === 'multi-choice'"
              v-html="msgData.text"
              class="mb-0 pre-line"
              style="line-height: 21px; font-size: 14px"
            ></p>

            <div v-if="msgData.type === 'carousel'" style="position: relative">
              <Carousel
                :articles="msgData.articles"
                :messageId="msgData.messageId"
                @article-click="handleArticleClick"
              />
            </div>
          </div>
          <div
            v-if="msgData.type === 'multi-choice'"
            class="d-flex flex-wrap mt-2 mb-1"
            style="gap: 6px"
          >
            <VChip
              v-for="(choice, index) in msgData.choices"
              :key="index"
              @click="handleSendMessageFromChoice(choice)"
              :variant="choice === selectedChoice ? 'elevated' : 'outlined'"
              class="cursor-pointer text-wrap chip-choice py-1"
              :class="{ 'chip-choice-selected': choice === selectedChoice }"
              :disabled="store.loading"
              size="x-small"
              style="
                height: fit-content !important;
                border: 1px solid var(--v-theme-main);
                color: var(--v-theme-main);
                font-size: 12px;
              "
              :style="{
                backgroundColor:
                  choice === selectedChoice ? 'var(--v-theme-main)' : '',
                color:
                  choice === selectedChoice
                    ? 'rgba(236, 241, 244, 1)'
                    : 'var(--v-theme-main)',
                borderColor: 'var(--v-theme-main)',
              }"
              >{{ choice }}</VChip
            >
          </div>
        </div>
        <div
          v-if="!msgGrp.messages.find((msg) => msg.initialOptions)"
          :class="{ 'text-right': msgGrp.senderId !== chatAssistantId }"
          class="d-flex align-center justify-end w-100 gap-2"
        >
          <p
            class=""
            style="
              font-weight: 400;
              font-size: 11px;
              line-height: 10px;
              letter-spacing: 0%;
              text-align: right;
              color: rgba(121, 124, 123, 1);
              transform: translateX(10px);
            "
          >
            {{
              new Date(
                msgGrp.messages[msgGrp.messages.length - 1].createdAt
              ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            }}
          </p>
        </div>
      </div>
    </div>
    <!-- Typing animation for chat assistant -->
    <div v-if="store.loading" class="chat-group d-flex align-start mb-8">
      <div class="chat-avatar me-4">
        <VAvatar size="32">
          <VImg :src="store.property?.botIconUrl" />
        </VAvatar>
      </div>
      <div class="chat-body d-inline-flex flex-column w-100 align-start">
        <div
          class="chat-content text-body-1 py-2 px-4 mb-2 bg-secondary"
          style="
            border-radius: 8px;
            background-color: rgba(242, 244, 251, 1);
            box-shadow: none;
          "
        >
          <div
            style="
              position: relative;
              min-height: 22px;
              min-width: 120px;
              font-size: 15px;
              font-style: italic;
            "
          >
            {{ $t(loadingStrings[loadingIndex])
            }}<span v-for="n in dotCount" :key="n">.</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
