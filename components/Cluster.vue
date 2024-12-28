<script setup lang="ts">
defineProps<{
  color: string,
  nbOfPins: number,
}>()
</script>

<template>
  <svg :fill="color" height="800px" width="800px" xmlns="http://www.w3.org/2000/svg"
       viewBox="0 0 384 512">
    <path
        d="M192 0C86 0 0 86 0 192c0 77.4 27 99 172.3 309.7c9.5 13.8 29.9 13.8 39.4 0C357 291 384 269.4 384 192C384 86 298 0 192 0z"/>
    <circle cx="192" cy="192" r="150" fill="white"/>
    <text
        x="192"
        y="192"
        text-anchor="middle"
        dominant-baseline="middle"
        font-size="150"
        class="parkinsans-title"
        fill="black"
    >
      {{ nbOfPins }}
    </text>
  </svg>
</template>

<style scoped>

</style>