<script setup lang="ts">
import {useZoomStore} from "~/types/store/ZoomStore";

const props = defineProps<{
  color: string,
  nbOfPins: number,
  names: string[],
}>();

const zoomStore = useZoomStore();

const displayedNames = computed(() => {
  const maxNames = 10;
  return props.names.length > maxNames
      ? [...props.names.slice(0, maxNames), `...`]
      : props.names;
});
</script>

<template>
  <div class="svg-container">
    <svg :fill="color" height="100%" width="100%" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
      <path
          d="M192 0C86 0 0 86 0 192c0 77.4 27 99 172.3 309.7c9.5 13.8 29.9 13.8 39.4 0C357 291 384 269.4 384 192C384 86 298 0 192 0z" />
      <circle cx="192" cy="192" r="150" fill="white" />
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
    <div
        class="tooltip parkinsans-text"
        :style="{
          fontSize: `${12 / zoomStore.zoomLevel}px`,
          width: 'fit-content',
          padding: `${5 / zoomStore.zoomLevel}px`
      }"
    >
      <ul>
        <li v-for="(name, index) in displayedNames" :key="index">{{ name }}</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.tooltip ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.tooltip ul li {
  margin: 2px 0;
}

</style>
