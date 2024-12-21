<script setup lang="ts">

import EditMap from "~/components/EditMap.vue";
</script>

<template>
  <header>
    <h1 class="parkinsans-title">
      Add pins to your <span>maps</span>
    </h1>
  </header>
  <EditMap />
</template>

<style scoped>
header {
  display: flex;
  justify-content: center;
}

h1 span {
  text-decoration: underline;
}
</style>