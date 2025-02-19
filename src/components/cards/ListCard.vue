<template>
  <VCard>
    <VImg :src="card.image" height="200" />

    <div>
      <h3>{{ card.title }}</h3>
      <p>{{ card.subtitle }}</p>
    </div>

    <div>
      <VIcon icon="ri-walk-line" />

      <p>
        <VIcon icon="ri-map-pin-line" />
        {{ card.distance }}
      </p>
    </div>
  </VCard>
</template>

<script setup>
const props = defineProps({
  card: Object,
});
</script>

<style lang="scss" scoped></style>
