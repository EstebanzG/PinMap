<script setup lang="ts">
import html2canvas from "html2canvas";
import constantColor from "~/utils/constant-color";
import type {Label} from "~/types/Label";
import {usePinStore} from "~/types/store/PinStore";
import {useZoomStore} from "~/types/store/ZoomStore";

const props = defineProps<{
  imageSrc: string,
  imageDimensions: {
    width: number
    height: number
  },
}>()

const pinStore = usePinStore();
const zoomStore = useZoomStore();

const imageElement = useTemplateRef('image-element')

onMounted(() => {
  document.addEventListener('keydown', (event) => {
    const isOnMacos = navigator.userAgent.includes('Mac OS')
    const ctrlKey = isOnMacos ? event.metaKey : event.ctrlKey
    if (event.key === 'z' && ctrlKey) {
      event.preventDefault();
      pinStore.deleteLastPin();
      pinStore.refreshView(zoomStore.zoomLevel);
      return;
    }
    if (event.key === 's' && ctrlKey) {
      event.preventDefault();
      exportImage()
      return;
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
  link.download = 'map.png';
  link.click();
}

const getLabelPositionY = (label: Label) => {
  const size = label.size / zoomStore.zoomLevel;

  return ((label.positionY - size) / props.imageDimensions.height) * 100;
}

const getLabelPositionX = (label: Label) => {
  const size = label.size / zoomStore.zoomLevel;

  return ((label.positionX - size / 2) / props.imageDimensions.width) * 100;
}

watch(() => zoomStore.zoomLevel, () => pinStore.refreshView());

defineExpose({
  exportImage,
});

</script>

<template>
  <div
      class="image-background"
      ref="image-element"
      :style="{
            backgroundImage: `url('${imageSrc}')`,
            width: `${imageDimensions.width}px`,
            height: `${imageDimensions.height}px`,
          }"
  >
    <PinIcon
        v-for="(pin, index) in pinStore.pinsToDisplay"
        :key="index"
        :color="pin.color ?? 'black'"
        :tooltipText="pin.name ?? ''"
        :shouldBeValidated="pin.shouldBeValidated ?? false"
        class="pin"
        :style="{
          top: `${getLabelPositionY(pin)}%`,
          left: `${getLabelPositionX(pin)}%`,
          height: `${pin.size / zoomStore.zoomLevel}px`,
          width: `${pin.size / zoomStore.zoomLevel}px`,
        }"
    />
    <ClusterIcon
        v-for="(cluster, index) in pinStore.clusterToDisplay"
        :key="index"
        class="pin"
        :color=constantColor.RED
        :nb-of-pins="cluster.numberOfPins"
        :names="cluster.names"
        :style="{
          top: `${getLabelPositionY(cluster)}%`,
          left: `${getLabelPositionX(cluster)}%`,
          height: `${cluster.size / zoomStore.zoomLevel}px`,
          width: `${cluster.size / zoomStore.zoomLevel}px`,
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

.pin {
  position: absolute;
}
</style>