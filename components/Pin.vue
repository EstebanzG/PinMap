<script setup lang="ts">
defineProps<{
  color: string,
  tooltipText: string,
  zoomScale: number
}>();
</script>

<template>
  <div class="svg-container">
    <svg
        :fill="color"
        height="100%"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 384 512"
    >
      <path d="M192 0C86 0 0 86 0 192c0 77.4 27 99 172.3 309.7c9.5 13.8 29.9 13.8 39.4 0C357 291 384 269.4 384 192C384 86 298 0 192 0z"/>
    </svg>
    <span
        class="tooltip parkinsans-text"
        :style="{
          fontSize: `${12 / zoomScale}px`,
          width: 'fit-content',
          padding: `${5 / zoomScale}px`,
        }"
    >{{ tooltipText }}</span>
  </div>
</template>

<style scoped>
.tooltip {
  visibility: hidden;
  background-color: white;
  text-align: center;

  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);

  opacity: 0;
}

.svg-container:hover .tooltip {
  visibility: visible;
  opacity: 1;
}
</style>
