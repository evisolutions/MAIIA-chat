<template>
  <div style="position: relative">
    <div
      class="py-2"
      :style="{
        width: '100%',
        overflow: 'hidden',
        paddingInline: '2px',
      }"
    >
      <div
        ref="carousel"
        @mousedown="startDrag"
        @mousemove="onDrag"
        @mouseup="endDrag"
        @mouseleave="endDrag"
        @touchstart="startDrag"
        @touchmove="onDrag"
        @touchend="endDrag"
        :style="{
          display: 'flex',
          gap: '20px',
          transition: isDragging ? 'none' : 'transform 0.3s ease',
          transform: `translateX(${translateX}px)`,
          cursor: isDragging ? 'grabbing' : 'grab',
        }"
      >
        <div
          v-for="(item, index) in articles"
          :key="index"
          :style="{
            width: '280px',
            flexShrink: '0',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer',
            borderRadius: '16px',
            backgroundColor: '#fff',
            overflow: 'hidden',
            border: '1px solid rgba(202, 196, 208, 1)',
          }"
          @click="handleArticleClick(item, messageId)"
        >
          <!-- Image -->
          <VImg
            :src="item.coverImageUrl || DeluksSoba"
            :style="{
              borderRadius: '16px 16px 0 0',
              height: '140px',
              userSelect: 'none',
              pointerEvents: 'none',
            }"
            cover
          />

          <!-- Title and Description -->
          <div class="pa-4">
            <VCardTitle
              class="pa-0"
              style="
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 4px;
                user-select: none;
              "
            >
              {{ item.name }}
            </VCardTitle>
            <VCardText
              class="pa-0"
              style="
                font-size: 14px;
                color: #666;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
                text-overflow: ellipsis;
                user-select: none;
                line-height: 18px;
              "
            >
              {{ item.description }}
            </VCardText>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation buttons -->
    <VBtn @click="prev" :disabled="!canSlidePrev" :style="buttonStyle('left')">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="25"
        viewBox="0 0 23 40"
        fill="none"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M22.1579 39.1632C21.0352 40.2789 19.2148 40.2789 18.092 39.1632L0.842017 22.0203C-0.280674 20.9045 -0.280674 19.0954 0.842016 17.9797L18.092 0.836789C19.2148 -0.278927 21.0352 -0.278927 22.1579 0.836788C23.2807 1.9525 23.2807 3.76165 22.1579 4.87737L6.94077 20L22.1579 35.1225C23.2807 36.2383 23.2807 38.0474 22.1579 39.1632Z"
          fill="#6B7280"
        />
      </svg>
    </VBtn>
    <VBtn @click="next" :disabled="!canSlideNext" :style="buttonStyle('right')">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="25"
        viewBox="0 0 23 40"
        fill="none"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M0.843038 0.836342C1.96582 -0.279432 3.78616 -0.279432 4.90894 0.836342L22.159 17.9793C23.2816 19.095 23.2816 20.9041 22.159 22.0198L4.90894 39.1627C3.78616 40.2784 1.96582 40.2784 0.843038 39.1627C-0.279711 38.047 -0.279711 36.2379 0.843038 35.1221L16.0602 19.9995L0.843038 4.87698C-0.279711 3.76117 -0.279711 1.95214 0.843038 0.836342Z"
          fill="#6B7280"
        />
      </svg>
    </VBtn>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  articles: {
    type: Array,
    required: true,
  },
  messageId: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["article-click"]);

const itemWidth = 300; // 280px card + 20px gap

// Carousel state
const translateX = ref(0);
const isDragging = ref(false);
const startX = ref(0);
const scrollStart = ref(0);
const isDrag = ref(false);

const canSlidePrev = computed(() => translateX.value < 0);

const canSlideNext = computed(() => {
  return translateX.value > -((props.articles.length - 1) * itemWidth);
});

const startDrag = (event) => {
  isDragging.value = true;
  isDrag.value = false;
  startX.value = event.clientX || event.touches[0].clientX;
  scrollStart.value = translateX.value;
};

const onDrag = (event) => {
  if (!isDragging.value) return;

  const clientX = event.clientX || event.touches[0].clientX;
  let newTranslateX = scrollStart.value + (clientX - startX.value);

  if (Math.abs(clientX - startX.value) > 5) {
    isDrag.value = true;
  }

  const maxTranslateX = 0;
  const minTranslateX = -((props.articles.length - 1) * itemWidth);

  translateX.value = Math.max(
    minTranslateX,
    Math.min(newTranslateX, maxTranslateX)
  );
};

const endDrag = () => {
  isDragging.value = false;

  const nearestItemIndex = Math.round(-translateX.value / itemWidth);
  const minTranslateX = -((props.articles.length - 1) * itemWidth);

  translateX.value = Math.max(
    minTranslateX,
    Math.min(-nearestItemIndex * itemWidth, 0)
  );
};

const prev = () => {
  if (canSlidePrev.value) {
    translateX.value += itemWidth;
  }
};

const next = () => {
  if (canSlideNext.value) {
    translateX.value -= itemWidth;
  }
};

const handleArticleClick = (item, messageId) => {
  if (isDrag.value) {
    isDrag.value = false;
    return;
  }
  emit("article-click", item, messageId);
};

const buttonStyle = (position) => ({
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  background: "rgba(242, 244, 251, 1)",
  border: "none",
  height: "60px",
  width: "60px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  fontSize: "16px",
  borderRadius: "50%",
  boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 6px",
  left: position === "left" ? "-30px" : "unset",
  right: position === "right" ? "-30px" : "unset",
  opacity:
    (canSlidePrev.value && position === "left") ||
    (canSlideNext.value && position === "right")
      ? "1"
      : "0.3",
  pointerEvents:
    (canSlidePrev.value && position === "left") ||
    (canSlideNext.value && position === "right")
      ? "auto"
      : "none",
});
</script>
