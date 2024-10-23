<script setup>
import Avatar from "@/assets/images/avatars/avatar-1.png";
import { useChatStore } from "@/views/apps/chat/useChatStore";
import { computed, nextTick, ref, watch } from "vue";
import { Carousel, Navigation, Slide } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";

const emit = defineEmits(["send-message"]);

const store = useChatStore();
const chatLogRef = ref(null);

const chatAssistantId = 1;
const selectedChoice = ref(null);

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

  emit("send-message", message);
};

const handleCardClick = (item) => {
  if (item.title.includes("soba")) {
    emit("send-message", "soba");
  }

  if (item.title === "Saune") {
    emit("send-message", "sauna");
  }
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
</script>

<template>
  <div
    ref="chatLogRef"
    class="chat-log pa-5 pb-0 thin-scrollbar"
    style="height: 465px; overflow-y: auto; flex: 1"
  >
    <div
      v-for="(msgGrp, index) in msgGroups"
      :key="msgGrp.senderId + String(index)"
      class="chat-group d-flex align-start mb-8"
      :class="{ 'flex-row-reverse': msgGrp.senderId !== chatAssistantId }"
    >
      <div
        v-if="msgGrp.senderId === chatAssistantId"
        class="chat-avatar"
        :class="msgGrp.senderId !== chatAssistantId ? 'ms-4' : 'me-4'"
      >
        <VAvatar size="32">
          <VImg :src="Avatar" />
        </VAvatar>
      </div>
      <div
        class="chat-body d-inline-flex flex-column w-100"
        :class="
          msgGrp.senderId !== chatAssistantId ? 'align-end' : 'align-start'
        "
      >
        <div
          v-if="msgGrp.senderId === chatAssistantId"
          :class="msgGrp.senderId !== chatAssistantId ? 'ms-4' : 'me-4'"
        >
          <h4 class="mb-1">MAIIA Sunčica</h4>
        </div>
        <div
          v-for="(msgData, msgIndex) in msgGrp.messages"
          :key="msgIndex"
          class="chat-content-wrapper"
        >
          <div
            class="chat-content text-body-1 py-2 px-4 elevation-2 mb-2"
            :class="[
              msgData.senderId === chatAssistantId
                ? 'bg-surface chat-left'
                : 'bg-primary text-white chat-right',
              msgData.type === 'slider'
                ? 'bg-transparent w-100 p-0-important'
                : '',
            ]"
          >
            <p v-if="msgData.type === 'basic'" class="mb-0 pre-line">
              {{ msgData.text }}
            </p>

            <p v-if="msgData.type === 'multi-choice'" class="mb-0 pre-line">
              {{ msgData.text }}
            </p>

            <div v-if="msgData.type === 'slider'">
              <Carousel :items-to-show="1.5" snap-align="start" class="w-100">
                <Slide
                  v-for="(item, index) in msgData.sliderArticles"
                  :key="index"
                >
                  <VCard
                    class="w-100 position-relative cursor-pointer border slider-card"
                    elevation="0"
                    style="height: 100%"
                  >
                    <div
                      class="position-absolute d-flex gap-1 flex-wrap w-100"
                      style="top: 5px; left: 5px"
                    >
                      <VChip
                        class="me-2"
                        color="#fff"
                        variant="elevated"
                        style="z-index: 99"
                        size="x-small"
                        >{{ item.tag }}
                      </VChip>
                    </div>

                    <a
                      :href="`https://suncehotel.rs/${item.link}`"
                      target="_blank"
                      @click="handleCardClick(item)"
                    >
                      <VImg :src="item.image" cover style="height: 100%" />
                    </a>
                    <VCardItem class="pt-2 pb-0 px-2">
                      <VCardTitle class="text-start">{{
                        item.title
                      }}</VCardTitle>
                    </VCardItem>

                    <VCardText class="pb-2 pt-0 px-2 text-start">
                      {{ item.subtitle }}
                    </VCardText>
                  </VCard>
                </Slide>

                <template #addons>
                  <Navigation />
                </template>
              </Carousel>
            </div>
          </div>
          <div
            v-if="msgData.type === 'multi-choice'"
            class="d-flex gap-2 flex-wrap mt-2"
          >
            <VChip
              v-for="(choice, index) in msgData.choices"
              :key="index"
              @click="handleSendMessageFromChoice(choice)"
              :variant="choice === selectedChoice ? 'elevated' : 'outlined'"
              class="cursor-pointer"
              :color="choice === selectedChoice ? 'primary' : 'secondary'"
              size="x-small"
              >{{ choice }}</VChip
            >
          </div>
        </div>
        <div
          :class="{ 'text-right': msgGrp.senderId !== chatAssistantId }"
          class="d-flex align-center justify-end w-100 gap-2"
        >
          <p class="text-x-sm text-disabled mb-0" style="letter-spacing: 0.4px">
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
          <VImg :src="Avatar" />
        </VAvatar>
      </div>
      <div class="chat-body d-inline-flex flex-column w-100 align-start">
        <div
          class="chat-content text-body-1 py-2 px-4 elevation-2 bg-surface chat-left"
        >
          <div class="typing">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.chat-log {
  .chat-content {
    border-end-end-radius: 6px;
    border-end-start-radius: 6px;

    p {
      overflow-wrap: anywhere;
    }

    &.chat-left {
      border-start-end-radius: 6px;
    }

    &.chat-right {
      border-start-start-radius: 6px;
    }
  }
}

.bg-surface {
  background-color: #f2f4fb !important;
}

.bg-transparent {
  background: transparent !important;
  box-shadow: none !important;

  & > div {
    width: 100% !important;
  }

  .v-card-title {
    font-size: 14px !important;
  }

  .v-card-text {
    font-size: 13px !important;
  }
}

.cursor-pointer {
  cursor: pointer !important;
}

.carousel__track {
  align-items: flex-start;
}

.carousel__slide {
  padding: 5px;
  padding-top: 0;
}

.ps__thumb-x {
  display: none;
}

.pre-line {
  white-space: pre-line;
}

.p-0-important {
  padding-left: 0 !important;
  padding-right: 0 !important;
}

.chat-group:last-of-type {
  margin-bottom: 0 !important;
}

.carousel .v-chip__content {
  font-size: 11px !important;
}

$dot-width: 10px;
$dot-color: #1b202d;
$speed: 1.5s;

.typing {
  position: relative;
  height: 22px;
  width: $dot-width * 4.5;

  span {
    content: "";
    animation: blink $speed infinite;
    animation-fill-mode: both;
    height: $dot-width;
    width: $dot-width;
    background: $dot-color;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 50%;

    &:nth-child(2) {
      animation-delay: 0.2s;
      margin-left: $dot-width * 1.5;
    }

    &:nth-child(3) {
      animation-delay: 0.4s;
      margin-left: $dot-width * 3;
    }
  }
}

@keyframes blink {
  0% {
    opacity: 0.1;
  }
  20% {
    opacity: 1;
  }
  100% {
    opacity: 0.1;
  }
}

.text-x-sm {
  font-size: 12px;
}

.thin-scrollbar {
  /* custom scrollbar */
  &::-webkit-scrollbar {
    width: 20px;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #d6dee1;
    border-radius: 20px;
    border: 6px solid transparent;
    background-clip: content-box;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #c7cdcf;
  }
}

.chat-content,
.v-field--variant-solo,
.v-field--variant-solo-filled {
  box-shadow: none !important;
}

.slider-card {
  box-shadow: none !important;
}

.slider-card:hover {
  box-shadow: 0px 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
}

.carousel__next,
.carousel__prev {
  background: rgba(242, 244, 251, 1);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  transition: all 0.3s ease;
}

.carousel__next:hover:not(.carousel__next--disabled),
.carousel__prev:hover:not(.carousel__prev--disabled) {
  background-color: rgba(93, 95, 239, 1);
  color: #fff;
}

.carousel__next {
  right: -25px;
}

.carousel__prev {
  left: -25px;
}
</style>
