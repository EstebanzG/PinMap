<script setup lang="ts">
import { ref } from 'vue'
import html2canvas from 'html2canvas'

defineProps<{
  imageSrc: string
  imageDimensions: {
    width: number
    height: number
  }
}>()

const cubes = ref<{
  x: number,
  y: number,
  color?: string,
}[]>([])

const imageElement = ref<HTMLElement | null>(null)

const handleClick = (event: MouseEvent) => {
  const { offsetX, offsetY } = event;

  const xPercentage = (offsetX / imageElement.value!.clientWidth) * 100;
  const yPercentage = (offsetY / imageElement.value!.clientHeight) * 100;

  cubes.value.push({ x: xPercentage, y: yPercentage });
}

const exportImage = async () => {
  if (!imageElement.value) return;
  const canvas = await html2canvas(imageElement.value);
  const imageUrl = canvas.toDataURL('image/png');

  const link = document.createElement('a');
  link.href = imageUrl;
  link.download = 'image-with-cubes.png';
  link.click();
}
</script>

<template>
  <div
      class="image-background"
      :style="{
            backgroundImage: imageSrc ? `url('${imageSrc}')` : 'none',
            width: `${imageDimensions.width}px`,
            height: `${imageDimensions.height}px`,
          }"
      @click="handleClick"
      ref="imageElement"
  >
    <div
        v-for="(cube, index) in cubes"
        :key="index"
        class="center-square"
        :style="{
          top: `${cube.y}%`,
          left: `${cube.x}%`,
          backgroundColor: cube.color ?? 'black',
        }"
    ></div>
  </div>

  <button @click="exportImage">Export Image</button>
</template>

<style scoped>
.image-background {
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
}

.center-square {
  width: 50px;
  height: 50px;
  position: absolute;
}
</style>
