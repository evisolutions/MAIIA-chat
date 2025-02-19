<template>
  <PerfectScrollbar
    class="horizontal-scroll-container"
    ref="filtersBar"
    :options="{ wheelPropagation: false }"
    tag="nav"
  >
    <VChip
      v-for="filter in filters"
      :key="filter.id"
      :class="{ 'filter-active': filter.active }"
      @click="toggleFilter(filter)"
      class="filter-chip"
      outlined
      color="secodary"
    >
      <VIcon :icon="filter.icon" />

      <span>{{ filter.name }}</span>
    </VChip>
  </PerfectScrollbar>
</template>

<script setup>
import { PerfectScrollbar } from "vue3-perfect-scrollbar";

const filters = ref([
  {
    id: 1,
    name: "All",
    icon: "ri-filter-3-line",
    active: true,
  },
  {
    id: 2,
    name: "Restaurants",
    icon: "ri-restaurant-2-line",
    active: false,
  },
  {
    id: 3,
    name: "Spa",
    icon: "ri-spa-line",
    active: false,
  },
  {
    id: 4,
    name: "Hotels",
    icon: "ri-hotel-bed-line",
    active: false,
  },
]);
</script>

<style lang="scss" scoped></style>
