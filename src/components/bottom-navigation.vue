<template>
  <v-bottom-navigation v-model="activeLink" color="primary" grow mode="shift">
    <v-btn
      v-for="link in navLinks"
      :key="link.value"
      :value="link.value"
      @click="$router.push(link.path)"
      class="bottom-navigation-btn"
    >
      <v-icon :icon="link.icon" size="22" />
      <span class="text-capitalize line-clamp-1">{{ link.label }}</span>
    </v-btn>
  </v-bottom-navigation>
</template>

<script setup>
import { ref } from "vue";

const activeLink = ref("");

// Computed property to determine the navigation links based on user role
const navLinks = [
  { value: "root", path: "/", icon: "ri-home-smile-line", label: "Home" },
  {
    value: "explore",
    path: "/explore",
    icon: "ri-map-2-line",
    label: "Explore",
  },
  {
    value: "restaurant",
    path: "/restaurant",
    icon: "ri-star-line",
    label: "Restaurant",
  },
  {
    value: "spa",
    path: "/spa",
    icon: "ri-sparkling-line",
    label: "Spa",
  },
  {
    value: "profile-tab",
    path: "/company/profile/overview",
    icon: "ri-user-5-line",
    label: "Profile",
  },
];
</script>

<style>
.bottom-navigation-btn {
  max-width: 25% !important;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.badge .v-badge__badge {
  top: -5px;
  right: -30px;
}
</style>
