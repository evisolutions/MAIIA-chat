<template>
  <Chat :property-id="propertyId" />
</template>

<script setup>
const propertyId = parseInt(new URLSearchParams(window.location.search).get('propertyId'), 10)
</script>
