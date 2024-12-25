<script setup lang="ts">
import {defineExpose, ref} from 'vue'
import html2canvas from "html2canvas";

interface Pin {
  positionX: number,
  positionY: number,
  x: number,
  y: number,
  color?: string | null,
  name?: string | null
  size: number
}

const props = defineProps<{
  imageSrc: string,
  imageDimensions: {
    width: number
    height: number
  },
  zoomScale: number,
  isPinSettingsOpen: boolean | null,
  pinSettingsName: string | null,
  pinSettingsColor: string | null,
  pinSettingsSize: number,
}>()

const pins = ref<Pin[]>([])

const imageElement = useTemplateRef('image-element')

const addPin = (event: MouseEvent) => {
  const {offsetX, offsetY} = event;

  const imageElementWidth = props.imageDimensions.width;
  const imageElementHeight = props.imageDimensions.height;

  const xPercentage = ((offsetX - props.pinSettingsSize / 2) / imageElementWidth) * 100;
  const yPercentage = ((offsetY - props.pinSettingsSize) / imageElementHeight) * 100;

  pins.value.push({
    positionX: offsetX,
    positionY: offsetY,
    x: xPercentage,
    y: yPercentage,
    name: props.pinSettingsName,
    color: props.pinSettingsColor,
    size: props.pinSettingsSize,
  });
};


onMounted(() => {
  document.addEventListener('keydown', (event) => {
    const isOnMacos = navigator.userAgent.includes('Mac OS')
    const ctrlKey = isOnMacos ? event.metaKey : event.ctrlKey
    if (event.key === 'z' && ctrlKey) {
      event.preventDefault();
      pins.value.pop()
    }
    if (event.key === 's' && ctrlKey) {
      event.preventDefault();
      exportImage()
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

const getPinPositionY = (pin: Pin) => {
  const size = pin.size / props.zoomScale;

  return ((pin.positionY - size) / props.imageDimensions.height) * 100;
}

const getPinPositionX = (pin: Pin) => {
  const size = pin.size / props.zoomScale;

  return ((pin.positionX - size / 2) / props.imageDimensions.width) * 100;
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
        v-for="(pin, index) in pins"
        :key="index"
        class="center-square"
        :style="{
          top: `${getPinPositionY(pin)}%`,
          left: `${getPinPositionX(pin)}%`,
          backgroundColor: pin.color ?? 'black',
          height: `${pin.size / zoomScale}px`,
          width: `${pin.size / zoomScale}px`,
        }"
    />
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
