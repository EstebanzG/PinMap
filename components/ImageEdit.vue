<script setup lang="ts">
import {defineExpose, ref} from 'vue'
import html2canvas from "html2canvas";

const props = defineProps<{
  imageSrc: string
  imageDimensions: {
    width: number
    height: number
  }
  isPinSettingsOpen: boolean | null
  pinSettingsName: string | null
  pinSettingsColor: string | null
  pinSettingsSize: number
}>()

const pins = ref<{
  x: number,
  y: number,
  color?: string | null,
  name?: string | null
  size: number
}[]>([])

const imageElement = useTemplateRef('image-element')

const addPin = (event: MouseEvent) => {
  const { offsetX, offsetY } = event;

  const imageElementWidth = imageElement.value!.clientWidth;
  const imageElementHeight = imageElement.value!.clientHeight;

  const xPercentage = ((offsetX - props.pinSettingsSize / 2) / imageElementWidth) * 100;
  const yPercentage = ((offsetY - props.pinSettingsSize) / imageElementHeight) * 100;

  pins.value.push({
    x: xPercentage,
    y: yPercentage,
    name: props.pinSettingsName,
    color: props.pinSettingsColor,
    size: props.pinSettingsSize,
  });
};

const rollback = () => {
  pins.value.pop()
}

onMounted(() => {
  document.addEventListener('keydown', (event) => {
    const isOnMacos = navigator.userAgent.includes('Mac OS')
    const ctrlKey = isOnMacos ? event.metaKey : event.ctrlKey
    if (event.key === 'z' && ctrlKey) {
      event.preventDefault();
      rollback()
    }
  })
})

const exportImage = async () => {
  if (!imageElement.value) {
    return;
  }
  const canvas = await html2canvas(imageElement.value);
  const imageUrl = canvas.toDataURL('image/png');

  const link = document.createElement('a');
  link.href = imageUrl;
  link.download = 'image-with-cubes.png';
  link.click();
}

defineExpose({
  exportImage,
  addPin,
})

</script>

<template>
  <div
      class="image-background"
      ref="image-element"
      :style="{
            backgroundImage: imageSrc ? `url('${imageSrc}')` : 'none',
            width: `${imageDimensions.width}px`,
            height: `${imageDimensions.height}px`,
          }"
      @click="(event) =>  isPinSettingsOpen ? addPin(event) : null"
  >
    <Icon
        name="heroicons:map-pin-16-solid"
        v-for="(cube, index) in pins"
        :key="index"
        class="center-square"
        :style="{
          top: `${cube.y}%`,
          left: `${cube.x}%`,
          backgroundColor: cube.color ?? 'black',
          height: `${cube.size}px`,
          width: `${cube.size}px`,
        }"
    ></Icon>
  </div>
</template>

<style scoped>
.image-background {
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
}

.center-square {
  position: absolute;
}
</style>
